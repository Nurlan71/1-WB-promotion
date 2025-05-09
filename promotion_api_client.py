import logging
import requests
import json
from datetime import datetime, timedelta
import time
from typing import Dict, List, Any, Optional, Union
from wildberries_rate_limiter import WildberriesRateLimiter

logger = logging.getLogger(__name__)

class WildberriesAPIClient:
    def __init__(self, api_key: str, api_key_analytics: Optional[str] = None):
        self.api_key = api_key
        self.api_key_analytics = api_key_analytics
        
        if not self.api_key:
            logger.warning("Основной API_KEY (для продвижения) не предоставлен.")
        # Аналитический ключ может быть опциональным, поэтому только warning если его нет
        if not self.api_key_analytics:
            logger.info("API_KEY_ANALYTICS не предоставлен (опционально, для статистики продаж).")

        self.base_url_promotion = "https://advert-api.wildberries.ru"
        self.base_url_analytics = "https://seller-analytics-api.wildberries.ru"
        self.timeout = 30

        self.rate_limiter = WildberriesRateLimiter(
            initial_delay=5.0,  # Увеличена начальная задержка
            max_delay=180.0,
            backoff_factor=2.0, # Увеличен фактор для более быстрого роста задержки
            jitter=True,
            max_retries=5 
        )
        self._make_request = self.rate_limiter.apply(self._make_request_impl)
        
    def _make_request_impl(self, method: str, url: str, headers_override: Dict[str, str] = None, 
                       data: Any = None, params: Dict[str, Any] = None) -> requests.Response:
        headers = {}
        if headers_override:
            headers.update(headers_override)
            
        if 'Authorization' not in headers:
            current_api_key = None
            # Определяем, какой ключ использовать, в зависимости от URL
            if 'seller-analytics-api.wildberries.ru' in url:
                if self.api_key_analytics:
                    current_api_key = self.api_key_analytics
                else:
                    logger.error(f"API_KEY_ANALYTICS не предоставлен для запроса к {url}, но он требуется для этого домена.")
                    # Можно возбудить исключение, чтобы RateLimiter это поймал и не делал запрос
                    # raise ValueError(f"Отсутствует API_KEY_ANALYTICS для запроса к {url}")
            elif 'advert-api.wildberries.ru' in url: # Предполагаем, что это запрос к API продвижения
                if self.api_key:
                    current_api_key = self.api_key
                else:
                    logger.error(f"Основной API_KEY (продвижения) не предоставлен для запроса к {url}, но он требуется для этого домена.")
                    # raise ValueError(f"Отсутствует основной API_KEY для запроса к {url}")
            else: # Неизвестный домен
                 logger.warning(f"Не удалось определить подходящий API ключ для URL: {url}")


            if current_api_key:
                 headers['Authorization'] = current_api_key
            elif not ('Authorization' in headers and headers['Authorization']):
                 logger.error(f"Отсутствует Authorization header и подходящий API ключ не был найден для запроса к {url}")
                 # Можно поднять исключение, чтобы rate limiter это поймал
                 # raise ValueError(f"Authorization header missing for {url}")


        if method.upper() == 'POST' and 'Content-Type' not in headers:
            headers['Content-Type'] = 'application/json'
            
        body_to_log = "No body"
        if data is not None:
            try:
                body_to_log = json.dumps(data)
            except TypeError:
                body_to_log = str(data)

        full_url_log = url
        if params:
            param_list = []
            for k,v_list_item in params.items():
                if isinstance(v_list_item, list):
                    for v_item in v_list_item:
                        param_list.append(f"{k}={v_item}")
                else:
                    param_list.append(f"{k}={v_list_item}")
            if param_list:
                param_string = '&'.join(param_list)
                full_url_log = f"{url}?{param_string}"
        
        logger.info(f"Request: {method} {full_url_log} | Headers: {headers} | Body: {body_to_log}")
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=self.timeout)
            elif method.upper() == 'POST':
                if isinstance(data, (dict, list)): # Проверяем, что data это dict или list перед передачей в json=
                    response = requests.post(url, headers=headers, json=data, params=params, timeout=self.timeout)
                else: # Если data это строка (например, уже сериализованный JSON), используем data=
                    response = requests.post(url, headers=headers, data=data, params=params, timeout=self.timeout)
            else:
                logger.error(f"Unsupported HTTP method: {method}")
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            logger.info(f"Response from URL: {response.url} | Status: {response.status_code}")
            
            if response.status_code >= 400:
                logger.error(f"Request to {response.url} failed with status {response.status_code}. Response: {response.text}")
                
            response.raise_for_status()
            return response
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request exception for {url}: {str(e)}", exc_info=True)
            raise

    def get_active_campaign_list(self) -> List[Dict[str, Any]]:
        count_url = f"{self.base_url_promotion}/adv/v1/promotion/count"
        logger.info(f"Запрос общего количества и ID кампаний с {count_url}")
        
        try:
            counts_response_obj = self._make_request('GET', count_url)
            counts_response = counts_response_obj.json() if counts_response_obj and counts_response_obj.content else {}
        except Exception as e:
            logger.error(f"Ошибка при запросе /adv/v1/promotion/count: {e}", exc_info=True)
            return []

        if not counts_response or not isinstance(counts_response, dict) or 'adverts' not in counts_response:
            logger.error(f"Не удалось получить общее количество кампаний с {count_url} или ответ некорректен: {counts_response}")
            return []

        all_campaign_ids_type_8_9: List[int] = []
        if isinstance(counts_response.get('adverts'), list):
            for group in counts_response['adverts']:
                if isinstance(group, dict) and group.get('type') in [8, 9]: 
                    advert_list_items = group.get('advert_list', [])
                    if isinstance(advert_list_items, list):
                        for item in advert_list_items:
                            if isinstance(item, dict) and 'advertId' in item:
                                all_campaign_ids_type_8_9.append(item['advertId']) 
                            elif isinstance(item, int):
                                all_campaign_ids_type_8_9.append(item)
        
        if not all_campaign_ids_type_8_9:
            logger.info("Не найдено ID кампаний типов 8 или 9 (после /adv/v1/promotion/count).")
            return []
            
        logger.info(f"Найдено ID кампаний типов 8/9 для детальной проверки: {len(all_campaign_ids_type_8_9)}")

        active_filtered_campaigns: List[Dict[str, Any]] = []
        all_campaigns_details_url = f"{self.base_url_promotion}/adv/v1/promotion/adverts"
        batch_size = 50
        
        for i in range(0, len(all_campaign_ids_type_8_9), batch_size):
            id_batch: List[int] = all_campaign_ids_type_8_9[i:i+batch_size]
            
            logger.info(f"Запрос деталей для пакета ID кампаний (POST): {id_batch}")
            detailed_batch_response = None # Инициализируем
            try:
                detailed_batch_response_obj = self._make_request('POST', all_campaigns_details_url, data=id_batch)
                if detailed_batch_response_obj and detailed_batch_response_obj.content:
                    if detailed_batch_response_obj.status_code == 204: # No content
                        detailed_batch_response = []
                        logger.info(f"Получен статус 204 (No Content) для пакета ID: {id_batch}")
                    else:
                        detailed_batch_response = detailed_batch_response_obj.json()
                else:
                     detailed_batch_response = [] if detailed_batch_response_obj and detailed_batch_response_obj.status_code == 204 else None


            except Exception as e:
                logger.error(f"Ошибка при POST запросе деталей кампаний {id_batch}: {e}", exc_info=True)
                detailed_batch_response = None

            if detailed_batch_response and isinstance(detailed_batch_response, list):
                for camp_data in detailed_batch_response:
                    if isinstance(camp_data, dict) and camp_data.get('status') == 9 and camp_data.get('type') in [8, 9]:
                        subject_id = None
                        nm_ids: List[int] = []
                        if camp_data.get('params') and isinstance(camp_data['params'], list) and len(camp_data['params']) > 0:
                            param_item = camp_data['params'][0]
                            if isinstance(param_item, dict):
                                subject_id = param_item.get('subjectId') or param_item.get('setId') or param_item.get('menuId')
                                if camp_data.get('type') == 8: 
                                    nm_ids = param_item.get('nms', []) 
                                elif camp_data.get('type') == 9: 
                                    subject_id = param_item.get('id') or param_item.get('subjectId')
                        active_filtered_campaigns.append({
                            'id': camp_data.get('advertId'),
                            'name': camp_data.get('name'),
                            'type': camp_data.get('type'),
                            'status': camp_data.get('status'),
                            'subject_id': subject_id,
                            'nm_ids': nm_ids
                        })
            elif detailed_batch_response and isinstance(detailed_batch_response, dict) and "error" in detailed_batch_response:
                 logger.error(f"Ошибка API при запросе деталей кампаний {id_batch}: {detailed_batch_response.get('errorText', detailed_batch_response)}")
            elif detailed_batch_response is None:
                logger.warning(f"Не получен ответ (None) при запросе деталей кампаний {id_batch} (возможно, из-за ошибки на предыдущем шаге).")
            else: # catches empty list specifically if not caught by 204 or other specific conditions
                 if isinstance(detailed_batch_response, (list, dict)) and not detailed_batch_response and detailed_batch_response_obj.status_code != 204 :
                      logger.warning(f"Получен пустой ответ (list/dict, не 204) при запросе деталей кампаний {id_batch}.")
                 elif detailed_batch_response_obj.status_code != 204: # Не логировать как warning если это ожидаемый 204
                      logger.warning(f"Неожиданный ответ или нет данных при запросе деталей кампаний {id_batch}: {detailed_batch_response}")
            
        logger.info(f"Найдено активных кампаний (статус 9, типы 8 или 9) после детального запроса и клиентской фильтрации: {len(active_filtered_campaigns)}")
        if not active_filtered_campaigns:
             print("Не найдено активных кампаний (АРК или Аукцион) для обработки после детального запроса.")
        return active_filtered_campaigns

    def get_campaign_stats(self, campaign_ids: List[int]) -> Optional[List[Dict[str, Any]]]:
        url = f"{self.base_url_promotion}/adv/v2/fullstats"
        if not isinstance(campaign_ids, list):
             # Ожидаем список, но если пришел один int, оборачиваем его
             logger.warning(f"get_campaign_stats ожидал список ID, но получил {type(campaign_ids)}. Оборачиваю в список.")
             payload = [{"id": campaign_ids}]
        elif not campaign_ids : # Пустой список ID
            logger.warning("get_campaign_stats получил пустой список campaign_ids.")
            return []
        else:
            payload = [{"id": c_id} for c_id in campaign_ids]

        logger.info(f"Запрос статистики кампании(й) ID(s): {campaign_ids} с payload: {json.dumps(payload)}")
        try:
            response_obj = self._make_request('POST', url, data=payload)
            return response_obj.json() if response_obj and response_obj.content else None
        except Exception as e:
            logger.error(f"Не удалось получить статистику кампаний {campaign_ids}: {str(e)}", exc_info=True)
            return None

    def get_sales_stats(self) -> Optional[Dict[str, Any]]:
        url = f"{self.base_url_analytics}/api/v2/nm-report/detail"
        date_format = '%Y-%m-%d %H:%M:%S'
        
        now_utc = datetime.utcnow() # Используем UTC для расчетов, чтобы избежать путаницы с часовыми поясами сервера
        
        # Конечная дата: WB API для nm-report/detail часто требует, чтобы 'end' был не позднее X часов назад.
        # Из лога: "invalid value 2025-05-07 15:06:00 +0300 MSK, select a date no later than 2025-05-07 12:06:25"
        # Это примерно 3 часа разницы. Возьмем с запасом 4 часа.
        # Сервер WB, вероятно, работает по Московскому времени (UTC+3).
        # Если сейчас 18:00 UTC, то в Москве 21:00. Лимит будет 21:00 - 4ч = 17:00 МСК.
        # Нам нужно сформировать date_to_str в формате 'YYYY-MM-DD HH:MM:SS' (предположительно, локальное для МСК).
        
        # Рассчитываем время в МСК (UTC+3) и отнимаем необходимый лаг
        # moscow_time_now = now_utc + timedelta(hours=3)
        # end_date_limit_msk = moscow_time_now - timedelta(hours=4) # 4 часа назад от текущего времени МСК
        
        # Упрощенный подход: берем начало текущего дня UTC минус 1 час (для гарантии, что данные уже есть)
        # Конечная дата должна быть в прошлом.
        # API ожидает время как бы "локальное" для сервера, вероятно МСК.
        # Но передавать будем строки без явного указания TZ, как в успешных логах.

        # Попробуем сделать как в логе, где был успешный запрос на продажи:
        # "period": {"begin": "2025-04-16 00:00:00", "end": "2025-05-07 12:03:22"}
        # Конечная дата была примерно на 8 часов раньше момента запроса (20:03)

        end_date_obj_utc = now_utc - timedelta(hours=8) # 8 часов назад от текущего UTC
        start_date_obj_utc = end_date_obj_utc - timedelta(days=30) # за последние 30 дней до этой точки

        date_from_str = start_date_obj_utc.strftime(date_format)
        date_to_str = end_date_obj_utc.strftime(date_format)

        payload = {
            "brandNames": [], "objectIDs": [], "tagIDs": [], "nmIDs": [],
            "timezone": "Europe/Moscow", # Указываем часовой пояс для интерпретации периода на стороне WB
            "period": {"begin": date_from_str, "end": date_to_str},
            "orderBy": {"field": "ordersSumRub", "mode": "desc"},
            "page": 1
        }
        logger.info(f"Запрос статистики продаж с payload: {json.dumps(payload)}")
        try:
            response_obj = self._make_request('POST', url, data=payload)
            if response_obj is None or not response_obj.content:
                 logger.warning(f"Получен пустой ответ от API статистики продаж ({url}).")
                 return None
            response_json = response_obj.json()
            if isinstance(response_json, dict) and response_json.get("error"):
                error_detail = response_json.get('errorText') or response_json.get('errors') or str(response_json)
                logger.error(f"Ошибка от API статистики продаж ({url}): {error_detail}. Payload: {json.dumps(payload)}")
                return None
            return response_json
        except Exception as e:
            logger.error(f"Ошибка при запросе статистики продаж ({url}): {str(e)}", exc_info=True)
            return None

    def get_current_bid_api(self, campaign_id: int, campaign_type: int, campaign_info: Dict[str, Any]) -> Optional[float]:
        logger.warning(f"[ЗАГЛУШКА] get_current_bid_api для campaign_id={campaign_id}, type={campaign_type}. Возвращаем 50.00 руб.")
        return 50.0

    def update_campaign_bid_api(self, campaign_id: int, campaign_type: int, new_bid_kop: int, params_for_update: Dict[str, Any]) -> bool:
        logger.warning(f"[ЗАГЛУШКА] update_campaign_bid_api для campaign_id={campaign_id}, type={campaign_type}, new_bid_kop={new_bid_kop}, params: {params_for_update}. Обновление НЕ выполнено.")
        print(f"INFO: [ЗАГЛУШКА] Ставка для кампании {campaign_id} была бы изменена на {new_bid_kop / 100:.2f} руб.")
        return True