/**
 * Ecommonkey Wildberries API Library
 *
 * A library for interacting with the Wildberries API.
 * This library is designed to be independent of Google Sheets.
 *
 * @author https://Ecommonkey.ru <adspromolab@gmail.com>
 * @version 1.0
 */
const WildberriesAPI = {

  // =================================================================
  // CONFIGURATION
  // =================================================================

  config: {
    advert:     { key: null, type: '' }, // No Bearer prefix
    statistics: { key: null, type: 'Bearer' },
    analytics:  { key: null, type: 'Bearer' },
    supplies:   { key: null, type: 'Bearer' },
    feedbacks:  { key: null, type: 'Bearer' },
    content:    { key: null, type: 'Bearer' }
  },

  urls: {
    // Advertising API
    adv: {
      upd: "https://advert-api.wb.ru/adv/v1/upd",
      count: "https://advert-api.wb.ru/adv/v1/count",
      adverts: "https://advert-api.wb.ru/adv/v1/adverts",
      fullstats: "https://advert-api.wb.ru/adv/v1/fullstats",
      stat_words: "https://advert-api.wb.ru/adv/v1/stat/words",
      clusters: "https://advert-api.wb.ru/adv/v1/search/clusters",
      setexcluded: "https://advert-api.wb.ru/adv/v1/search/set-excluded",
      pause: "https://advert-api.wb.ru/adv/v0/pause?id=",
      start: "https://advert-api.wb.ru/adv/v0/start?id=",
      budget: "https://advert-api.wb.ru/adv/v1/budget?id=",
      deposit: "https://advert-api.wb.ru/adv/v1/budget/deposit?id=",
      balance: "https://advert-api.wb.ru/adv/v0/balance",
      stop: "https://advert-api.wb.ru/adv/v0/stop?id=",
      cpm: "https://advert-api.wb.ru/adv/v1/cpm",
      booster_stats: "https://advert-api.wb.ru/adv/v1/promotion/stats"
    },
    // Statistics API
    stats: {
      stocks: "https://statistics-api.wildberries.ru/api/v1/supplier/stocks?dateFrom=",
      stocks_report: "https://statistics-api.wildberries.ru/api/v2/stocks",
      sales: "https://statistics-api.wildberries.ru/api/v1/supplier/sales?dateFrom=",
      orders: "https://statistics-api.wildberries.ru/api/v1/supplier/orders?lastChangeDate=",
      incomes: "https://statistics-api.wildberries.ru/api/v1/supplier/incomes?dateFrom=",
      realize_report: "https://statistics-api.wildberries.ru/api/v1/supplier/reportDetailByPeriod"
    },
    // Content API
    content: {
      card_list: "https://content-api.wb.ru/content/v2/get/cards/list",
      goods_list: "https://content-api.wb.ru/content/v2/goods/list", // Corrected endpoint
      search_words: "https://search-products.wildberries.ru/api/v2/search/reports/top-search-words"
    },
    // Supplies API
    supplies: {
      coefficient: "https://suppliers-api.wildberries.ru/api/v3/tariffs/warehouse?warehouseIds=",
      stock_list: "https://suppliers-api.wildberries.ru/api/v3/warehouses"
    },
    // Analytics API
    analytics: {
      nm_report: "https://seller-analytics-api.wildberries.ru/api/v2/nm-report/detail",
      nm_report_days: "https://seller-analytics-api.wildberries.ru/api/v2/nm-report/detail/history",
      commissions: "https://common-api.wildberries.ru/api/v1/tariffs/commission",
      tariffs_box: "https://common-api.wildberries.ru/api/v1/tariffs/box?date=",
      tariffs_pallet: "https://common-api.wildberries.ru/api/v1/tariffs/pallet?date=",
      tariffs_return: "https://common-api.wildberries.ru/api/v1/tariffs/return"
    },
    // Feedbacks API
    feedbacks: {
      count: "https://feedbacks-api.wildberries.ru/api/v1/feedbacks/count-unanswered",
      all: "https://feedbacks-api.wildberries.ru/api/v1/feedbacks/archive",
      patch: "https://feedbacks-api.wildberries.ru/api/v1/feedbacks"
    },
    // Promo API
    promo: {
      calendar: "https://seller-promo-api.wildberries.ru/api/v1/promocalendar/list",
      promo_art: "https://seller-promo-api.wildberries.ru/api/v1/promo/goods",
      promo_info: "https://seller-promo-api.wildberries.ru/api/v1/promocalendar/info"
    },
    // Search Report API
    search_report: {
      report: "https://seller-analytics-api.wildberries.ru/api/v1/search/report"
    }
  },

  /**
   * Initializes the library with the necessary API keys.
   * @param {object} apiKeys - An object containing the API keys, e.g., { advert: 'key1', statistics: 'key2' }
   */
  initialize: function(apiKeys) {
    if (apiKeys.advert)     this.config.advert.key = apiKeys.advert;
    if (apiKeys.statistics) this.config.statistics.key = apiKeys.statistics;
    if (apiKeys.analytics)  this.config.analytics.key = apiKeys.analytics;
    if (apiKeys.supplies)   this.config.supplies.key = apiKeys.supplies;
    if (apiKeys.feedbacks)  this.config.feedbacks.key = apiKeys.feedbacks;
    if (apiKeys.content)    this.config.content.key = apiKeys.content;
    Logger.log("WildberriesAPI library initialized with provided keys.");
  },

  // =================================================================
  // PRIVATE HELPER
  // =================================================================

  /**
   * Private method for making API requests.
   * @param {string} url The URL to fetch.
   * @param {object} options The options for UrlFetchApp.fetch().
   * @param {object} apiKeyConfig The API key configuration object to use for this request.
   * @returns {object} The JSON response from the API.
   * @private
   */
  _request: function(url, options, apiKeyConfig) {
    if (!apiKeyConfig || !apiKeyConfig.key) {
      throw new Error("API key is not configured for this request. Please call initialize() first.");
    }

    const token = apiKeyConfig.type ? `${apiKeyConfig.type} ${apiKeyConfig.key}`.trim() : apiKeyConfig.key;

    options.headers = options.headers || {};
    options.headers.Authorization = token;
    options.muteHttpExceptions = true;

    try {
      const response = UrlFetchApp.fetch(url, options);
      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();

      if (responseCode >= 200 && responseCode < 300) {
        if (responseText) {
          try {
            return JSON.parse(responseText);
          } catch(e) {
            Logger.log(`JSON parsing error for response: ${responseText}`);
            throw new Error("Failed to parse JSON response from API.");
          }
        }
        return {}; // Return empty object for 204 No Content
      } else {
        const errorMsg = `API request to ${url} failed with status ${responseCode}: ${responseText}`;
        Logger.log(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (e) {
      Logger.log(`Failed to fetch from API: ${e.message}`);
      throw e;
    }
  },

  // =================================================================
  // API METHOD NAMESPACES
  // =================================================================

  advert: {
    /**
     * Fetches the seller's account balance.
     * @returns {object} The balance information.
     */
    getBalance: function() {
      const url = WildberriesAPI.urls.adv.balance;
      const options = {
        method: 'get',
        headers: { accept: "application/json; charset=utf-8" }
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Fetches the budget of a specific advertising campaign.
     * @param {number} campaignId The ID of the campaign.
     * @returns {object} The budget information.
     */
    getBudget: function(campaignId) {
      if (!campaignId) {
        throw new Error("Campaign ID is required to get the budget.");
      }
      const url = WildberriesAPI.urls.adv.budget + campaignId;
      const options = {
        method: 'get',
        headers: { accept: "application/json; charset=utf-8" }
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Fetches the count of campaigns grouped by status.
     * @returns {Array} An array with campaign counts.
     */
    getCampaignCount: function() {
      const url = WildberriesAPI.urls.adv.count;
      const options = {
        method: 'get',
        headers: { accept: "application/json; charset=utf-8" }
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Fetches detailed information for a list of advertising campaigns.
     * @param {Array<number>} campaignIds An array of campaign IDs.
     * @returns {Array} The list of campaign details.
     */
    getCampaignList: function(campaignIds) {
      const url = WildberriesAPI.urls.adv.adverts;
      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(campaignIds)
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Fetches full statistics for a list of advertising campaigns.
     * @param {Array<number>} campaignIds An array of campaign IDs.
     * @returns {Array} The list of campaign statistics.
     */
    getFullStats: function(requestBody) {
      // requestBody can be an array of IDs like [1, 2, 3]
      // or an array of objects like [{id: 1, dates: ["2023-01-01"]}]
      const url = WildberriesAPI.urls.adv.fullstats;
      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(requestBody)
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Fetches keyword clusters for a campaign.
     * @param {number} campaignId The ID of the campaign.
     * @returns {object} The keyword clusters.
     */
    getClusters: function(campaignId) {
      const url = `${WildberriesAPI.urls.adv.clusters}?id=${campaignId}`;
      const options = {
        method: 'get'
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Pauses an advertising campaign.
     * @param {number} campaignId The ID of the campaign to pause.
     */
    pauseCampaign: function(campaignId) {
      const url = WildberriesAPI.urls.adv.pause + campaignId;
      const options = { method: 'get' };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Starts an advertising campaign.
     * @param {number} campaignId The ID of the campaign to start.
     */
    startCampaign: function(campaignId) {
      const url = WildberriesAPI.urls.adv.start + campaignId;
      const options = { method: 'get' };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Stops (completes) an advertising campaign.
     * @param {number} campaignId The ID of the campaign to stop.
     */
    stopCampaign: function(campaignId) {
      const url = WildberriesAPI.urls.adv.stop + campaignId;
      const options = { method: 'get' };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Sets the excluded keywords for a campaign.
     * @param {number} campaignId The ID of the campaign.
     * @param {Array<string>} keywords An array of keywords to exclude. To delete all, pass an empty array.
     */
    setExcludedKeywords: function(campaignId, keywords) {
      const url = WildberriesAPI.urls.adv.setexcluded;
      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          "id": campaignId,
          "excluded": keywords
        })
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Sets the CPM for specific nomenclatures in a campaign.
     * @param {number} campaignId The ID of the campaign.
     * @param {number} cpm The CPM value.
     * @param {Array<number>} nmIds An array of nomenclature IDs.
     */
    setCampaignCpm: function(campaignId, cpm, nmIds) {
      const url = WildberriesAPI.urls.adv.cpm;
      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          "advertId": campaignId,
          "type": 6, // Per documentation, this is required, although not in user's original code
          "cpm": cpm,
          "param": nmIds // Per documentation, the key is "param", not "nmIds"
        })
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },

    /**
     * Gets promotion statistics (booster stats).
     * @param {Array<number>} nmIds An array of nomenclature IDs.
     * @returns {object} The promotion statistics.
     */
    getBoosterStats: function(nmIds) {
      const url = WildberriesAPI.urls.adv.booster_stats;
      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ "nm": nmIds })
      };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    }
  },

  statistics: {
    /**
     * Fetches stock information.
     * @param {string} dateFrom The start date in YYYY-MM-DD format.
     * @param {string} dateTo The end date in YYYY-MM-DD format.
     * @returns {Array} The stock data.
     */
    getStocks: function(dateFrom, dateTo) {
        const url = `${WildberriesAPI.urls.stats.stocks}${dateFrom}&dateTo=${dateTo}&flag=1`;
        const options = { method: 'get' };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.statistics);
    },

    /**
     * Fetches income data for a given date range.
     * @param {string} dateFrom The start date in YYYY-MM-DD format.
     * @param {string} dateTo The end date in YYYY-MM-DD format.
     * @returns {Array} The income data.
     */
    getIncomes: function(dateFrom, dateTo) {
        const url = `${WildberriesAPI.urls.stats.incomes}${dateFrom}&dateTo=${dateTo}&flag=0`;
        const options = { method: 'get' };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.statistics);
    },

    /**
     * Fetches sales data for a given date range.
     * @param {string} dateFrom The start date in YYYY-MM-DD format.
     * @param {string} dateTo The end date in YYYY-MM-DD format.
     * @returns {Array} The sales data.
     */
    getSales: function(dateFrom, dateTo) {
        const url = `${WildberriesAPI.urls.stats.sales}${dateFrom}&dateTo=${dateTo}&flag=0`;
        const options = { method: 'get' };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.statistics);
    },

    /**
     * Fetches all orders for a given date range, handling pagination internally.
     * @param {string} dateFrom The start date in YYYY-MM-DD format.
     * @param {string} dateTo The end date in YYYY-MM-DD format.
     * @returns {Array} A complete list of all orders for the period.
     */
    getAllOrders: function(dateFrom, dateTo) {
        let allOrders = [];
        let lastChangeDate = dateFrom;

        while (true) {
            try {
                const url = `${WildberriesAPI.urls.stats.orders}${lastChangeDate}&dateTo=${dateTo}&flag=0`;
                const options = { method: 'get' };
                const responseData = WildberriesAPI._request(url, options, WildberriesAPI.config.statistics);

                if (!responseData || responseData.length === 0) {
                    break; // No more data, exit loop
                }

                allOrders = allOrders.concat(responseData);

                const newLastChangeDate = responseData[responseData.length - 1].lastChangeDate;

                // WB API can sometimes return the same last record. Check to prevent infinite loop.
                if (newLastChangeDate === lastChangeDate) {
                  Logger.log("lastChangeDate did not change, exiting loop to prevent infinite requests.");
                  break;
                }
                lastChangeDate = newLastChangeDate;

                Logger.log(`Fetched ${responseData.length} orders. Next lastChangeDate: ${lastChangeDate}`);
                Utilities.sleep(1200); // Be nice to the API
            } catch (e) {
                Logger.log(`Error during pagination loop for orders: ${e.message}. Returning partial data.`);
                break;
            }
        }

        return allOrders;
    },

    /**
     * Fetches the complete sales report for a period, handling pagination internally.
     * @param {string} dateFrom The start date in YYYY-MM-DD format.
     * @param {string} dateTo The end date in YYYY-MM-DD format.
     * @param {number} [limit=100000] The number of records per request.
     * @returns {Array} A complete list of all report records.
     */
    getDetailByPeriod: function(dateFrom, dateTo, limit = 100000) {
        let allRecords = [];
        let rrdid = 0;

        while (true) {
            try {
                const url = `${WildberriesAPI.urls.stats.realize_report}?dateFrom=${dateFrom}&dateTo=${dateTo}&limit=${limit}&rrdid=${rrdid}`;
                const options = { method: 'get' };
                const responseData = WildberriesAPI._request(url, options, WildberriesAPI.config.statistics);

                if (!responseData || responseData.length === 0) {
                    break; // No more data
                }

                allRecords = allRecords.concat(responseData);

                if (responseData.length < limit) {
                    break; // Last page
                }

                // rrd_id is a 64-bit integer, which can cause precision issues in JS if it's too large.
                // It's safer to get it as a string if possible, but here we assume it's a number.
                rrdid = responseData[responseData.length - 1].rrd_id;
                Logger.log(`Fetched ${responseData.length} report records. Next rrdid: ${rrdid}`);
                Utilities.sleep(1200); // Be nice to the API

            } catch (e) {
                Logger.log(`Error during pagination loop for sales report: ${e.message}. Returning partial data.`);
                break;
            }
        }

        return allRecords;
    },

    /**
     * Creates and downloads a stock report, handling the asynchronous process internally.
     * @param {object} payload - The payload for creating the report task, e.g., { "groupBy": ["warehouseId", "subjectId"], "filter": { "stocks": [">", 0] } }
     * @returns {object} The downloaded report data.
     */
    getWarehouseStockReport: function(payload) {
        const createTaskUrl = WildberriesAPI.urls.stats.stocks_report;
        const createTaskOptions = {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(payload)
        };

        // 1. Create the task
        const taskResponse = WildberriesAPI._request(createTaskUrl, createTaskOptions, WildberriesAPI.config.statistics);
        const taskId = taskResponse.data.taskId;
        Logger.log(`Created stock report task with ID: ${taskId}`);

        if (!taskId) {
            throw new Error("Failed to create stock report task.");
        }

        const checkStatusUrl = `${createTaskUrl}/${taskId}`;
        const downloadUrl = `${checkStatusUrl}/download`;
        const checkOptions = { method: 'get' };

        // 2. Poll for completion
        for (let i = 0; i < 10; i++) { // Poll up to 10 times (e.g., 2 minutes)
            Utilities.sleep(12000); // Wait 12 seconds
            const statusResponse = WildberriesAPI._request(checkStatusUrl, checkOptions, WildberriesAPI.config.statistics);
            if (statusResponse.data.status === 'DONE') {
                Logger.log("Stock report is ready for download.");
                // 3. Download the report
                return WildberriesAPI._request(downloadUrl, checkOptions, WildberriesAPI.config.statistics);
            }
            Logger.log(`Stock report status: ${statusResponse.data.status}. Retrying...`);
        }

        throw new Error(`Stock report task ${taskId} did not complete in time.`);
    }
  },
  feedbacks: {
    /**
     * Gets the count of unanswered feedbacks.
     * @returns {object} The count data.
     */
    getUnansweredCount: function() {
        const url = WildberriesAPI.urls.feedbacks.count;
        const options = { method: 'get' };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.feedbacks);
    },

    /**
     * Gets a list of feedbacks from the archive.
     * @param {object} params - Parameters for the request, e.g., { isAnswered, take, skip, dateFrom, dateTo }.
     * @returns {object} The response object containing feedbacks.
     */
    getArchivedFeedbacks: function(params) {
        const queryString = Object.keys(params)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');
        const url = `${WildberriesAPI.urls.feedbacks.all}?${queryString}`;
        const options = { method: 'get' };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.feedbacks);
    },

    /**
     * Updates a feedback (e.g., sends a reply).
     * @param {string} id - The ID of the feedback to update.
     * @param {string} text - The text of the reply.
     * @returns {object} The API response.
     */
    patchFeedback: function(id, text) {
        const url = WildberriesAPI.urls.feedbacks.patch;
        const options = {
            method: 'patch',
            contentType: 'application/json',
            payload: JSON.stringify({
                id: id,
                text: text
            })
        };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.feedbacks);
    }
  },
  content: {
    /**
     * Fetches all product cards, handling pagination via cursor internally.
     * @param {object} settings - The settings object for the request body.
     * @returns {Array} A complete list of all product cards.
     */
    getAllCards: function(settings) {
        let allCards = [];
        let requestCount = 0;
        let cursor = {
            updatedAt: settings.updatedAt,
            nmID: settings.nmID,
            limit: 100
        };

        while (true) {
            requestCount++;
            const payload = {
                settings: settings,
                cursor: cursor
            };

            const url = WildberriesAPI.urls.content.card_list;
            const options = {
                method: 'post',
                contentType: 'application/json',
                payload: JSON.stringify(payload)
            };
            const responseData = WildberriesAPI._request(url, options, WildberriesAPI.config.content);

            if (!responseData || !responseData.cards || responseData.cards.length === 0) {
                break;
            }

            allCards = allCards.concat(responseData.cards);

            if (responseData.cursor.total < 100) {
                break; // Last page
            }

            cursor.updatedAt = responseData.cursor.updatedAt;
            cursor.nmID = responseData.cursor.nmID;

            Logger.log(`Fetched page ${requestCount}, total cards: ${allCards.length}`);
            Utilities.sleep(500); // Be nice to the API
        }
        return allCards;
    },

    /**
     * Fetches a list of goods with their sizes and prices.
     * @param {object} filter - The filter object for the request body.
     * @returns {Array} The list of goods.
     */
    getGoodsList: function(filter) {
        const url = WildberriesAPI.urls.content.goods_list;
        const options = {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify({
                "filter": filter,
                "limit": 1000
            })
        };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.content);
    }
  },
  feedbacks: {},
  supplies: {
    /**
     * Fetches warehouse tariffs/coefficients.
     * @param {Array<number>} warehouseIds An array of warehouse IDs.
     * @returns {object} The tariff data.
     */
    getCoefficient: function(warehouseIds) {
        const url = `${WildberriesAPI.urls.supplies.coefficient}${warehouseIds.join(';')}`;
        const options = { method: 'get' };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.supplies);
    },

    /**
     * Fetches the list of all Wildberries warehouses.
     * @returns {Array} The list of warehouses.
     */
    getWarehouseList: function() {
        const url = WildberriesAPI.urls.supplies.stock_list;
        const options = { method: 'get' };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.supplies);
    }
  },
  analytics: {}
};
