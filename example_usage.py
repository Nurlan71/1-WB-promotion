import logging
import time
from promotion_api_client_improved import WildberriesAPIClient

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

def main():
    # Initialize the API client with your API key
    api_key = "YOUR_API_KEY"  # Replace with your actual API key
    client = WildberriesAPIClient(api_key)
    
    # Example campaign IDs from your logs
    campaign_ids = [24921656, 24921655, 24845705, 24845702, 24833861]
    
    logger.info("Starting campaign statistics retrieval with improved rate limiting...")
    
    # Process each campaign individually to demonstrate rate limiting
    for campaign_id in campaign_ids:
        logger.info(f"Retrieving statistics for campaign ID: {campaign_id}")
        
        # Get statistics for the campaign
        stats = client.get_campaign_stats([campaign_id])
        
        if stats:
            logger.info(f"Successfully retrieved statistics for campaign {campaign_id}")
            # Process the statistics here
        else:
            logger.warning(f"Failed to retrieve statistics for campaign {campaign_id}")
            
        # No need for manual sleep - the rate limiter handles it automatically
    
    logger.info("Campaign statistics retrieval completed")

if __name__ == "__main__":
    main()
