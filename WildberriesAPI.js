/**
 * Wildberries API Library
 *
 * A reusable library for interacting with the Wildberries API.
 * This library is designed to be independent of Google Sheets.
 * It encapsulates API endpoints, authentication, and complex logic like pagination.
 *
 * @version 4.0
 */
const WildberriesAPI = {

  config: {
    advert:     { key: null, type: '' },
    statistics: { key: null, type: 'Bearer' },
    analytics:  { key: null, type: 'Bearer' },
    supplies:   { key: null, type: 'Bearer' },
    feedbacks:  { key: null, type: 'Bearer' },
    content:    { key: null, type: 'Bearer' }
  },

  urls: {
    base: {
        advert: "https://advert-api.wb.ru",
        stats: "https://statistics-api.wildberries.ru",
        content: "https://content-api.wb.ru",
        supplies: "https://suppliers-api.wildberries.ru",
        feedbacks: "https://feedbacks-api.wildberries.ru",
        analytics: "https://seller-analytics-api.wildberries.ru",
    }
  },

  initialize: function(apiKeys) {
    if (apiKeys.advert)     this.config.advert.key = apiKeys.advert;
    if (apiKeys.statistics) this.config.statistics.key = apiKeys.statistics;
    if (apiKeys.analytics)  this.config.analytics.key = apiKeys.analytics;
    if (apiKeys.supplies)   this.config.supplies.key = apiKeys.supplies;
    if (apiKeys.feedbacks)  this.config.feedbacks.key = apiKeys.feedbacks;
    if (apiKeys.content)    this.config.content.key = apiKeys.content;
  },

  _request: function(url, options, apiKeyConfig) {
    if (!apiKeyConfig || !apiKeyConfig.key) {
      throw new Error(`API key is not configured for this request to ${url}. Please initialize the corresponding API module.`);
    }
    const token = apiKeyConfig.type ? `${apiKeyConfig.type} ${apiKeyConfig.key}`.trim() : apiKeyConfig.key;
    options.headers = options.headers || {};
    options.headers.Authorization = token;
    options.muteHttpExceptions = true;

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode >= 200 && responseCode < 300) {
      try {
        return responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        Logger.log(`Failed to parse JSON from API response. URL: ${url}, Code: ${responseCode}, Response: ${responseText}`);
        throw new Error(`Failed to parse JSON from API response: ${e.message}`);
      }
    } else {
      throw new Error(`API request to ${url} failed with status ${responseCode}: ${responseText}`);
    }
  },

  advert: {
    getAllCampaigns: function() {
        const url = `${WildberriesAPI.urls.base.advert}/adv/v0/adverts`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.advert);
    },
    getBalance: function() {
      const url = `${WildberriesAPI.urls.base.advert}/adv/v0/balance`;
      return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.advert);
    },
    getBudget: function(campaignId) {
      const url = `${WildberriesAPI.urls.base.advert}/adv/v0/budget?id=${campaignId}`;
      return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.advert);
    },
    depositToCampaign: function(campaignId, sum, type) {
      const url = `${WildberriesAPI.urls.base.advert}/adv/v1/budget/deposit`;
      const payload = { sum: parseInt(sum, 10), type: parseInt(type, 10), id: campaignId };
      const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },
    pauseCampaign: function(campaignId) {
      const url = `${WildberriesAPI.urls.base.advert}/adv/v0/pause?id=${campaignId}`;
      return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.advert);
    },
    startCampaign: function(campaignId) {
      const url = `${WildberriesAPI.urls.base.advert}/adv/v0/start?id=${campaignId}`;
      return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.advert);
    },
    stopCampaign: function(campaignId) {
      const url = `${WildberriesAPI.urls.base.advert}/adv/v0/stop?id=${campaignId}`;
      return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.advert);
    },
    getExcludedPhrases: function(campaignId) {
        const url = `${WildberriesAPI.urls.base.advert}/adv/v1/search?id=${campaignId}`;
        const result = WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.advert);
        return result.excluded || [];
    },
    setExcludedPhrases: function(campaignId, phrases) {
      const url = `${WildberriesAPI.urls.base.advert}/adv/v1/search/set-excluded`;
      const payload = { id: campaignId, excluded: phrases };
      const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
      return WildberriesAPI._request(url, options, WildberriesAPI.config.advert);
    },
  },

  statistics: {
    _fetchPaginatedData: function(endpoint, dateFrom, flag) {
      let allData = [];
      let lastChangeDate = dateFrom;
      while (true) {
        const url = `${WildberriesAPI.urls.base.stats}${endpoint}?dateFrom=${lastChangeDate}&flag=${flag}`;
        const responseData = WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.statistics);
        if (!responseData || responseData.length === 0) break;
        allData = allData.concat(responseData);
        const newLastChangeDate = responseData[responseData.length - 1].lastChangeDate;
        if (newLastChangeDate === lastChangeDate) break;
        lastChangeDate = newLastChangeDate;
        Utilities.sleep(1500); // Rate limiting
      }
      return allData;
    },
    getStocks: function(dateFrom) {
      const url = `${WildberriesAPI.urls.base.stats}/api/v1/supplier/stocks?dateFrom=${dateFrom}`;
      return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.statistics);
    },
    getIncomes: function(dateFrom) {
      return this._fetchPaginatedData("/api/v1/supplier/incomes", dateFrom, 0);
    },
    getSales: function(dateFrom, flag = 0) {
      return this._fetchPaginatedData("/api/v1/supplier/sales", dateFrom, flag);
    },
    getOrders: function(dateFrom, flag = 0) {
        return this._fetchPaginatedData("/api/v1/supplier/orders", dateFrom, flag);
    },
  },

  content: {
     getCardList: function() {
        let allCards = [];
        let cursor = { limit: 100 };
        const url = `${WildberriesAPI.urls.base.content}/content/v2/get/cards/list`;
        while (true) {
            const payload = { settings: { cursor: cursor, filter: { withPhoto: -1 } } };
            const responseData = WildberriesAPI._request(url, { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) }, WildberriesAPI.config.content);
            if (!responseData || !responseData.cards || responseData.cards.length === 0) break;
            allCards = allCards.concat(responseData.cards);
            if (responseData.cursor.total < cursor.limit) break;
            cursor.updatedAt = responseData.cursor.updatedAt;
            cursor.nmID = responseData.cursor.nmID;
            Utilities.sleep(500);
        }
        return allCards;
    },
    getPriceInfo: function() {
        const url = `${WildberriesAPI.urls.base.content}/public/api/v1/info`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.content);
    }
  },

  supplies: {
    getWarehouseCoefficients: function(warehouseIds) {
        const url = `${WildberriesAPI.urls.base.supplies}/api/v1/tariffs/warehouse?warehouseIds=${warehouseIds.join(';')}`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.supplies);
    },
    getWarehouses: function() {
        const url = `${WildberriesAPI.urls.base.supplies}/api/v1/supplier/warehouses`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.statistics); // Uses statistics key
    }
  },

  analytics: {
      getCommissions: function() {
        const url = `${WildberriesAPI.urls.base.analytics}/api/v1/tariffs/commission`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.analytics);
      },
      getBoxTariffs: function(date) {
        const url = `${WildberriesAPI.urls.base.analytics}/api/v1/tariffs/box?date=${date}`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.analytics);
      },
      getPalletTariffs: function(date) {
        const url = `${WildberriesAPI.urls.base.analytics}/api/v1/tariffs/pallet?date=${date}`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.analytics);
      },
      getReturnTariffs: function(date) {
        const url = `${WildberriesAPI.urls.base.analytics}/api/v1/tariffs/return?date=${date}`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.analytics);
      }
  },

  feedbacks: {
    getUnansweredCount: function() {
        const url = `${WildberriesAPI.urls.base.feedbacks}/api/v1/feedbacks/count-unanswered`;
        return WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.feedbacks);
    },
    getFeedbacks: function(isAnswered, dateFrom, dateTo, take, skip, order) {
        const params = { isAnswered, dateFrom, dateTo, take, skip, order };
        const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
        const url = `${WildberriesAPI.urls.base.feedbacks}/api/v1/feedbacks?${queryString}`;
        const result = WildberriesAPI._request(url, { method: 'get' }, WildberriesAPI.config.feedbacks);
        return result.data.feedbacks || [];
    },
    answer: function(id, text) {
        const url = `${WildberriesAPI.urls.base.feedbacks}/api/v1/feedbacks`;
        const payload = { id: id, text: text };
        const options = { method: 'patch', contentType: 'application/json', payload: JSON.stringify(payload) };
        return WildberriesAPI._request(url, options, WildberriesAPI.config.feedbacks);
    }
  }
};
