from typing import Dict, Optional, Union, List, Any
import logging

def calculate_ctr(clicks: Union[int, float], impressions: Union[int, float]) -> float:
    if impressions == 0: return 0.0
    try: return (float(clicks) / float(impressions)) * 100
    except Exception as e:
        logging.error(f"CTR calculation error: clicks={clicks}, impressions={impressions}, error={str(e)}")
        return 0.0

def calculate_roi(revenue: float, cost: float) -> float:
    if cost == 0: return float('inf') if revenue > 0 else 0.0
    try: return ((float(revenue) - float(cost)) / float(cost)) * 100
    except Exception as e:
        logging.error(f"ROI calculation error: revenue={revenue}, cost={cost}, error={str(e)}")
        return 0.0

def calculate_cpc(cost: float, clicks: Union[int, float]) -> float:
    if clicks == 0: return 0.0
    try: return float(cost) / float(clicks)
    except Exception as e:
        logging.error(f"CPC calculation error: cost={cost}, clicks={clicks}, error={str(e)}")
        return 0.0

def analyze_campaign_stats(stats_response: Optional[List[Dict[str, Any]]]) -> Optional[Dict[str, Any]]:
    if not stats_response or not isinstance(stats_response, list) or len(stats_response) == 0:
        logging.warning(f"analyze_campaign_stats: Получен пустой или неверный stats_response: {stats_response}")
        return None
    stats_data = stats_response[0]

    if not isinstance(stats_data, dict):
        logging.warning(f"analyze_campaign_stats: Ожидался словарь в элементе списка stats_response, получено {type(stats_data)}")
        return None

    try:
        views = int(stats_data.get('views', 0))
        clicks = int(stats_data.get('clicks', 0))
        cost_kop = float(stats_data.get('sum', 0.0))
        cost_rub = cost_kop / 100.0
        
        revenue_kop = float(stats_data.get('sum_price', 0.0))
        revenue_rub = revenue_kop / 100.0
        orders = int(stats_data.get('orders', 0))

        ctr_value = calculate_ctr(clicks, views)
        roi_value = calculate_roi(revenue_rub, cost_rub)
        cpc_value = calculate_cpc(cost_rub, clicks)

        return {
            'total_clicks': clicks, 'total_impressions': views, 'total_cost': cost_rub,
            'total_orders': orders, 'total_revenue': revenue_rub,
            'ctr': f"{ctr_value:.2f}%",
            'roi': f"{roi_value:.2f}%" if roi_value != float('inf') else "inf",
            'cpc': f"{cpc_value:.2f}"
        }
    except (ValueError, TypeError, KeyError) as e:
        logging.error(f"Ошибка анализа статистики кампании: {str(e)}. Данные: {stats_data}", exc_info=True)
        return None

def analyze_sales_data(sales_api_response: Optional[Dict]) -> Optional[Dict[str, Any]]:
    if not sales_api_response or not isinstance(sales_api_response, dict) or 'data' not in sales_api_response:
        logging.warning(f"analyze_sales_data: Получен пустой или неверный sales_api_response: {sales_api_response}")
        return None
    data_content = sales_api_response.get('data')
    if not data_content or not isinstance(data_content, dict) or 'cards' not in data_content:
        logging.warning(f"analyze_sales_data: 'cards' отсутствует или неверный в sales_api_response['data']: {data_content}")
        return None
    cards = data_content.get('cards')
    if not isinstance(cards, list):
        logging.warning(f"analyze_sales_data: 'cards' не является списком: {cards}")
        return None

    try:
        total_orders_count = 0
        total_revenue_sum_rub = 0.0
        for card in cards:
            statistics = card.get('statistics', {})
            selected_period = statistics.get('selectedPeriod', {})
            total_orders_count += int(selected_period.get('ordersCount', 0))
            total_revenue_sum_rub += float(selected_period.get('ordersSumRub', 0.0))
        
        avg_order_value = (total_revenue_sum_rub / total_orders_count) if total_orders_count > 0 else 0.0
        return {
            'total_sales': total_orders_count,
            'total_revenue': f"{total_revenue_sum_rub:.2f}",
            'average_order_value': f"{avg_order_value:.2f}"
        }
    except (ValueError, TypeError, KeyError) as e:
        logging.error(f"Ошибка анализа данных о продажах: {str(e)}. Ответ API: {sales_api_response}", exc_info=True)
        return None