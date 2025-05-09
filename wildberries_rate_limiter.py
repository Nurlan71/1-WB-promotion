import logging
import re
import time # Убедитесь, что time импортирован здесь
from typing import Optional, Any, Tuple, Dict, Union # Добавлены Dict, Union
from rate_limiter import RateLimiter

class WildberriesRateLimiter(RateLimiter):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.endpoint_groups = {
            "fullstats": {
                "pattern": r"advert-api\.wildberries\.ru/adv/v2/fullstats",
                "max_requests_per_minute": 4,  # Значительно уменьшено
            },
            "promotion_adverts_post": { 
                "pattern": r"advert-api\.wildberries\.ru/adv/v1/promotion/adverts", 
                "max_requests_per_minute": 25, # 5 в секунду = 300, но это POST и батчевый, не должен вызываться непрерывно. Ставим 25 (примерно 1 запрос каждые 2.4 сек, если идут подряд)
            },
            "promotion_count_get": { 
                "pattern": r"advert-api\.wildberries\.ru/adv/v1/promotion/count",
                "max_requests_per_minute": 50, # Этот вызывается редко, можно более свободный лимит
            },
            "analytics": {
                "pattern": r"seller-analytics-api\.wildberries\.ru",
                "max_requests_per_minute": 20, 
            },
            "default": {
                "pattern": r".*", # Для всех остальных непредусмотренных эндпоинтов
                "max_requests_per_minute": 10,
            }
        }
        self.request_counters: Dict[str, Dict[str, Union[int, float]]] = { # Явная типизация для request_counters
            group: {"count": 0, "timestamp": time.time()} for group in self.endpoint_groups
        }
        
    def _extract_endpoint(self, args: tuple, kwargs: dict) -> Optional[str]:
        # Эта реализация ищет URL во втором аргументе позиционном (args[1]), 
        # так как в вашем _make_request_impl первый аргумент это method, а второй url
        if len(args) > 1 and isinstance(args[1], str) and ('wildberries.ru' in args[1]):
            return args[1]
        
        # Также проверяем kwargs на случай, если URL передается по имени
        for key in ['url', 'endpoint_url']: # Добавьте другие возможные имена ключей
            if key in kwargs and isinstance(kwargs[key], str) and ('wildberries.ru' in kwargs[key]):
                return kwargs[key]

        # Если URL передается как первый аргумент (менее вероятно для _make_request_impl, но на всякий случай)
        if args and isinstance(args[0], str) and ('wildberries.ru' in args[0]):
            return args[0]

        self.logger.warning(f"Не удалось извлечь URL эндпоинта из аргументов: args={args}, kwargs={kwargs}")
        return "unknown_endpoint" # Возвращаем маркер, чтобы RateLimiter мог использовать default группу

    def _get_endpoint_group(self, endpoint: str) -> str:
        if endpoint == "unknown_endpoint": # Если URL не извлечен, используем default
            return "default"
        for group_name, group_info in self.endpoint_groups.items():
            if re.search(group_info["pattern"], endpoint): # type: ignore
                return group_name
        return "default"
        
    def _is_rate_limit_error(self, exception: Exception) -> bool:
        error_str = str(exception).lower()
        return (
            '429' in error_str or 
            'too many requests' in error_str or 
            'rate limit' in error_str or
            'limited by global limiter' in error_str
        )
        
    def wait_if_needed(self, endpoint: str) -> None:
        super().wait_if_needed(endpoint) # Применяем стандартный backoff от родительского класса
        
        group_name = self._get_endpoint_group(endpoint)
        # Убедимся, что для "unknown_endpoint" используется группа "default", если она есть
        if group_name not in self.endpoint_groups and "default" in self.endpoint_groups:
            group_name = "default"
        elif group_name not in self.endpoint_groups:
            self.logger.warning(f"Не найдена группа для эндпоинта {endpoint} и нет группы 'default'. RPM лимиты не будут применены.")
            return


        group_info = self.endpoint_groups[group_name]
        
        # Инициализируем счетчик для группы, если его еще нет (на всякий случай)
        if group_name not in self.request_counters:
            self.request_counters[group_name] = {"count": 0, "timestamp": time.time()}
        counter_info = self.request_counters[group_name]
        
        current_time = time.time()
        
        if current_time - counter_info["timestamp"] >= 60: # Проверяем >= 60 секунд
            counter_info["count"] = 0
            counter_info["timestamp"] = current_time
            
        if counter_info["count"] >= group_info["max_requests_per_minute"]: # type: ignore
            wait_time = 60.0 - (current_time - counter_info["timestamp"])
            if wait_time > 0:
                self.logger.info(
                    f"RPM лимит для группы '{group_name}' ({group_info['max_requests_per_minute']} req/min) достигнут. " # type: ignore
                    f"Ожидание {wait_time:.2f}s."
                )
                time.sleep(wait_time)
                counter_info["count"] = 0 # Сбрасываем счетчик после ожидания нового минутного окна
                counter_info["timestamp"] = time.time()
                
        counter_info["count"] += 1