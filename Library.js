/**
 * This file contains the re-implementation of the Ecommonkey.Wildberries object.
 * It acts as a replacement for the missing library to make Main.js functional.
 * Version 3.4: Added campaign control functions.
 */

var Ecommonkey = {
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
                return responseText;
            }
        } else {
            throw new Error(`API Error ${responseCode}: ${responseText}`);
        }
    },

    _getSheet: function(name, clear) {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let sheet = ss.getSheetByName(name);
        if (!sheet) {
            sheet = ss.insertSheet(name);
        }
        if (clear) {
            sheet.clear();
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

    // --- Connection/Licensing Stubs ---
    isConnected: function() {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        return [ss.getId()];
    },
    checkConnection: function(isConnected) {
        Logger.log("Connection check bypassed.");
    },

    // --- UI & Sheet Functions ---
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
          .addSubMenu(SpreadsheetApp.getUi().createMenu('Настройки')
              .addItem('Установить API ключи', 'showApiKeyDialog')
              .addItem('Очистить API ключи', 'clearApiProperties'))
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
            advcount: "https://advert-api.wildberries.ru/adv/v1/promotion/count",
            advadverts: "https://advert-api.wildberries.ru/adv/v1/promotion/adverts",
            advpause: "https://advert-api.wildberries.ru/adv/v0/pause?id=",
            advstart: "https://advert-api.wildberries.ru/adv/v0/start?id=",
            advstop: "https://advert-api.wildberries.ru/adv/v0/stop?id=",
        };
    },

    initializeAdvListSheet: function(apiKey, url) {
        const correctUrl = "https://advert-api.wildberries.ru/adv/v1/promotion/count";
        const jsonData = this._request(correctUrl, { method: 'get' }, apiKey);
        const advListSheet = this._getSheet('📝 Список РК', true);
        return { jsonData, advListSheet };
    },

    populateAdvList: function(jsonData, advListSheet) {
        const headers = [['Тип кампании', 'Статус', 'Количество', 'ID кампаний']];
        const typeMap = { 4: "Каталог", 5: "Карточка товара", 6: "Поиск", 7: "Рекомендации", 8: "Автоматическая", 9: "Аукцион" };
        const statusMap = { '-1': "Удаляется", 4: "Готова к запуску", 7: "Завершена", 8: "Отказался", 9: "Активна", 11: "Пауза" };
        let output = headers;

        if (jsonData && jsonData.adverts) {
            for (const [type, statuses] of Object.entries(jsonData.adverts)) {
                for (const [status, campaigns] of Object.entries(statuses)) {
                    const advertListStr = (campaigns.advert_list && Array.isArray(campaigns.advert_list))
                        ? campaigns.advert_list.join(', ')
                        : '';
                    output.push([
                        typeMap[type] || `Тип ${type}`,
                        statusMap[status] || `Статус ${status}`,
                        campaigns.count,
                        advertListStr
                    ]);
                }
            }
        }

        if (output.length > 0) {
            advListSheet.getRange(1, 1, output.length, 4).setValues(output);
        }
    },

    setupAdvertSheet: function() {
        const sheet = this._getSheet('✅ Статистика РК', true);
        const listSheet = this._getSheet('📝 Список РК');
        if (listSheet.getLastRow() < 2) {
            return { advertSheet: sheet, campaignIds: [] };
        }
        const idData = listSheet.getRange(2, 4, listSheet.getLastRow() - 1, 1).getValues();
        const campaignIds = idData.flat().flatMap(ids => ids.split(',').map(id => parseInt(id.trim())).filter(Number.isFinite));
        const uniqueCampaignIds = [...new Set(campaignIds)];
        return { advertSheet: sheet, campaignIds: uniqueCampaignIds };
    },

    fetchCampaignData: function(campaignIds, apiKey, apiUrl) {
        const correctUrl = "https://advert-api.wildberries.ru/adv/v1/promotion/adverts";
        let allCampaignData = [];

        for (let i = 0; i < campaignIds.length; i += 50) {
            const chunk = campaignIds.slice(i, i + 50);
            const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(chunk) };
            try {
                const chunkData = this._request(correctUrl, options, apiKey);
                if (chunkData && Array.isArray(chunkData)) {
                    allCampaignData = allCampaignData.concat(chunkData);
                }
                Utilities.sleep(250);
            } catch (e) {
                Logger.log(`Error fetching chunk for campaign IDs ${chunk.join(',')}: ${e.message}`);
            }
        }

        const statusMap = { '-1':"Удаляется", 4:"Готова к запуску", 7:"Завершена", 8:"Отказался", 9:"Активна", 11:"Пауза" };
        const typeMap = { 4:"Каталог", 5:"Карточка товара", 6:"Поиск", 7:"Рекомендации", 8:"Автоматическая", 9:"Аукцион" };
        const headers = ["ID", "Название", "Тип", "Статус", "Дн. бюджет", "Начало", "Конец", "Создана", "Изменена"];
        let output = [headers];

        if (allCampaignData.length > 0) {
            allCampaignData.forEach(c => {
                output.push([
                    c.advertId, c.name, typeMap[c.type] || c.type, statusMap[c.status] || c.status,
                    c.dailyBudget, c.startTime, c.endTime, c.createTime, c.changeTime
                ]);
            });
        }
        return output;
    },

    sendRequestPause: function(url, options) {
        this._request(url, options, options.headers.Authorization);
        SpreadsheetApp.getUi().alert("Кампания поставлена на паузу.");
    },

    fetchCampaignDataStart: function(url, apiKey) {
        this._request(url, {}, apiKey);
        SpreadsheetApp.getUi().alert("Кампания запущена.");
    },

    sendExcludedPhrases: function(apiUrl, apiKey) {
        const campaignId = apiUrl.split("=").pop();
        const sheet = this._getSheet('⛔ Минус фразы');
        const phrases = sheet.getRange("A2:B" + sheet.getLastRow()).getValues()
            .filter(row => row[0] === true && row[1])
            .map(row => row[1]);

        if (phrases.length === 0) {
            SpreadsheetApp.getUi().alert("Не выбрано ни одной фразы для исключения.");
            return;
        }

        const currentExcluded = this._request(`https://advert-api.wildberries.ru/adv/v1/search?id=${campaignId}`, {}, apiKey).excluded || [];
        const newExcludedSet = new Set([...currentExcluded, ...phrases]);

        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify({ "excluded": Array.from(newExcludedSet) }) };
        this._request(apiUrl, options, apiKey);
        SpreadsheetApp.getUi().alert("Минус-фразы обновлены.");
    },

    sendExcludedRequest: function(apiUrl, apiKey, payload) {
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
        this._request(apiUrl, options, apiKey);
        SpreadsheetApp.getUi().alert("Минус-фразы успешно удалены.");
    },

    sendDepositRequest: function(apiUrl, sum, type, apiKey) {
        const payload = { sum: parseInt(sum, 10), type: parseInt(type, 10) };
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(payload) };
        return this._request(apiUrl, options, apiKey);
    },

    handleBalanceResponse: function(response) {
        const balanceData = JSON.parse(response.getContentText());
        const sheet = this._getSheet('⚙️ Настройки');
        sheet.getRange('Q11').setValue(balanceData.balance); // As per formula inspection
        sheet.getRange('Q12').setValue(balanceData.net);
        sheet.getRange('Q13').setValue(balanceData.bonus);
    },

    updateBudgetSheet: function(budgetData) {
        // This seems to update a general budget cell, not campaign specific one
        const sheet = this._getSheet('📈 Баланс РК');
        if (budgetData && budgetData.total !== undefined) {
            sheet.getRange('D2').setValue(budgetData.total); // As per formula inspection
        }
    },

    // --- Stubs for other functions ---
    checkDeletedWords: function() { SpreadsheetApp.getUi().alert('Функция checkDeletedWords не реализована.'); },
    setFormulaParaDataset: function() { SpreadsheetApp.getUi().alert('Функция setFormulaParaDataset не реализована.'); },
    showDialog: function() { SpreadsheetApp.getUi().alert('Функция showDialog не реализована.'); },
    uncheckCheckboxes: function() { SpreadsheetApp.getUi().alert('Функция uncheckCheckboxes не реализована.'); },

    // Simple wrappers for get_mainX functions
    get_main: function(f1, f2, f3, f4, f5) { try { f1(); f2(); f3(); f4(); if (typeof f5 === 'function') f5(); } catch(e) { Logger.log("Error in get_main: " + e); } },
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
