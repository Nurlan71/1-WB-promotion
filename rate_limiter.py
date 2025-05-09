import time
import random
import logging
from functools import wraps
from typing import Callable, Any, Dict, Optional, Union

class RateLimiter:
    """
    Implements rate limiting with exponential backoff for API requests.
    """
    def __init__(self, 
                 initial_delay: float = 1.0,
                 max_delay: float = 60.0, 
                 backoff_factor: float = 2.0,
                 jitter: bool = True,
                 max_retries: int = 5):
        self.initial_delay = initial_delay
        self.max_delay = max_delay
        self.backoff_factor = backoff_factor
        self.jitter = jitter
        self.max_retries = max_retries
        self.endpoints: Dict[str, Dict[str, Union[float, int]]] = {}
        self.logger = logging.getLogger(__name__)

    def _get_delay(self, endpoint: str) -> float:
        """Calculate the appropriate delay for an endpoint based on its history."""
        if endpoint not in self.endpoints:
            self.endpoints[endpoint] = {
                "last_request": 0,
                "current_delay": self.initial_delay,
                "consecutive_failures": 0
            }
        
        endpoint_data = self.endpoints[endpoint]
        delay = endpoint_data["current_delay"]
        
        # Add jitter to prevent synchronized retries
        if self.jitter:
            delay = delay * (0.5 + random.random())
            
        return min(delay, self.max_delay)

    def _update_endpoint_status(self, endpoint: str, success: bool) -> None:
        """Update the status of an endpoint after a request."""
        if endpoint not in self.endpoints:
            self.endpoints[endpoint] = {
                "last_request": time.time(),
                "current_delay": self.initial_delay,
                "consecutive_failures": 0
            }
            return
            
        endpoint_data = self.endpoints[endpoint]
        endpoint_data["last_request"] = time.time()
        
        if success:
            # Reset backoff on success, but gradually to avoid rapid oscillation
            endpoint_data["current_delay"] = max(
                self.initial_delay,
                endpoint_data["current_delay"] / 1.5
            )
            endpoint_data["consecutive_failures"] = 0
        else:
            # Increase backoff on failure
            endpoint_data["current_delay"] = min(
                self.max_delay,
                endpoint_data["current_delay"] * self.backoff_factor
            )
            endpoint_data["consecutive_failures"] += 1

    def wait_if_needed(self, endpoint: str) -> None:
        """Wait if necessary before making a request to the endpoint."""
        if endpoint not in self.endpoints:
            return
            
        endpoint_data = self.endpoints[endpoint]
        last_request = endpoint_data["last_request"]
        current_time = time.time()
        
        # Calculate time since last request
        elapsed = current_time - last_request
        
        # Get the appropriate delay for this endpoint
        delay = self._get_delay(endpoint)
        
        # Wait if we haven't waited long enough
        if elapsed < delay:
            wait_time = delay - elapsed
            self.logger.info(f"Rate limiting: waiting {wait_time:.2f}s before request to {endpoint}")
            time.sleep(wait_time)

    def apply(self, func: Callable) -> Callable:
        """Decorator to apply rate limiting to a function."""
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            # Extract endpoint from args or kwargs
            endpoint = self._extract_endpoint(args, kwargs)
            if not endpoint:
                return func(*args, **kwargs)
                
            retries = 0
            while retries <= self.max_retries:
                # Wait if needed before making the request
                self.wait_if_needed(endpoint)
                
                try:
                    result = func(*args, **kwargs)
                    # Update status on success
                    self._update_endpoint_status(endpoint, True)
                    return result
                except Exception as e:
                    retries += 1
                    # Check if it's a rate limit error
                    is_rate_limit = self._is_rate_limit_error(e)
                    
                    # Update status on failure
                    self._update_endpoint_status(endpoint, False)
                    
                    if is_rate_limit and retries <= self.max_retries:
                        delay = self._get_delay(endpoint)
                        self.logger.warning(
                            f"Rate limit exceeded for {endpoint}. "
                            f"Retrying in {delay:.2f}s (attempt {retries}/{self.max_retries})"
                        )
                        time.sleep(delay)
                    else:
                        # If it's not a rate limit error or we've exceeded retries, re-raise
                        if retries > self.max_retries:
                            self.logger.error(f"Max retries ({self.max_retries}) exceeded for {endpoint}")
                        raise
            
            # This should never be reached due to the raise in the loop
            return None
            
        return wrapper
        
    def _extract_endpoint(self, args: tuple, kwargs: dict) -> Optional[str]:
        """
        Extract the endpoint from function arguments.
        Override this method for specific API clients.
        """
        # Default implementation tries to find a URL in args or kwargs
        for arg in args:
            if isinstance(arg, str) and (arg.startswith('http://') or arg.startswith('https://')):
                return arg
                
        for _, value in kwargs.items():
            if isinstance(value, str) and (value.startswith('http://') or value.startswith('https://')):
                return value
                
        return None
        
    def _is_rate_limit_error(self, exception: Exception) -> bool:
        """
        Determine if an exception is due to rate limiting.
        Override this method for specific API clients.
        """
        # Default implementation checks for common rate limit status codes in exception message
        error_str = str(exception).lower()
        return '429' in error_str or 'too many requests' in error_str or 'rate limit' in error_str
