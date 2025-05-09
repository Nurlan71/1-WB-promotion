import logging
import re
from typing import Optional, Any, Tuple
from rate_limiter import RateLimiter

class WildberriesRateLimiter(RateLimiter):
    """
    Rate limiter specifically designed for Wildberries API.
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Define endpoint groups to apply different rate limits to different API endpoints
        self.endpoint_groups = {
            "fullstats": {
                "pattern": r"advert-api\.wildberries\.ru/adv/v2/fullstats",
                "max_requests_per_minute": 20,  # Adjust based on actual API limits
            },
            "promotion": {
                "pattern": r"advert-api\.wildberries\.ru/adv/v1/promotion",
                "max_requests_per_minute": 30,  # Adjust based on actual API limits
            },
            "analytics": {
                "pattern": r"seller-analytics-api\.wildberries\.ru",
                "max_requests_per_minute": 40,  # Adjust based on actual API limits
            },
            # Default group for any other endpoints
            "default": {
                "pattern": r".*",
                "max_requests_per_minute": 15,  # Conservative default
            }
        }
        
        # Initialize counters for each group
        self.request_counters = {group: {"count": 0, "timestamp": 0} for group in self.endpoint_groups}
        
    def _extract_endpoint(self, args: tuple, kwargs: dict) -> Optional[str]:
        """Extract the endpoint URL from the request arguments."""
        # Check if the first argument is the URL (common pattern in your code)
        if args and isinstance(args[0], str) and args[0].startswith('http'):
            return args[0]
            
        # Check if there's a URL in the kwargs
        for key in ['url', 'endpoint', 'api_url']:
            if key in kwargs and isinstance(kwargs[key], str) and kwargs[key].startswith('http'):
                return kwargs[key]
                
        # If we're in a method call, the URL might be in the second argument
        if len(args) > 1 and isinstance(args[1], str) and args[1].startswith('http'):
            return args[1]
            
        # Look for any string that looks like a URL
        for arg in args:
            if isinstance(arg, str) and ('wildberries.ru' in arg):
                return arg
                
        return None
        
    def _get_endpoint_group(self, endpoint: str) -> str:
        """Determine which endpoint group a URL belongs to."""
        for group_name, group_info in self.endpoint_groups.items():
            if re.search(group_info["pattern"], endpoint):
                return group_name
        return "default"
        
    def _is_rate_limit_error(self, exception: Exception) -> bool:
        """Check if an exception is due to rate limiting."""
        error_str = str(exception).lower()
        return (
            '429' in error_str or 
            'too many requests' in error_str or 
            'rate limit' in error_str or
            'limited by global limiter' in error_str
        )
        
    def wait_if_needed(self, endpoint: str) -> None:
        """
        Enhanced version that respects both the backoff delay and 
        the requests-per-minute limit for the endpoint group.
        """
        # First, apply the standard backoff logic
        super().wait_if_needed(endpoint)
        
        # Then, apply the requests-per-minute limit
        group_name = self._get_endpoint_group(endpoint)
        group_info = self.endpoint_groups[group_name]
        counter_info = self.request_counters[group_name]
        
        import time
        current_time = time.time()
        
        # Reset counter if a minute has passed
        if current_time - counter_info["timestamp"] > 60:
            counter_info["count"] = 0
            counter_info["timestamp"] = current_time
            
        # If we've hit the limit for this minute, wait until the next minute
        if counter_info["count"] >= group_info["max_requests_per_minute"]:
            wait_time = 60 - (current_time - counter_info["timestamp"])
            if wait_time > 0:
                self.logger.info(
                    f"Rate limit for group {group_name} reached. "
                    f"Waiting {wait_time:.2f}s until next minute."
                )
                time.sleep(wait_time)
                # Reset counter after waiting
                counter_info["count"] = 0
                counter_info["timestamp"] = time.time()
                
        # Increment the counter
        counter_info["count"] += 1
