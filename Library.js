/**
 * This file contains the re-implementation of the Ecommonkey.Wildberries object.
 * It acts as a replacement for the missing library to make Main.js functional.
 */

const Ecommonkey = {
  Wildberries: {

    // --- Internal Helper Methods ---

    _request: function(url, options, apiKey) {
        options = options || {};
        options.headers = options.headers || {};
        if (apiKey) {
            options.headers.Authorization = apiKey;
        }
        options.muteHttpExceptions = true;

        const response = UrlFetchApp.fetch(url, options);
        const responseCode = response.getResponseCode();
        const responseText = response.getContentText();

        if (responseCode >= 200 && responseCode < 300) {
            try {
                return responseText ? JSON.parse(responseText) : {};
            } catch (e) {
                Logger.log(`Failed to parse JSON. Code: ${responseCode}, Response: ${responseText.substring(0, 500)}`);
                return responseText; // Return raw text if not JSON
            }
        } else {
            throw new Error(`API Error ${responseCode}: ${responseText}`);
        }
    },

    _getSheet: function(name) {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName(name);
        if (!sheet) {
            sheet = ss.insertSheet(name);
        }
        return sheet;
    },

    _getCampaignId: function() {
        const sheet = this._getSheet('⚙️ Настройки');
        const checkboxRange = sheet.getRange('K9:K97');
        const checkboxes = checkboxRange.getValues();
        const idRange = sheet.getRange('C9:C97');
        const ids = idRange.getValues();

        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i][0] === true) {
                const campaignId = ids[i][0];
                if (campaignId) return { campaignId: campaignId };
            }
        }
        const campaignIdFromCell = sheet.getRange('O30').getValue();
        if(campaignIdFromCell) return { campaignId: campaignIdFromCell };

        SpreadsheetApp.getUi().alert('Не выбрана ни одна рекламная кампания.');
        return null;
    },

    // --- UI & Sheet Functions (Re-implemented) ---

    onOpen: function() {
      SpreadsheetApp.getUi()
          .createMenu('Wildberries Menu')
          .addItem('Обновить все данные', 'get_main')
          .addSeparator()
          .addSubMenu(SpreadsheetApp.getUi().createMenu('Реклама')
              .addItem('Обновить список РК', 'get_advList')
              .addItem('Обновить статистику РК', 'get_adverts')
              .addItem('Приостановить РК', 'advPause')
              .addItem('Запустить РК', 'advStart'))
          .addSubMenu(SpreadsheetApp.getUi().createMenu('Статистика')
              .addItem('Остатки на складах', 'get_stocks')
              .addItem('Продажи', 'get_sales')
              .addItem('Заказы', 'get_orders'))
          .addSeparator()
          .addItem('Копировать активный лист', 'copyActiveSheet')
          .addToUi();
    },

    copyActiveSheet: function() {
      SpreadsheetApp.getActiveSpreadsheet().duplicateActiveSheet();
      SpreadsheetApp.getUi().alert('Лист успешно скопирован.');
    },

    onEdit: function(e) {
      const range = e.range;
      Logger.log(`Cell edited: Sheet='${range.getSheet().getName()}', Cell='${range.getA1Notation()}', NewValue='${e.value}'`);
    },

    getCampaignId: function() {
        return this._getCampaignId();
    },

    // --- API Function Implementations ---

    getlinks: function() {
        return {
            advcount: "https://advert-api.wb.ru/adv/v1/count",
            advadverts: "https://advert-api.wb.ru/adv/v1/adverts",
            advfullstats: "https://advert-api.wb.ru/adv/v1/fullstats",
            advsetexcluded: "https://advert-api.wb.ru/adv/v1/search/set-excluded",
            advpause: "https://advert-api.wb.ru/adv/v0/pause?id=",
            advstart: "https://advert-api.wb.ru/adv/v0/start?id=",
            advbudget: "https://advert-api.wb.ru/adv/v0/budget?id=",
            advdeposit: "https://advert-api.wb.ru/adv/v1/budget/deposit",
            advbalance: "https://advert-api.wb.ru/adv/v0/balance",
            advstop: "https://advert-api.wb.ru/adv/v0/stop?id=",
            advcpm: "https://advert-api.wb.ru/adv/v1/cpm",
        };
    },

    initializeAdvListSheet: function(apiKey, url) {
        const jsonData = this._request(url, {}, apiKey);
        const advListSheet = this._getSheet('📝 Список РК');
        advListSheet.clear();
        return { jsonData, advListSheet };
    },

    populateAdvList: function(jsonData, advListSheet) {
        const headers = [['ID Кампании', 'Тип кампании', 'Количество', 'Статус']];
        const typeMap = { 4: "Каталог", 5: "Карточка товара", 6: "Поиск", 7: "Рекомендации", 8: "Автоматическая", 9: "Поиск + каталог" };
        let output = [headers];
        if (jsonData && jsonData.length > 0) {
            jsonData.forEach(item => {
                output.push(['', typeMap[item.type] || `Тип ${item.type}`, item.count, '']);
            });
        }
        advListSheet.getRange(1, 1, output.length, output[0].length).setValues(output);
    },

    setupAdvertSheet: function() {
        const sheet = this._getSheet('✅ Статистика РК');
        const settingsSheet = this._getSheet('⚙️ Настройки');
        const campaignIds = settingsSheet.getRange('A2:A' + settingsSheet.getLastRow()).getValues().flat().filter(id => id);
        return { advertSheet: sheet, campaignIds: campaignIds };
    },

    fetchCampaignData: function(campaignIds, apiKey, apiUrl) {
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(campaignIds) };
        const campaignData = this._request(apiUrl, options, apiKey);
        const statusMap = { 4: "Готова к запуску", 7: "Отказался", 8: "Запланирована", 9: "Идут показы", 11: "Пауза" };
        const typeMap = { 4: "Каталог", 5: "Карточка товара", 6: "Поиск", 7: "Рекомендации", 8: "Автоматическая", 9: "Поиск + каталог" };
        const headers = ["ID", "Название", "Тип", "Статус", "Дн. бюджет", "Начало", "Конец"];
        let output = [headers];
        if (campaignData) {
            campaignData.forEach(c => {
                output.push([c.advertId, c.name, typeMap[c.type] || c.type, statusMap[c.status] || c.status, c.dailyBudget, c.startTime, c.endTime]);
            });
        }
        return output;
    },

    sendExcludedPhrases: function(apiUrl, apiKey) {
        const sheet = this._getSheet('⛔ Минус фразы');
        const data = sheet.getRange("A2:B" + sheet.getLastRow()).getValues();
        const phrases = [];
        for (const row of data) {
            if (row[0] === true && row[1]) {
                phrases.push(row[1]);
            }
        }
        if(phrases.length === 0) {
            SpreadsheetApp.getUi().alert("Нет фраз для исключения.");
            return;
        }
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify({ "excluded": phrases }) };
        this._request(apiUrl, options, apiKey);
        SpreadsheetApp.getUi().alert("Минус-фразы обновлены.");
    },

    sendExcludedRequest: function(apiUrl, apiKey, payload) {
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
        this._request(apiUrl, options, apiKey);
        SpreadsheetApp.getUi().alert("Минус-фразы успешно удалены.");
    },

    sendRequestPause: function(url, options) {
        this._request(url, options);
        SpreadsheetApp.getUi().alert("Кампания поставлена на паузу.");
    },

    fetchCampaignDataStart: function(url, apiKey) {
        this._request(url, { headers: { 'Authorization': apiKey } });
        SpreadsheetApp.getUi().alert("Кампания запущена.");
    },

    sendDepositRequest: function(apiUrl, sum, type, apiKey) {
        const payload = { sum: parseInt(sum, 10), type: parseInt(type, 10) };
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
        return this._request(apiUrl, options, apiKey);
    },

    handleBalanceResponse: function(response) {
        const balanceData = JSON.parse(response.getContentText());
        const sheet = this._getSheet('⚙️ Настройки');
        sheet.getRange('C3').setValue(balanceData.balance);
        sheet.getRange('C4').setValue(balanceData.net);
        sheet.getRange('C5').setValue(balanceData.bonus);
    },

    updateBudgetSheet: function(budgetData) {
        const sheet = this._getSheet('⚙️ Настройки');
        if (budgetData && budgetData.total !== undefined) {
            sheet.getRange('D3').setValue(budgetData.total);
        }
    },

    // --- Stubs for complex or unknown functions ---
    // These functions from Main.js are too complex to replicate without more info.
    // They will show an alert to the user.
    checkDeletedWords: function() { SpreadsheetApp.getUi().alert('Функция checkDeletedWords не реализована.'); },
    setFormulaParaDataset: function() { SpreadsheetApp.getUi().alert('Функция setFormulaParaDataset не реализована.'); },
    showDialog: function() { SpreadsheetApp.getUi().alert('Функция showDialog не реализована.'); },
    uncheckCheckboxes: function() { SpreadsheetApp.getUi().alert('Функция uncheckCheckboxes не реализована.'); },
    highlightCheckboxes: function() { SpreadsheetApp.getUi().alert('Функция highlightCheckboxes не реализована.'); },
    updateSettingsFromStatistics: function() { SpreadsheetApp.getUi().alert('Функция updateSettingsFromStatistics не реализована.'); },
    checkAndUpdateCheckboxes: function() { SpreadsheetApp.getUi().alert('Функция checkAndUpdateCheckboxes не реализована.'); },
    updateCheckboxes_CpcCtr: function() { SpreadsheetApp.getUi().alert('Функция updateCheckboxes_CpcCtr не реализована.'); },
    customVLOOKUP: function() { SpreadsheetApp.getUi().alert('Функция customVLOOKUP не реализована.'); },
    setFormulasParaSettings: function() { SpreadsheetApp.getUi().alert('Функция setFormulasParaSettings не реализована.'); },
    advanalytics: function() { SpreadsheetApp.getUi().alert('Функция advanalytics не реализована.'); },
    processSheetData: function() { SpreadsheetApp.getUi().alert('Функция processSheetData не реализована.'); },
    fetchAndProcessStats: function() { SpreadsheetApp.getUi().alert('Функция fetchAndProcessStats не реализована.'); },
    setupStocksSheet: function() { return this._getSheet('📦 Склад'); },
    getDateRangestock: function() { return { formattedFromDate: '2023-01-01', formattedToDate: '2023-01-31' }; },
    fetchStockData: function() { SpreadsheetApp.getUi().alert('Функция fetchStockData не реализована.'); },

    // Simple wrappers for get_mainX functions
    get_main: function(f1, f2, f3, f4, f5) { try { f1(); f2(); f3(); f4(); f5(); } catch(e) { Logger.log("Error in get_main: " + e); } },
    get_main1: function(f1, f2, f3) { try { f1(); f2(); f3(); } catch(e) { Logger.log("Error in get_main1: " + e); } },
    get_main2: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main2: " + e); } },
    get_main3: function(f1, f2, f3, f4, f5) { try { f1(); f2(); f3(); f4(); f5(); } catch(e) { Logger.log("Error in get_main3: " + e); } },
    get_main4: function(f1, f2, f3, f4) { try { f1(); f2(); f3(); f4(); } catch(e) { Logger.log("Error in get_main4: " + e); } },
    get_main5: function(f1, f2, f3, f4) { try { f1(); f2(); f3(); f4(); } catch(e) { Logger.log("Error in get_main5: " + e); } },
    get_main6: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main6: " + e); } },
    get_main11: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main11: " + e); } },
    get_main12: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main12: " + e); } }
  }
};
