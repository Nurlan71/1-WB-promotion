from typing import Optional, Tuple, Dict, List, Any
from promotion_api_client import WildberriesAPIClient
from promotion_data_processing import analyze_campaign_stats
import logging
import os
import time

logger = logging.getLogger(__name__)

def load_config_from_file(config_file="promotion_config.txt") -> Dict[str, Optional[str]]:
    config: Dict[str, Optional[str]] = {
        'API_KEY_PROMOTION': None, 'API_KEY_ANALYTICS': None, 'WB_CABINET_ID': None
    }
    try:
        with open(config_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and '=' in line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    config[key.strip()] = value.strip()
    except FileNotFoundError:
        logger.error(f"Конфигурационный файл '{config_file}' не найден для automation.")
        print(f"Ошибка: Конфигурационный файл '{config_file}' не найден для automation.")
        return {}
    except Exception as e:
        logger.error(f"Ошибка при чтении конфигурационного файла '{config_file}' для automation: {e}", exc_info=True)
        print(f"Ошибка чтения файла '{config_file}' для automation.")
        return {}

    config_log_safe = {k: v for k, v in config.items() if 'API_KEY' not in k}
    logger.info(f"Конфигурация для automation загружена: {config_log_safe}")

    if not config.get('API_KEY_PROMOTION'):
       logger.warning("API_KEY_PROMOTION отсутствует в promotion_config.txt для automation.")
    return config

class PromotionAutomator:
    def __init__(self, api_client: WildberriesAPIClient):
        self.api = api_client
        self.TARGET_CTR = 5.0
        self.TARGET_ROI = 150.0
        self.ROI_PRIORITY_THRESHOLD = 100.0 
        self.MAX_CPC = 15.0
        self.BID_INCREASE_STEP = 5  
        self.BID_DECREASE_STEP = 3  
        self.MAX_BID_OVERALL = 500 
        self.MIN_BID = {8: 155, 9: 190} 

    def get_campaign_performance_metrics(self, campaign_id: int) -> Optional[Dict[str, Any]]:
        logger.info(f"Automator: Запрос статистики для кампании {campaign_id}")
        stats_response_list = self.api.get_campaign_stats([campaign_id]) 
        
        if stats_response_list is None:
            logger.warning(f"Automator: Не удалось получить ответ API статистики для кампании {campaign_id} (клиент вернул None).")
            return None
            
        analyzed_stats = analyze_campaign_stats(stats_response_list)

        if not analyzed_stats:
            logger.warning(f"Automator: Не удалось проанализировать статистику для кампании {campaign_id}. Ответ API (если был): {stats_response_list}")
            return None
        try:
            roi_str = analyzed_stats.get('roi', "0.0%").replace('%', '')
            roi_val = float('inf') if roi_str == 'inf' else float(roi_str)

            metrics = {
                'ctr': float(analyzed_stats.get('ctr', "0.0%").replace('%', '')),
                'roi': roi_val,
                'cpc': float(analyzed_stats.get('cpc', "0.0")),
                'orders': int(analyzed_stats.get('total_orders', 0)),
                'views': int(analyzed_stats.get('total_impressions', 0))
            }
            return metrics
        except (ValueError, TypeError, KeyError) as e:
            logger.error(f"Automator: Ошибка парсинга метрик для кампании {campaign_id}: {e}. Данные: {analyzed_stats}", exc_info=True)
            return None

    def optimize_bid_for_campaign(self, campaign_info: Dict[str, Any]):
        campaign_id = campaign_info.get('id')
        campaign_type = campaign_info.get('type')
        campaign_name = campaign_info.get('name', 'N/A')

        if not campaign_id or campaign_type not in self.MIN_BID:
            logger.error(f"Automator: Неверные данные кампании для оптимизации: ID={campaign_id}, Тип={campaign_type}")
            return

        logger.info(f"--- Оптимизация ставки для кампании ID: {campaign_id} (Тип: {campaign_type}, Имя: {campaign_name}) ---")

        current_bid_rub = self.api.get_current_bid_api(campaign_id, campaign_type, campaign_info)
        if current_bid_rub is None:
             logger.error(f"Automator: Не удалось получить текущую ставку для кампании {campaign_id} (заглушка вернула None). Пропуск.")
             print(f"Automator: Не удалось получить текущую ставку для кампании {campaign_id}.")
             return

        performance_metrics = self.get_campaign_performance_metrics(campaign_id)
        if not performance_metrics:
            logger.warning(f"Automator: Нет данных о производительности для кампании {campaign_id}. Пропуск.")
            print(f"Automator: Нет данных о производительности для кампании {campaign_id}.")
            return

        ctr = performance_metrics['ctr']
        roi = performance_metrics['roi']
        cpc = performance_metrics['cpc']

        logger.info(f"Automator: Текущие метрики: Ставка={current_bid_rub:.2f} RUB, CTR={ctr:.2f}%, ROI={roi if roi != float('inf') else 'inf'}%, CPC={cpc:.2f} RUB")

        new_bid_rub = current_bid_rub
        min_bid_for_type = self.MIN_BID.get(campaign_type, 50) 

        should_increase_primary = (ctr >= self.TARGET_CTR and (roi >= self.TARGET_ROI or roi == float('inf')) and cpc <= self.MAX_CPC)
        should_increase_sales_priority = (roi >= self.ROI_PRIORITY_THRESHOLD or roi == float('inf'))
        should_decrease = (cpc > self.MAX_CPC or (roi < self.ROI_PRIORITY_THRESHOLD and roi != float('inf')))

        if should_increase_primary or should_increase_sales_priority:
            new_bid_rub = current_bid_rub + self.BID_INCREASE_STEP
            logger.info(f"Automator: Условие ПОВЫШЕНИЯ ставки. Расчетная ставка: {new_bid_rub:.2f}")
        elif should_decrease:
            new_bid_rub = current_bid_rub - self.BID_DECREASE_STEP
            logger.info(f"Automator: Условие ПОНИЖЕНИЯ ставки. Расчетная ставка: {new_bid_rub:.2f}")
        else:
            logger.info(f"Automator: Условия для изменения ставки не выполнены.")

        new_bid_rub = max(new_bid_rub, min_bid_for_type)
        new_bid_rub = min(new_bid_rub, self.MAX_BID_OVERALL)
        new_bid_rub = round(new_bid_rub) 

        if new_bid_rub != round(current_bid_rub):
            logger.info(f"Automator: Рассчитана новая ставка для кампании {campaign_id}: {new_bid_rub:.2f} RUB (старая: {current_bid_rub:.2f} RUB)")
            params_for_update = {
                'subject_id': campaign_info.get('subject_id'), 
                'nm_ids': campaign_info.get('nm_ids', [])      
            }
            self.api.update_campaign_bid_api(
                campaign_id=campaign_id, campaign_type=campaign_type,
                new_bid_kop=int(new_bid_rub * 100), params_for_update=params_for_update
            )
        else:
            logger.info(f"Automator: Изменение ставки не требуется для кампании {campaign_id}. Ставка остается {new_bid_rub:.2f} RUB.")

def main():
    config = load_config_from_file()
    if not config or not config.get('API_KEY_PROMOTION'):
        logger.error("Отсутствует API_KEY_PROMOTION или конфигурация не загружена. automation завершен.")
        print("Критическая ошибка: API_KEY_PROMOTION не найден. Automation не может быть запущен.")
        return

    api_key_promotion = config.get('API_KEY_PROMOTION')
    api_key_analytics = config.get('API_KEY_ANALYTICS') 

    api_client = WildberriesAPIClient(api_key=api_key_promotion, api_key_analytics=api_key_analytics)
    automator = PromotionAutomator(api_client)

    logger.info("Automator: Получение списка активных кампаний для автоматизации...")
    
    active_campaigns = []
    try:
        active_campaigns = api_client.get_active_campaign_list()
    except Exception as e:
        logger.error(f"Критическая ошибка при получении списка активных кампаний в automation: {e}", exc_info=True)
        print(f"Не удалось получить список активных кампаний для automation: {e}")
        return

    if not active_campaigns:
        logger.info("Automator: Нет активных кампаний (Тип 8 или 9) для автоматизации.")
        print("Automator: Нет активных кампаний (АРК или Аукцион) для автоматизации.")
        return

    print(f"Automator: Найдено {len(active_campaigns)} активных кампаний. Начинаем оптимизацию ставок...")
    all_stats_processed_successfully = True
    for i, campaign_info in enumerate(active_campaigns):
        try:
            automator.optimize_bid_for_campaign(campaign_info)

            # --- УБРАНА ИЛИ УМЕНЬШЕНА ПАУЗА ---
            # if i < len(active_campaigns) - 1:
            #     pause_duration = 1 # Пример небольшой паузы
            #     logger.info(f"Automator: Дополнительная пауза на {pause_duration} сек перед следующей кампанией...")
            #     time.sleep(pause_duration)

        except Exception as e:
             all_stats_processed_successfully = False
             campaign_id_log = campaign_info.get('id', 'N/A')
             logger.error(f"Automator: Ошибка при оптимизации кампании {campaign_id_log}: {e}", exc_info=True)
             print(f"Automator: Ошибка при оптимизации кампании {campaign_id_log}.")
    
    if not all_stats_processed_successfully:
         logger.warning("Automator: Не для всех кампаний удалось выполнить оптимизацию (возможны ошибки получения статистики).")

    logger.info("Automator: Цикл автоматизации завершен.")
    print("Automator: Цикл автоматизации завершен.")

if __name__ == "__main__":
    if not logging.getLogger().hasHandlers():
        logging.basicConfig(
            filename='promotion_logs.txt', 
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
            filemode='a'
        )
    main()