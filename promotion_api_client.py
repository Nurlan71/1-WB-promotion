import logging
import requests
import json
from datetime import datetime, timedelta # Добавлено для get_sales_stats
import time # Добавлено для get_active_campaign_list
from typing import Dict, List, Any, Optional, Union
from wildberries_rate_limiter import WildberriesRateLimiter # Убедитесь, что этот файл есть

# Конфигурация логгера уже должна быть в promotion_main.py,
# но если этот модуль используется отдельно, можно оставить базовую конфигурацию здесь
# или лучше получать logger = logging.getLogger(__name__) и настраивать в main
logger = logging.getLogger(__name__)

class WildberriesAPIClient:
    def __init__(self, api_key: str, api_key_analytics: Optional[str] = None): # api_key_promotion -> api_key
        self.api_key = api_key # Был api_key_promotion
        self.api_key_analytics = api_key_analytics
        
        if not self.api_key: # Проверка основного ключа
            logger.warning("Основной API_KEY (для продвижения) не предоставлен.")
        if not self.api_key_analytics:
            logger.warning("API_KEY_ANALYTICS не предоставлен (опционально).")

        # Заголовки теперь формируются в _make_request_impl
        self.base_url_promotion = "https://advert-api.wildberries.ru"
        self.base_url_analytics = "https://seller-analytics-api.wildberries.ru"
        self.timeout = 30

        self.rate_limiter = WildberriesRateLimiter(
            initial_delay=1.0, # Можно начать с 1 секунды
            max_delay=120.0,
            backoff_factor=1.5, # Уменьшил фактор, чтобы не так агрессивно увеличивать задержку
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
            if 'analytics' in url or 'seller-analytics-api' in url:
                if self.api_key_analytics:
                    current_api_key = self.api_key_analytics
                else:
                    logger.error(f"API_KEY_ANALYTICS не предоставлен для запроса к {url}, но он требуется.")
                    # Можно возбудить исключение или вернуть фиктивный ответ с ошибкой
                    # raise ValueError(f"Missing API_KEY_ANALYTICS for {url}")
                    # Для примера просто логируем и позволяем запросу провалиться дальше (если WB позволит без ключа)
            else: # Предполагаем, что это запрос к API продвижения
                if self.api_key:
                    current_api_key = self.api_key
                else:
                    logger.error(f"Основной API_KEY (продвижения) не предоставлен для запроса к {url}, но он требуется.")
                    # raise ValueError(f"Missing main API_KEY for {url}")
            
            if current_api_key:
                 headers['Authorization'] = current_api_key
            elif not ('Authorization' in headers and headers['Authorization']): # Если ключ не был установлен и не был передан
                 logger.error(f"Отсутствует Authorization header и подходящий API ключ для запроса к {url}")
                 # Можно поднять исключение, чтобы rate limiter это поймал
                 # raise ValueError(f"Authorization header missing for {url}")


        if method.upper() == 'POST' and 'Content-Type' not in headers:
            headers['Content-Type'] = 'application/json'
            
        body_to_log = "No body"
        if data is not None:
            try:
                body_to_log = json.dumps(data)
            except TypeError:
                body_to_log = str(data) # на случай если данные не сериализуемы в JSON для лога

        full_url_log = url
        if params:
            param_string = '&'.join([f"{k}={v}" for k, v in params.items()])
            full_url_log = f"{url}?{param_string}"
        
        logger.info(f"Request: {method} {full_url_log} | Headers: {headers} | Body: {body_to_log}") # Добавил лог заголовков
        
        try:
            if method.upper() == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=self.timeout)
            elif method.upper() == 'POST':
                if isinstance(data, (dict, list)):
                    response = requests.post(url, headers=headers, json=data, params=params, timeout=self.timeout)
                else:
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
            # Логирование уже будет в RateLimiter или здесь, если ошибка не связана с HTTP статусом
            logger.error(f"Request exception for {url}: {str(e)}", exc_info=True)
            raise # Передаем исключение дальше, чтобы rate_limiter мог его обработать

    # ПЕРЕНЕСЕННЫЕ И АДАПТИРОВАННЫЕ МЕТОДЫ:

    def get_active_campaign_list(self) -> List[Dict[str, Any]]:
        """Получает список активных кампаний (статус 9) типов 8 и 9."""
        count_url = f"{self.base_url_promotion}/adv/v1/promotion/count"
        logger.info(f"Запрос общего количества и ID кампаний с {count_url}")
        
        # Для _make_request передаем только метод и URL, заголовки он подставит сам
        try:
            counts_response_obj = self._make_request('GET', count_url)
            counts_response = counts_response_obj.json() if counts_response_obj.content else {}
        except Exception as e:
            logger.error(f"Ошибка при запросе /adv/v1/promotion/count: {e}")
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
                            elif isinstance(item, int): # На случай если формат снова изменится
                                all_campaign_ids_type_8_9.append(item)
        
        if not all_campaign_ids_type_8_9:
            logger.info("Не найдено ID кампаний типов 8 или 9 (после /adv/v1/promotion/count).")
            return []
            
        logger.info(f"Найдено ID кампаний типов 8/9 для детальной проверки: {len(all_campaign_ids_type_8_9)}")

        active_filtered_campaigns: List[Dict[str, Any]] = []
        all_campaigns_details_url = f"{self.base_url_promotion}/adv/v1/promotion/adverts"
        batch_size = 50 # WB рекомендует не более 50 ID в запросе /adverts
        
        for i in range(0, len(all_campaign_ids_type_8_9), batch_size):
            id_batch: List[int] = all_campaign_ids_type_8_9[i:i+batch_size]
            
            logger.info(f"Запрос деталей для пакета ID кампаний (POST): {id_batch}")
            try:
                detailed_batch_response_obj = self._make_request('POST', all_campaigns_details_url, data=id_batch)
                detailed_batch_response = detailed_batch_response_obj.json() if detailed_batch_response_obj.content else []
            except Exception as e:
                logger.error(f"Ошибка при POST запросе деталей кампаний {id_batch}: {e}")
                detailed_batch_response = None # или continue, чтобы пропустить этот батч

            if detailed_batch_response and isinstance(detailed_batch_response, list):
                for camp_data in detailed_batch_response:
                    if isinstance(camp_data, dict) and camp_data.get('status') == 9 and camp_data.get('type') in [8, 9]:
                        subject_id = None
                        nm_ids: List[int] = []
                        # Логика извлечения subject_id и nm_ids из params остается прежней
                        if camp_data.get('params') and isinstance(camp_data['params'], list) and len(camp_data['params']) > 0:
                            param_item = camp_data['params'][0]
                            if isinstance(param_item, dict):
                                subject_id = param_item.get('subjectId') or param_item.get('setId') or param_item.get('menuId')
                                if camp_data.get('type') == 8: 
                                    nm_ids = param_item.get('nms', []) 
                                elif camp_data.get('type') == 9: # Аукцион
                                     # Для типа 9 (Аукцион), subjectId может быть напрямую в params[0].id или params[0].subjectId
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
            else:
                 if isinstance(detailed_batch_response, (list, dict)) and not detailed_batch_response:
                      logger.warning(f"Получен пустой ответ (list/dict) при запросе деталей кампаний {id_batch}.")
                 elif detailed_batch_response is not None: # Проверяем, что не None после неудачного try-except
                      logger.warning(f"Неожиданный ответ или нет данных при запросе деталей кампаний {id_batch}: {detailed_batch_response}")
            
            # Rate Limiter сам управляет задержками, явный time.sleep(1.1) здесь может быть избыточен
            # Но если для /adverts есть специфичные очень жесткие лимиты, не покрываемые общим rate limiter'ом, можно оставить небольшую паузу
            # time.sleep(0.5) # Например, уменьшенная пауза

        logger.info(f"Найдено активных кампаний (статус 9, типы 8 или 9) после детального запроса и клиентской фильтрации: {len(active_filtered_campaigns)}")
        if not active_filtered_campaigns:
             print("Не найдено активных кампаний (АРК или Аукцион) для обработки после детального запроса.")
        return active_filtered_campaigns

    def get_campaign_stats(self, campaign_ids: List[int]) -> Optional[List[Dict[str, Any]]]: # Изменено для соответствия старому интерфейсу и логам
        """Получает статистику для указанных кампаний."""
        url = f"{self.base_url_promotion}/adv/v2/fullstats"
        # API /adv/v2/fullstats ожидает список ID в таком формате: [{"id": id1}, {"id": id2}]
        # Однако, если вы всегда передаете список из одного ID, как в example_usage и логах,
        # то [ {"id": campaign_ids[0]} ] будет правильным, если campaign_ids это [один_id]
        # Если же campaign_ids это просто один int, то [{"id": campaign_ids}]
        # Судя по вашим логам, вы передавали payload: [{"id": 24921656}], что значит список из одного элемента.
        # Чтобы сохранить совместимость с тем, как его вызывают другие модули (передавая один ID),
        # а также с example_usage (который передает список ID), сделаем так:
        if not isinstance(campaign_ids, list): # Если передали одиночный ID
            payload = [{"id": campaign_ids}]
        else: # Если передали список ID
            payload = [{"id": c_id} for c_id in campaign_ids] # Это для случая, если АПИ реально принимает несколько ID сразу

        logger.info(f"Запрос статистики кампании(й) ID(s): {campaign_ids} с payload: {json.dumps(payload)}")
        try:
            response_obj = self._make_request('POST', url, data=payload)
            # /adv/v2/fullstats возвращает список словарей
            return response_obj.json() if response_obj and response_obj.content else None
        except Exception as e:
            logger.error(f"Не удалось получить статистику кампаний {campaign_ids}: {str(e)}", exc_info=True)
            return None


    def get_sales_stats(self) -> Optional[Dict[str, Any]]:
        """Получает статистику продаж за заданный период."""
        url = f"{self.base_url_analytics}/api/v2/nm-report/detail"
        # Формат даты из ваших рабочих логов
        date_format = '%Y-%m-%d %H:%M:%S'
        
        # Начальная дата - можно сделать настраиваемой или более динамической
        # Пример: 30 дней назад от текущего момента
        days_back = 30 
        date_from_obj = datetime.now() - timedelta(days=days_back)
        date_from_obj = date_from_obj.replace(hour=0, minute=0, second=0, microsecond=0)

        # Конечная дата - "вчера", т.к. данные за сегодня могут быть неполными или API может их не отдавать сразу.
        # Wildberries API часто требует задержку в несколько часов для актуальных данных.
        # API /nm-report/detail часто имеет ограничение "select a date no later than YYYY-MM-DD HH:MM:SS"
        # Эта задержка (8 часов из ваших старых логов) может быть актуальна.
        now_local = datetime.now()
        # API ожидает время в Europe/Moscow, но сам расчет date_to_safe лучше делать от UTC или локального с пониманием смещения
        # Пусть date_to_safe будет конец предыдущего дня по Москве.
        # Если сейчас 9 мая 10:00 МСК, то date_to_safe будет 8 мая 23:59:59 МСК.
        # Wildberries API для nm-report/detail может требовать, чтобы конечная дата была не позднее чем на X часов назад от текущего момента.
        # Судя по ошибке из лога: "select a date no later than 2025-05-07 12:06:25" (когда запрос был в 15:06),
        # это примерно 3 часа назад. Сделаем с запасом - 4 часа.
        date_to_limit = now_local - timedelta(hours=4) 
        date_to_obj = (now_local - timedelta(days=1)).replace(hour=23, minute=59, second=59, microsecond=0) # Конец вчерашнего дня

        # Убедимся, что date_to_obj не позже date_to_limit
        date_to_obj = min(date_to_obj, date_to_limit.replace(hour=23, minute=59, second=59, microsecond=0))


        if date_to_obj < date_from_obj:
             logger.warning(f"Расчетная конечная дата ({date_to_obj.strftime(date_format)}) для статистики продаж раньше начальной ({date_from_obj.strftime(date_format)}). Используем только начальную дату.")
             date_to_obj = date_from_obj.replace(hour=23, minute=59, second=59) # Как минимум один день статистики
             if date_to_obj > date_to_limit: # Проверка на ограничение API
                 date_to_obj = date_to_limit.replace(hour=23, minute=59, second=59)
             if date_to_obj < date_from_obj:
                 logger.error("Невозможно сформировать корректный период для статистики продаж после корректировок.")
                 return None

        date_from_str = date_from_obj.strftime(date_format)
        date_to_str = date_to_obj.strftime(date_format)

        payload = {
            "brandNames": [], "objectIDs": [], "tagIDs": [], "nmIDs": [],
            "timezone": "Europe/Moscow", 
            "period": {"begin": date_from_str, "end": date_to_str},
            "orderBy": {"field": "ordersSumRub", "mode": "desc"},
            "page": 1
        }
        logger.info(f"Запрос статистики продаж с payload: {json.dumps(payload)}")
        try:
            response_obj = self._make_request('POST', url, data=payload)
            # Обработка ответа, аналогичная вашему старому коду
            if response_obj is None or not response_obj.content:
                return None
            response_json = response_obj.json()
            if isinstance(response_json, dict) and response_json.get("error"):
                error_detail = response_json.get('errorText') or response_json.get('errors') or str(response_json)
                logger.error(f"Ошибка от API статистики продаж: {error_detail}")
                return None
            return response_json
        except Exception as e:
            logger.error(f"Ошибка при запросе статистики продаж: {str(e)}", exc_info=True)
            return None

    def get_current_bid_api(self, campaign_id: int, campaign_type: int, campaign_info: Dict[str, Any]) -> Optional[float]:
        logger.warning(f"[ЗАГЛУШКА] get_current_bid_api для campaign_id={campaign_id}, type={campaign_type}. Возвращаем 50.00 руб.")
        # Здесь в будущем будет реальный запрос к API для получения текущей ставки
        # Пример:
        # url = f"{self.base_url_promotion}/adv/v0/cpm?advert_id={campaign_id}" # Это старый эндпоинт, найти актуальный
        # try:
        #     response_obj = self._make_request('GET', url)
        #     data = response_obj.json()
        #     # Логика извлечения ставки из data
        #     return float(bid_value_from_data)
        # except Exception as e:
        #     logger.error(f"Ошибка получения текущей ставки для {campaign_id}: {e}")
        #     return None
        return 50.0

    def update_campaign_bid_api(self, campaign_id: int, campaign_type: int, new_bid_kop: int, params_for_update: Dict[str, Any]) -> bool:
        logger.warning(f"[ЗАГЛУШКА] update_campaign_bid_api для campaign_id={campaign_id}, type={campaign_type}, new_bid_kop={new_bid_kop}, params: {params_for_update}. Обновление НЕ выполнено.")
        print(f"INFO: [ЗАГЛУШКА] Ставка для кампании {campaign_id} была бы изменена на {new_bid_kop / 100:.2f} руб.")
        # Реальный API вызов будет здесь. Например:
        # url = f"{self.base_url_promotion}/adv/v0/cpm"
        # payload = {
        #     "advertId": campaign_id,
        #     "type": campaign_type, # Уточнить, нужен ли тип кампании для обновления ставки
        #     "cpm": new_bid_kop,
        #     "param": params_for_update.get('subject_id') # Это пример, нужно смотреть документацию
        # }
        # if campaign_type == 8 and params_for_update.get('nm_ids'): # Для АРК может понадобиться nmId
        #    payload["nmId"] = params_for_update['nm_ids'][0] if params_for_update['nm_ids'] else None # Пример
        #
        # try:
        #     response_obj = self._make_request('POST', url, data=payload)
        #     # Проверить успешность по status_code или содержимому ответа
        #     return response_obj.status_code == 200 
        # except Exception as e:
        #     logger.error(f"Ошибка обновления ставки для {campaign_id}: {e}")
        #     return False
        return True