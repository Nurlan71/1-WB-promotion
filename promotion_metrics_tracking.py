from datetime import datetime
from typing import Optional, Dict, List, Any
from promotion_api_client import WildberriesAPIClient 
from promotion_data_processing import analyze_campaign_stats, analyze_sales_data
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
        logger.error(f"Конфигурационный файл '{config_file}' не найден.")
        print(f"Ошибка: Конфигурационный файл '{config_file}' не найден.")
        return {} 
    except Exception as e:
        logger.error(f"Ошибка при чтении конфигурационного файла '{config_file}': {e}", exc_info=True)
        print(f"Ошибка чтения файла '{config_file}'.")
        return {}

    config_log_safe = {k: v for k, v in config.items() if 'API_KEY' not in k}
    logger.info(f"Конфигурация для metrics_tracking загружена: {config_log_safe}")

    if not config.get('API_KEY_PROMOTION'):
       logger.warning("API_KEY_PROMOTION отсутствует в promotion_config.txt для metrics_tracking.")
    if not config.get('API_KEY_ANALYTICS'):
       logger.warning("API_KEY_ANALYTICS отсутствует в promotion_config.txt для metrics_tracking (может быть необходим).")
    return config

def track_campaign_metrics(api_client: WildberriesAPIClient, campaign_info: Dict[str, Any]) -> bool:
    campaign_id = campaign_info.get('id')
    campaign_name = campaign_info.get('name', 'N/A')
    if not campaign_id:
        logger.error("track_campaign_metrics: campaign_info не содержит 'id'")
        return False

    logger.info(f"Отслеживание метрик для кампании ID: {campaign_id} (Имя: {campaign_name})")
    print(f"Отслеживание метрик для кампании ID: {campaign_id} (Имя: {campaign_name})...")
    
    stats_list = api_client.get_campaign_stats([campaign_id]) 

    if stats_list is None: 
        logger.warning(f"Статистика для кампании {campaign_id} не получена (API клиент вернул None).")
        print(f"Не удалось получить статистику для кампании ID: {campaign_id} (ошибка API).")
        return False
    
    analyzed = analyze_campaign_stats(stats_list) 
    if analyzed:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_msg = (
            f"[{timestamp}] Кампания {campaign_id} ({campaign_name}) - "
            f"CTR: {analyzed['ctr']}, ROI: {analyzed['roi']}, CPC: {analyzed.get('cpc', 'N/A')}, "
            f"Клики: {analyzed['total_clicks']}, Показы: {analyzed['total_impressions']}, Затраты: {analyzed['total_cost']:.2f}, "
            f"Заказы (из стат. кампании): {analyzed['total_orders']}"
        )
        print(log_msg)
        logger.info(log_msg)
        return True
    else:
        logger.warning(f"Не удалось проанализировать статистику для кампании {campaign_id}. Ответ API (если был): {stats_list}")
        print(f"Не удалось получить/проанализировать статистику для кампании ID: {campaign_id}.")
    return False

def track_sales_metrics(api_client: WildberriesAPIClient) -> bool:
    logger.info("Отслеживание статистики продаж (общая)")
    print("Отслеживание общих показателей продаж...")
    sales_data = api_client.get_sales_stats()
    if not sales_data: 
        logger.warning("Данные о продажах не получены (API клиент вернул None).")
        print("Не удалось получить данные о продажах.")
        return False

    analyzed = analyze_sales_data(sales_data)
    if analyzed:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_msg = (
            f"[{timestamp}] Продажи (общие) - "
            f"Кол-во заказов: {analyzed['total_sales']}, "
            f"Выручка: {analyzed['total_revenue']} руб., "
            f"Средний чек: {analyzed['average_order_value']} руб."
        )
        print(log_msg)
        logger.info(log_msg)
        return True
    else:
        logger.warning(f"Не удалось проанализировать данные о продажах. Ответ API (если был): {sales_data}")
        print("Не удалось проанализировать данные о продажах.")
    return False

def main():
    config = load_config_from_file()
    if not config or not config.get('API_KEY_PROMOTION'):
        logger.error("Отсутствует API_KEY_PROMOTION или конфигурация не загружена. metrics_tracking завершен.")
        print("Критическая ошибка: API_KEY_PROMOTION не найден. metrics_tracking не может быть запущен.")
        return

    api_key_promotion = config.get('API_KEY_PROMOTION')
    api_key_analytics = config.get('API_KEY_ANALYTICS') 

    api_client = WildberriesAPIClient(api_key=api_key_promotion, api_key_analytics=api_key_analytics)

    print("Получение списка активных кампаний для отслеживания метрик...")
    logger.info("Получение списка активных кампаний для отслеживания метрик...")
    
    active_campaigns = []
    try:
        active_campaigns = api_client.get_active_campaign_list()
    except Exception as e:
        logger.error(f"Критическая ошибка при получении списка активных кампаний: {e}", exc_info=True)
        print(f"Не удалось получить список активных кампаний: {e}")

    if not active_campaigns:
        print("Активных кампаний (АРК или Аукцион) для отслеживания не найдено или произошла ошибка при их получении.")
        logging.info("Активных кампаний (АРК или Аукцион) для отслеживания не найдено или произошла ошибка.")
    else:
        print(f"Найдено {len(active_campaigns)} активных кампаний. Отслеживание метрик...")
        all_stats_fetched_successfully = True
        for i, campaign_info in enumerate(active_campaigns):
            try:
                if not track_campaign_metrics(api_client, campaign_info):
                     all_stats_fetched_successfully = False 

                # --- УБРАНА ИЛИ УМЕНЬШЕНА ПАУЗА ---
                # if i < len(active_campaigns) - 1:
                #     pause_duration = 1 # Пример небольшой паузы, если нужна
                #     logger.info(f"Дополнительная пауза на {pause_duration} сек перед следующей кампанией...")
                #     time.sleep(pause_duration)

            except Exception as e:
                all_stats_fetched_successfully = False
                campaign_id_log = campaign_info.get('id', 'N/A')
                logger.error(f"Ошибка при отслеживании метрик кампании {campaign_id_log}: {e}", exc_info=True)
                print(f"Произошла ошибка при отслеживании метрик кампании {campaign_id_log}.")
        
        if not all_stats_fetched_successfully:
             logger.warning("Не для всех кампаний удалось получить статистику в metrics_tracking.")

    if api_key_analytics:
        try:
            # logger.info("Пауза перед запросом общих продаж...") # RateLimiter управляет этим
            # time.sleep(0.5) # Убрана или уменьшена пауза
            track_sales_metrics(api_client)
        except Exception as e:
            logger.error(f"Ошибка при отслеживании метрик продаж: {e}", exc_info=True)
            print(f"Произошла ошибка при отслеживании метрик продаж.")
    else:
        logger.info("API_KEY_ANALYTICS не предоставлен, пропускаем отслеживание общих продаж.")
        print("API_KEY_ANALYTICS не предоставлен, пропускаем отслеживание общих продаж.")

if __name__ == "__main__":
    if not logging.getLogger().hasHandlers():
        logging.basicConfig(
            filename='promotion_logs.txt', 
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
            filemode='a'
        )
    main()