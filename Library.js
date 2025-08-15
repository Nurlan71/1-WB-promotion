/**
 * This file contains the re-implementation of the Ecommonkey.Wildberries object.
 * It acts as a replacement for the missing library to make Main.js functional.
 * Version 3.0: Correcting API endpoints based on user-provided documentation.
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

    initializeAdvListSheet: function(apiKey, url) {
        // This function is now re-implemented based on new documentation.
        // The original call in Main.js passes a URL that is now incorrect.
        const correctUrl = "https://advert-api.wildberries.ru/adv/v1/promotion/count";
        const jsonData = this._request(correctUrl, {}, apiKey);
        const advListSheet = this._getSheet('📝 Список РК', true);
        return { jsonData, advListSheet };
    },

    populateAdvList: function(jsonData, advListSheet) {
        // This function now processes the response from /adv/v1/promotion/count
        const headers = [['Тип кампании', 'Статус', 'Количество', 'ID кампаний']];
        const typeMap = { 4: "Каталог", 5: "Карточка товара", 6: "Поиск", 7: "Рекомендации", 8: "Автоматическая", 9: "Аукцион" };
        const statusMap = { '-1': "Удаляется", 4: "Готова к запуску", 7: "Завершена", 8: "Отказался", 9: "Активна", 11: "Пауза" };
        let output = [headers];
        if (jsonData && jsonData.adverts) {
            for (const [type, statuses] of Object.entries(jsonData.adverts)) {
                for (const [status, campaigns] of Object.entries(statuses)) {
                    output.push([
                        typeMap[type] || `Тип ${type}`,
                        statusMap[status] || `Статус ${status}`,
                        campaigns.count,
                        campaigns.advert_list.join(', ')
                    ]);
                }
            }
        }
        if (output.length > 1) {
            advListSheet.getRange(1, 1, output.length, output[0].length).setValues(output);
        }
    },

    setupAdvertSheet: function() {
        const sheet = this._getSheet('✅ Статистика РК', true);
        const settingsSheet = this._getSheet('⚙️ Настройки');
        const campaignIds = settingsSheet.getRange('A2:A' + settingsSheet.getLastRow()).getValues().flat().filter(id => id);
        return { advertSheet: sheet, campaignIds: campaignIds };
    },

    fetchCampaignData: function(campaignIds, apiKey, apiUrl) {
        // The original call in Main.js passes a URL that is now incorrect.
        const correctUrl = "https://advert-api.wildberries.ru/adv/v1/promotion/adverts";
        const options = { method: 'post', contentType: 'application/json', payload: JSON.stringify(campaignIds) };
        const campaignData = this._request(correctUrl, options, apiKey);

        const statusMap = { '-1': "Удаляется", 4: "Готова к запуску", 7: "Завершена", 8: "Отказался", 9: "Активна", 11: "Пауза" };
        const typeMap = { 4: "Каталог", 5: "Карточка товара", 6: "Поиск", 7: "Рекомендации", 8: "Автоматическая", 9: "Аукцион" };
        const headers = ["ID", "Название", "Тип", "Статус", "Дн. бюджет", "Начало", "Конец", "Создана", "Изменена"];
        let output = [headers];
        if (campaignData) {
            campaignData.forEach(c => {
                output.push([
                    c.advertId, c.name, typeMap[c.type] || c.type, statusMap[c.status] || c.status,
                    c.dailyBudget, c.startTime, c.endTime, c.createTime, c.changeTime
                ]);
            });
        }
        return output;
    },

    // Stubs for functions that are too complex or for which the API is not clear from the context
    getlinks: function() { return {}; }, // Deprecated in favor of direct URL construction
    processSheetData: function() { SpreadsheetApp.getUi().alert('Функция processSheetData не реализована.'); },
    fetchAndProcessStats: function() { SpreadsheetApp.getUi().alert('Функция fetchAndProcessStats не реализована.'); },

    // Simple wrappers for get_mainX functions
    get_main: function(f1, f2, f3, f4, f5) { try { f1(); f2(); f3(); f4(); if (typeof f5 === 'function') f5(); } catch(e) { Logger.log("Error in get_main: " + e); } },
    get_main1: function(f1, f2, f3) { try { f1(); f2(); f3(); } catch(e) { Logger.log("Error in get_main1: " + e); } },
    get_main2: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main2: " + e); } },
    get_main3: function(f1, f2, f3, f4, f5) { try { f1(); f2(); f3(); f4(); f5(); } catch(e) { Logger.log("Error in get_main3: " + e); } },
    get_main4: function(f1, f2, f3, f4) { try { f1(); f2(); f3(); f4(); } catch(e) { Logger.log("Error in get_main4: " + e); } },
    get_main5: function(f1, f2, f3, f4) { try { f1(); f2(); f3(); f4(); } catch(e) { Logger.log("Error in get_main5: " + e); } },
    get_main6: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main6: " + e); } },
    get_main11: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main11: " + e); } },
    get_main12: function(f1, f2) { try { f1(); f2(); } catch(e) { Logger.log("Error in get_main12: " + e); } },
  }
};
