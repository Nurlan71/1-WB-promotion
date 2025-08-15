/** Perferita **
 * @author https://Ecommonkey.ru <adspromolab@gmail.com>
 * @see {@link https://t.me/deepont Telegram} разработка Google таблиц и GAS скриптов,  AI внедрение
 * @see {@link https://openapi.wb.ru Wildberries API}
 * Актуально для версии 281
 */

// ####################################################################################################################################
// SCRIPTS
// ####################################################################################################################################

function copyActiveSheet() { try { // Копируем активный лист
    Ecommonkey.Wildberries.copyActiveSheet(); } catch (error) {  Logger.log("Ошибка при вызове copyActiveSheet: " + error.message); }}

function checkDeletedWords() { try { // Выделяем чекбоксы из раздела Исключенные запросы
    Ecommonkey.Wildberries.checkDeletedWords(); } catch (error) {  Logger.log("Ошибка при вызове checkDeletedWords: " + error.message); }}

function onOpen() {
try {Ecommonkey.Wildberries.onOpen(); } catch (error) { Logger.log("Ошибка при вызове onOpen: " + error.message); }}

function onEdit(e) {
try {Ecommonkey.Wildberries.onEdit(e); } catch (error) { Logger.log("Ошибка при вызове onEdit: " + error.message); }}

function setFormulaParaDataset() { try { // 🟨 Отчет
    Ecommonkey.Wildberries.setFormulaParaDataset(); } catch (error) { Logger.log("Ошибка при вызове setFormulaParaDataset: " + error.message); }}

function setFormulaParaDataUnit() { try { // 🟫 Отчет
    Ecommonkey.Wildberries.setFormulaParaDataUnit(); } catch (error) { Logger.log("Ошибка при вызове setFormulaParaDataUnit: " + error.message); }}

function getCampaignId() { try { // Получаем ID РК по выбранным чекбоксам на Листе "⚙️ Настройки
    Ecommonkey.Wildberries.getCampaignId(); } catch (error) { Logger.log("Ошибка при вызове getCampaignId: " + error.message); }}

function showDialog() { try { // Выводим диалоговое окно
    Ecommonkey.Wildberries.showDialog(); } catch (error) { Logger.log("Ошибка при вызове showDialog: " + error.message); }}

function uncheckCheckboxes() { try { // Отключить чекбоксы
    Ecommonkey.Wildberries.uncheckCheckboxes(); } catch (error) { Logger.log("Ошибка при вызове uncheckCheckboxes: " + error.message); }}

function highlightCheckboxes() { try { // Выбрать все чекбоксы кроме последнего
    Ecommonkey.Wildberries.highlightCheckboxes(); } catch (error) { Logger.log("Ошибка при вызове highlightCheckboxes: " + error.message); }}

function updateSettingsFromStatistics() { try { // Устанавливаем артикулы в диапазоне P37:P50
    Ecommonkey.Wildberries.updateSettingsFromStatistics(); }
    catch (error) { Logger.log("Ошибка при вызове updateSettingsFromStatistics: " + error.message); }}

function checkAndUpdateCheckboxes() { try { // Находим соответствия в '⚙️ Настройки' и '🚧 Поисковые запросы'
    Ecommonkey.Wildberries.checkAndUpdateCheckboxes(); }
    catch (error) { Logger.log("Ошибка при вызове checkAndUpdateCheckboxes: " + error.message); }}

function updateCheckboxes_CpcCtr() { try { // Находим соответствия CTR / CPC '⚙️ Настройки'
    Ecommonkey.Wildberries.updateCheckboxes_CpcCtr(); }
    catch (error) { Logger.log("Ошибка при вызове updateCheckboxes_CpcCtr: " + error.message); }}

function customVLOOKUP() { try { // Добавляем на листе '⚙️ Настройки' символ ☑ если найдено совпадение
    Ecommonkey.Wildberries.customVLOOKUP(); } catch (error) { Logger.log("Ошибка при вызове customVLOOKUP: " + error.message); }}

function setFormulasParaSettings() { try { // Устанавливаем формулы на листе '⚙️ Настройки'
    Ecommonkey.Wildberries.setFormulasParaSettings(); }
    catch (error) { Logger.log("Ошибка при вызове setFormulasParaSettings: " + error.message); }}

function advanalytics() { try { // Аналитика РК 🚀 Реклама
    Ecommonkey.Wildberries.advanalytics(); } catch (error) { Logger.log("Ошибка при вызове advanalytics: " + error.message); }}

function transferDataUnits() { try { // Аналитика 📅 UNIT
    Ecommonkey.Wildberries.transferDataUnits(); } catch (error) {
      Logger.log("Ошибка при вызове transferDataUnits: " + error.message); }}

function transferDataUnitsV2() { try { // Аналитика 📅 UNIT ABC
    Ecommonkey.Wildberries.transferDataUnitsV2(); } catch (error) {
      Logger.log("Ошибка при вызове transferDataUnitsV2: " + error.message); }}

// ####################################################################################################################################
// MAIN
// ####################################################################################################################################

// Получаем  📝 Список РК + ✅ Статистика РК + 🚧 Статистика РК + записываем артикулы из РК в N46:50 и обновляем формулы
function get_main() { Ecommonkey.Wildberries.get_main(get_advList, get_adverts, get_advStats_weeks, setFormulasParaSettings, Ecommonkey.Wildberries.updateCheckParaRecPolSettings);}

// Обновляем 🚧 Запросы РК и после обновляем Артикулы в P37:N50 а также обновляем 🛄 Товары WB
function get_main1() { Ecommonkey.Wildberries.get_main1(get_stats_keywords_weeks, updateSettingsFromStatistics, sppProductDetails);}

// Запрашиваем список 🚧 Кластеров и выделяем совпадения
function get_main2() { Ecommonkey.Wildberries.get_main2(get_words_clust, customVLOOKUP);} // ☑ customVLOOKUP

// Запрашиваем по очереди 🚧 Запросы РК + 🚧 Кластеры + 📈 Баланс РК и Бюджет РК + P37:P50 + минус фразы
function get_main3() { Ecommonkey.Wildberries.get_main3(get_stats_keywords_weeks, get_words_clust, get_advBalance, customVLOOKUP, updateSettingsFromStatistics );} // P37:P50

// Удаляем фразы, снимаем чекбоксы, обновляем кластеры, выделяем минус фразы
function get_main4() { Ecommonkey.Wildberries.get_main4(set_excluded, uncheckCheckboxes, get_words_clust, customVLOOKUP);}

// Возвращаем все исключенные запросы в плюс фразы и обновляем список фраз и кластеров
function get_main5() { Ecommonkey.Wildberries.get_main5(delete_excluded, get_stats_keywords_weeks, get_words_clust, customVLOOKUP);}

// Обновляем фото через обновление статистики РК и списка номенклатур
function get_main6() { Ecommonkey.Wildberries.get_main6(get_card_list, get_advStats_weeks);}

// Запрашиваем по очереди Баланс, Бюджет РК и CPM
function get_main11() { Ecommonkey.Wildberries.get_main11(get_advBalance, get_adverts);}

// Запрашиваем по очереди 🚧 Поисковые запросы и 🅰️ Позиции по запросам
function get_main12() { Ecommonkey.Wildberries.get_main12(search_words, search_words_per);}

// ####################################################################################################################################
// API FUNCTIONS
// ####################################################################################################################################


// 💳 Истории затрат РК - Метод позволяет получать историю затрат рекламной кампании.
// Допускается 1 запрос в секунду.

function get_advupd() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) { const statusKvo = 'emonkey_advert';
    const apiKey = getAPIStatus(statusKvo); Logger.log('Используемый API Key: ' + apiKey);
    const Urls = Ecommonkey.Wildberries.getlinks();
    try {Ecommonkey.Wildberries.processSheetData(Urls, apiKey);}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 📝 Список РК - Допускается 5 запросов в секунду.

function get_advList() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) { var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const Urls = Ecommonkey.Wildberries.getlinks(); const url = `${Urls.advcount}`;
  var { jsonData, advListSheet } = Ecommonkey.Wildberries.initializeAdvListSheet(apiKey, url);
  try {Ecommonkey.Wildberries.populateAdvList(jsonData, advListSheet);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error);
  SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// ✅ Статистика РК
// Метод позволяет получать информацию о кампаниях по query параметрам, либо по списку ID кампаний.
// Допускается 5 запросов в секунду.

function get_adverts() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
    var status_kvo = 'emonkey_advert';
    var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
    var { advertSheet, campaignIds } = Ecommonkey.Wildberries.setupAdvertSheet();
    const Urls = Ecommonkey.Wildberries.getlinks();
    const apiUrl = `${Urls.advadverts}`;
    try {
      var output = Ecommonkey.Wildberries.fetchCampaignData(campaignIds, apiKey, apiUrl);
      if (output.length > 1) {
      advertSheet.getRange(1, 1, output.length, output[0].length).setValues(output);
      advertSheet.getRange(2, 1, output.length - 1, output[0].length).setHorizontalAlignment('left'); }
      else { Logger.log("Нет данных для записи в таблицу."); }}
      catch (error) { Logger.log('Ошибка при выполнении: ' + error);
      SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 🚧 Статистика РК - Возвращает статистику кампаний.
// Максимум 1 запрос в минуту.
// Данные вернутся для кампаний в статусе 7, 9 и 11.
// Важно. В запросе можно передавать либо параметр dates либо параметр interval, но не оба.
// Можно отправить запрос только с ID кампании. При этом вернутся данные за последние сутки, но не за весь период существования кампании.

function get_advStats() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
    var status_kvo = 'emonkey_advert';
    var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
    const Urls = Ecommonkey.Wildberries.getlinks();
    const apiUrl = `${Urls.advfullstats}`;
    try {const responsefullstat = Ecommonkey.Wildberries.fetchAndProcessStats(apiUrl, apiKey);
      if (responsefullstat) {
        const records = Ecommonkey.Wildberries.aggregateData(responsefullstat);
        if (records.length > 0) {
          const { advStatSheet, headers } = Ecommonkey.Wildberries.setupFullstatsSheet();
          advStatSheet.getRange(advStatSheet.getLastRow() + 1, 1, records.length, headers.length).setValues(records);
          Ecommonkey.Wildberries.updateSettingsFromStatistics(); // Запускаем следующую функцию
        } else {Logger.log("Нет данных для записи в таблицу.");}}
    } catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 🚧 Статистика РК 🧸 - Возвращает статистику кампаний.
// Максимум 1 запрос в минуту.
// Данные вернутся для кампаний в статусе 7, 9 и 11.
// Важно. В запросе можно передавать либо параметр dates либо параметр interval, но не оба.
// Можно отправить запрос только с ID кампании. При этом вернутся данные за последние сутки, но не за весь период существования кампании.

function get_advStats_weeks() { try {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
    const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids); // Проверяем подключение к Wildberries
    Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
    if (isConnected) {
      var status_kvo = 'emonkey_advert';
      var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
      const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.advfullstats}`;
      var {datePeriods, campaignIds} = Ecommonkey.Wildberries.setupFullstatsWeekSheet(); // Настраиваем таблицу для статистики
      Ecommonkey.Wildberries.avdFullWeekProcessData(datePeriods, campaignIds, apiKey, apiUrl);} // Обрабатываем данные по полной статистике за каждую неделю
      else {Logger.log("Нет данных для записи в таблицу."); }}
      catch (error) {Logger.log('Ошибка при выполнении: ' + error); // Логируем ошибки
      SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message); // Показываем сообщение об ошибке пользователю
  }
}

// 🚧 Запросы - Статистика по ключевым фразам для Автоматических кампаний и Аукциона
// Возвращает статистику по ключевым фразам за каждый день, когда кампания была активна.
// За один запрос можно получить данные максимум за 7 дней.
// Информация обновляется раз в час.
// Максимум 4 запроса секунду

function get_stats_keywords() { try {
        const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
        const seePro = Ecommonkey.Wildberries.isConnected();
        const isConnected = seePro.includes(ids); // Проверяем подключение к Wildberries
        Ecommonkey.Wildberries.checkConnection(isConnected); if (isConnected) { // Проверяем соединение
        var status_kvo = 'emonkey_statistics';
        var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
        if (apiKey) { Ecommonkey.Wildberries.fetchAndUpdateStatsADVS(apiKey); }
        else { Logger.log("Нет данных для записи в таблицу."); }}
        else { Logger.log("Не удалось установить соединение с Wildberries."); }}
        catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message); }
}

// 🚧 Запросы 🧸 - Статистика по ключевым фразам для Автоматических кампаний и Аукциона
// Возвращает статистику по ключевым фразам за каждый день, когда кампания была активна.
// За один запрос можно получить данные максимум за 7 дней.
// Информация обновляется раз в час.
// Максимум 4 запроса секунду

function get_stats_keywords_weeks() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected(); const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
    var credentials = Ecommonkey.Wildberries.getCampaignId();
    if (!credentials) { Logger.log('Ошибка: Учетные данные отсутствуют');return;}
    var campaignId = credentials.campaignId;  Logger.log('Получен campaignId: ' + campaignId);
    try {
      var status_kvo = 'emonkey_advert';
      var apiKey = getAPIStatus(status_kvo);
      Logger.log('Используемый API Key: ' + apiKey);
      var { advStatKeySheet, datePeriods } = Ecommonkey.Wildberries.initializeDataSheetAdvWord();
      Ecommonkey.Wildberries.getKeywordStats(datePeriods, campaignId, apiKey, advStatKeySheet);}
    catch (error) { Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message); }
  }
}

// 🚧 Кластер - Статистика автоматической кампании по кластерам фраз
// Возвращает кластеры ключевых фраз (наборы похожих), по которым показывались товары в кампании, и количество показов по ним.
// В ответ метода попадают только те фразы, по которым товары показывались хотя бы один раз.
// Информация обновляется раз в 15 минут.
// Максимум — 4 запроса секунду.

function get_words_clust() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected(); const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
  try {var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId();
  if (!credentials) return; var campaignId = credentials.campaignId;
  var advClustSheet = Ecommonkey.Wildberries.setupAdvClustSheet();
  Ecommonkey.Wildberries.fetchAndPopulateClusterData(campaignId, apiKey, advClustSheet);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// ⛔ Минус фразы - Установка/удаление минус-фраз для автоматической кампании
// Метод позволяет устанавливать или удалять минус фразы.
// Допускается 1 запрос в 6 секунд.
// Отправка пустого массива удаляет все минус-фразы из кампании.
// Эта функция удаляет из РК выбраннные ключевые запросы из диапазона чек-боксов

// Формулы для '⛔ Минус фразы'
function setexcludedFormulas() { try {
    Ecommonkey.Wildberries.setexcludedFormulas(); }
    catch (error) { Logger.log("Ошибка при вызове setexcludedFormulas: " + error.message); }}

function set_excluded() {
  setexcludedFormulas();
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected(); const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
  try { var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId(); if (!credentials) return;
  var campaignId = credentials.campaignId;
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.advsetexcluded}${campaignId}`;
  Ecommonkey.Wildberries.sendExcludedPhrases(apiUrl, apiKey); }
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// ⛔ Удалить минус фразы - Метод позволяет устанавливать или удалять минус фразы.
// Допускается 1 запрос в 6 секунд.
// Отправка пустого массива удаляет все минус-фразы из кампании.
// Эта функция удалит ⛔ все исключенные запросы и вернет их в плюс фразы

function delete_excluded() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected(); const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
  try {var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId(); if (!credentials) return;
  var campaignId = credentials.campaignId;
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.advsetexcluded}${campaignId}`;

  // Запрашиваем подтверждение у пользователя
  var ui = SpreadsheetApp.getUi();
  var response = ui.alert('Подтверждение удаления', 'Вы точно хотите удалить все минус слова и добавить их в плюс фразы?',ui.ButtonSet.YES_NO );
  if (response != ui.Button.YES) { return; }
  var payload = { "excluded": [] };
  Ecommonkey.Wildberries.sendExcludedRequest(apiUrl, apiKey, payload, ui);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error);  SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// ⏸️ Пауза РК
// Кампании в статусе "9 - идут показы" - можно поставить на паузу, сделав GET на /adv/v0/pause?id=***.
// Допускается 5 запросов в секунду.

function advPause() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
  try { var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId(); if (!credentials) return; var campaignId = credentials.campaignId;

  // Запрашиваем подтверждение у пользователя
  var response = Browser.msgBox("Вы точно хотите поставить кампанию на паузу?", Browser.Buttons.YES_NO); if (response === 'no') return;
  const Urls = Ecommonkey.Wildberries.getlinks();  const url = `${Urls.advpause}${campaignId}`;
  var options = {method: "get", headers: {"Authorization": apiKey}, muteHttpExceptions: true};
  Ecommonkey.Wildberries.sendRequestPause(url, options); }
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message); }
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ▶️ Старт РК
// Метод позволяет запускать кампании находящиеся в статусах 4 - готова к запуску или 11 - кампания на паузе.
// Допускается 5 запросов в секунду.
// Для запуска кампании со статусом 11 необходимо наличие у неё пополненного бюджета.
// Чтобы запустить кампанию со статусом 4 необходимо выполнить два условия (поочередность действий значения не имеет):
// 1. После создания кампании в кабинете ВБ. Продвижение необходимо нажать кнопку "Применить изменения".
// 2. Установить бюджет.

function advStart() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
  try { var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId();
  if (!credentials) return; var campaignId = credentials.campaignId;
  var response = Browser.msgBox("Вы точно хотите запустить кампанию?", Browser.Buttons.YES_NO);
  if (response === 'no') { return; }
  const Urls = Ecommonkey.Wildberries.getlinks(); const url = `${Urls.advstart}${campaignId}`;
  Ecommonkey.Wildberries.fetchCampaignDataStart(url, apiKey);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// Массовая проверка бюджета РК для пополнения
function get_advBudgetMass() {
  const status_kvo = 'emonkey_advert';
  const apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const Urls = Ecommonkey.Wildberries.getlinks(); const baseUrl = Urls.advbudget;
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('📆 Пополнение РК');
  const idRange = sheet.getRange('A2:A' + sheet.getLastRow()).getValues();
  const campaignIds = idRange.flat().filter(id => id); // убираем пустые строки
  sheet.getRange('E2:E' + sheet.getLastRow()).clearContent(); Logger.log('Очищен диапазон E2:E');
  if (campaignIds.length === 0) { Logger.log('Нет доступных campaignId для обработки.'); return;}
  const options = { muteHttpExceptions: true, headers: { Authorization: apiKey, accept: "application/json; charset=utf-8" } };
  campaignIds.forEach((campaignId, index) => {
    const url = `${baseUrl}${campaignId}`; Logger.log(`Отправляем запрос для Campaign ID: ${campaignId} (URL: ${url})`);
    let attempts = 0;
    let success = false;
    while (attempts < 3 && !success) {
      try {
        const response = UrlFetchApp.fetch(url, options);
        const responseCode = response.getResponseCode();
        const responseBody = JSON.parse(response.getContentText());

        if (responseCode === 200) { const total = responseBody.total || 0; sheet.getRange(index + 2, 5).setValue(total); // Колонка E
          Logger.log(`ID ${campaignId}: успешно получен бюджет: ${total}₽`); success = true; // Успешно завершили
        } else if (responseCode === 400) { Logger.log(`ID ${campaignId}: Ошибка 400 (Неверный запрос): ${JSON.stringify(responseBody)}`); success = true; // Ошибка клиента
        } else if (responseCode === 401) { Logger.log(`ID ${campaignId}: Ошибка 401 (Не авторизован): ${JSON.stringify(responseBody)}`); success = true; // Ошибка авторизации
        } else { Logger.log(`ID ${campaignId}: Ошибка ${responseCode}: ${JSON.stringify(responseBody)}`); success = true;} // Другие ошибки - логируем и идем дальше

      } catch (error) {
        attempts++; Logger.log(`ID ${campaignId}: Попытка ${attempts} - Произошла ошибка: ${error.message}`);
        if (attempts >= 3) { Logger.log(`ID ${campaignId}: Ошибка повторяется. Пропускаем после 3 попыток.`);
        } else { Utilities.sleep(300);} // Пауза перед новой попыткой
      }
    }
    Utilities.sleep(300); // Пауза между ID
  }); Logger.log('Обработка всех Campaign ID завершена.');
}

// Автопополнение и запуск Рекламных кампаний по времени
function depositAndStartCampaigns() {
  Logger.log('📝 Список РК...'); get_advList(); Utilities.sleep(2000); Logger.log('✅ Статистика РК...'); get_adverts(); Utilities.sleep(2000);
  Logger.log('⚙️ Настройки установка формул...'); setFormulasParaSettings(); Utilities.sleep(5000);
  Logger.log('📝 Проверяем бюджет РК...'); get_advBudgetMass(); Utilities.sleep(2000);
  Logger.log('🔄 Запуск массового пополнения...'); massDepositAdv();
  Logger.log('⏳ Ожидание перед запуском кампаний...'); Utilities.sleep(5000);
  Logger.log('🚀 Запуск кампаний...'); startCampaignsMassiv(); Utilities.sleep(5000);
  Logger.log('✅ Статистика РК...'); get_adverts();
}

function createDailyTriggerAdv() {
  const userEmail = Session.getActiveUser().getEmail();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

  deleteDailyTriggerAdv(); // Удалим, если уже есть
  ScriptApp.newTrigger('depositAndStartCampaigns')
    .timeBased().atHour(8).everyDays(1)
    .create(); Logger.log('⏰ Триггер установлен на 5:00 для depositAndStartCampaigns.');
    sheet.appendRow([new Date(), 'Создан триггер stat_get_stocks', userEmail]);
}

function deleteDailyTriggerAdv() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'depositAndStartCampaigns') {
      ScriptApp.deleteTrigger(trigger);  Logger.log('❌ Удалён триггер: depositAndStartCampaigns');}
  });
}

// Массовый запуск рекламных кампаний с повторными попытками при ошибке "Address unavailable"
function startCampaignsMassiv() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected); if (!isConnected) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📆 Пополнение РК');
  const data = sheet.getRange('A2:A' + sheet.getLastRow()).getValues();
  const status_kvo = 'emonkey_advert';
  const apiKey = getAPIStatus(status_kvo);
  const Urls = Ecommonkey.Wildberries.getlinks();

  const requestsPerSecond = 3; // Ограничение запросов
  const delay = 1000 / requestsPerSecond; // Задержка в миллисекундах между запросами
  let lastRequestTime = Date.now();

  data.forEach((row, index) => {
    const campaignId = row[0];
    if (!campaignId) {    Logger.log(`[${index + 2}] ⚠️ Пропущена пустая строка`); return; }
    const url = `${Urls.advstart}${campaignId}`;
    const options = {  method: 'get', headers: { 'Authorization': apiKey }, muteHttpExceptions: true };

    let attempt = 0;
    let success = false;

    while (attempt < 3 && !success) {
      attempt++; // Контроль частоты запросов
      const timeSinceLast = Date.now() - lastRequestTime;
      if (timeSinceLast < delay) { Utilities.sleep(delay - timeSinceLast);}
      lastRequestTime = Date.now();

      try {
        const response = UrlFetchApp.fetch(url, options);
        const code = response.getResponseCode();
        const text = response.getContentText();

        if (code === 200) { Logger.log(`[${index + 2}] ✅ [Запуск] Успешно ID: ${campaignId}`); success = true;}
        else if (code === 422) { Logger.log(`[${index + 2}] ⚠️ [422] Статус не изменён для ID: ${campaignId}`);  success = true;} // 422 — это не ошибка подключения
        else if (code === 429) { Logger.log(`[${index + 2}] ⚠️ [429] Слишком много запросов. Пропуск ID: ${campaignId}`);  success = true;} // 429 — пропускаем
        else { Logger.log(`[${index + 2}] ❌ [${code}] Ошибка запуска ID: ${campaignId}, Ответ: ${text}`); success = true;} // Ошибки сервера не повторяем
      } catch (e) { Logger.log(`[${index + 2}] ❌ [Попытка ${attempt}] Ошибка ID ${campaignId}: ${e.message}`);
        if (e.message.includes('Address unavailable')) {
        if (attempt < 3) { Logger.log(`[${index + 2}] 🔄 Повторная попытка запуска ID: ${campaignId} (попытка ${attempt + 1})`); Utilities.sleep(1500);} // доп. задержка перед новой попыткой
        else { Logger.log(`[${index + 2}] 🚫 Максимальное число попыток для ID ${campaignId}. Переход к следующему.`);}}
        else { Logger.log(`[${index + 2}] 🚫 Ошибка не связана с сетью. Пропуск ID: ${campaignId}`); break;}}
      }
  });
}

// 💵 Пополнение РК
// Метод позволяет пополнять бюджет кампании.

function showDepositDialog() {
  var html = HtmlService.createHtmlOutputFromFile('deposit_form')
      .setWidth(400)
      .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Ввод данных');
}

function post_advDeposit(sum, type) {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
    if (isConnected) {
    try {var status_kvo = 'emonkey_advert';
    var apiKey = getAPIStatus(status_kvo);Logger.log('Используемый API Key: ' + apiKey);
    var credentials = Ecommonkey.Wildberries.getCampaignId();
    if (!credentials) { Logger.log('Не удалось получить идентификатор кампании.');return;}
    const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.advdeposit}${credentials.campaignId}`;
    var response = Ecommonkey.Wildberries.sendDepositRequest(apiUrl, sum, type, apiKey);
    if (response) {if (response.getResponseCode() === 200) {Browser.msgBox('Бюджет успешно пополнен');}
    else {Browser.msgBox('Ошибка: ' + response.getResponseCode() + ' - ' + response.getContentText());}}}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// Массовое пополнение бюджета РК с повторными попытками при ошибке "Address unavailable"
function massDepositAdv() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📆 Пополнение РК');
  const lastRow = sheet.getLastRow();

  const data = sheet.getRange('A2:C' + lastRow).getValues(); // A - ID, C - сумма пополнения
  const budgetValues = sheet.getRange('E2:E' + lastRow).getValues(); // E - текущие бюджеты
  const threshold = sheet.getRange('E1').getValue(); // Порог

  if (isNaN(threshold)) {  Logger.log('❌ Ошибка: Значение в E1 не является числом. Ожидается порог пополнения бюджета.'); return;}
  const typeCell = sheet.getRange('L1').getValue();
  const type = parseInt(typeCell, 10);
  if (isNaN(type)) { Logger.log('❌ Ошибка: Значение в L1 не является числом. Ожидается тип пополнения (например, 0, 1, 3).'); return;}

  const status_kvo = 'emonkey_advert';
  const apiKey = getAPIStatus(status_kvo);
  const Urls = Ecommonkey.Wildberries.getlinks();

  data.forEach((row, index) => {
    const campaignId = row[0];
    const sum = row[2];
    const currentBudget = parseFloat(budgetValues[index][0]);

    if (!campaignId || !sum || isNaN(currentBudget)) {
    Logger.log(`[${index + 2}] ⚠️ Пропущена строка с неполными или некорректными данными: ID=${campaignId}, сумма=${sum}, бюджет=${currentBudget}`); return;}

    if (currentBudget >= threshold) { Logger.log(`[${index + 2}] ⏩ Пропущено: бюджет (${currentBudget}₽) >= порога (${threshold}₽)`); return; }

    const apiUrl = `${Urls.advdeposit}${campaignId}`;
    const payload = { sum: parseInt(sum, 10), type: type, return: true };
    const options = { method: 'post', contentType: 'application/json', headers: { 'Authorization': apiKey }, payload: JSON.stringify(payload), muteHttpExceptions: true };

    let attempt = 0;
    let success = false;

    while (attempt < 3 && !success) { // 1 основная + 2 повторные попытки
      attempt++;
      try {
        Logger.log(`[${index + 2}] 🔄 Попытка ${attempt} для ID: ${campaignId}`);
        const response = UrlFetchApp.fetch(apiUrl, options);
        const code = response.getResponseCode();
        const text = response.getContentText();

        if (code >= 200 && code < 300) {
          Logger.log(`[${index + 2}] ✅ [Пополнение] Попытка ${attempt}: ID: ${campaignId}, Код: ${code}, Ответ: ${text}`); success = true;}
          else {Logger.log(`[${index + 2}] ⚠️ [Пополнение] Попытка ${attempt}: Ошибка кода ${code}, Ответ: ${text}`);}
      } catch (e) { Logger.log(`[${index + 2}] ❌ [Пополнение] Попытка ${attempt}: Ошибка ID ${campaignId}: ${e.message}`);}

      if (!success && attempt < 3) {Utilities.sleep(1200);} // Пауза между повторными попытками
    }
    if (!success) { Logger.log(`[${index + 2}] 🚫 Все попытки пополнения для ID ${campaignId} завершились неудачей.`);}
    Utilities.sleep(1200); // Основная пауза между кампаниями
  }); Logger.log('✅ Массовое пополнение завершено.');
}

// 💵 Баланс РК
// Метод позволяет получать информацию о счёте, балансе и бонусах продавца.
// Допускается 1 запрос в секунду.

function get_advBalance() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
    var status_kvo = 'emonkey_advert'; // Здесь можно менять статус
    var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
    const Urls = Ecommonkey.Wildberries.getlinks(); const url = `${Urls.advbalance}`;
    const options = { muteHttpExceptions: true, headers: { Authorization: apiKey, accept: "application/json; charset=utf-8" }};
    try { const response = UrlFetchApp.fetch(url, options); Ecommonkey.Wildberries.handleBalanceResponse(response);}
    catch (error) { Logger.log('Ошибка при получении баланса: ' + error); }
    Utilities.sleep(1000);  get_advBudget(); } else { Logger.log('Нет соединения с Wildberries');}
}

// 💵 Бюджет РК
// Метод позволяет получать информацию о бюджете
function get_advBudget() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId(); if (!credentials) return; var campaignId = credentials.campaignId;
  const Urls = Ecommonkey.Wildberries.getlinks();const url = `${Urls.advbudget}${campaignId}`;
  const options = { muteHttpExceptions: true, headers: { Authorization: apiKey, accept: "application/json; charset=utf-8" } };
  try {
  const response = UrlFetchApp.fetch(url, options); handleBudgetResponse(response);}
  catch (error) {Logger.log("Произошла ошибка: " + error.message);}}

function handleBudgetResponse(response) {
  const responseCode = response.getResponseCode();
  const responseBody = JSON.parse(response.getContentText());
  switch(responseCode) {
    case 200:Ecommonkey.Wildberries.updateBudgetSheet(responseBody);break;
    case 400:Logger.log("Ошибка 400: Неверный запрос. " + JSON.stringify(responseBody));break;
    case 401:Logger.log("Ошибка 401: Не авторизован. " + JSON.stringify(responseBody));break;
    default:Logger.log("Ошибка " + responseCode + ": " + JSON.stringify(responseBody));break;}
  }
}

// ⛔ Завершить РК
// Метод позволяет завершить кампанию, находящуюся в статусе 9 или 11 или 4.
// Допускается 5 запросов в секунду.

function advStop() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected);
  if (isConnected) {
  try { var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId(); if (!credentials) return; var campaignId = credentials.campaignId;

    // Запрашиваем подтверждение у пользователя
    var response = Browser.msgBox("Вы точно хотите завершить кампанию?", Browser.Buttons.YES_NO);
    if (response === 'no') {return;}
      const Urls = Ecommonkey.Wildberries.getlinks(); const url = `${Urls.advstop}${campaignId}`;
      var options = {method: "get", headers: {"Authorization": apiKey}, muteHttpExceptions: true};
      var response = UrlFetchApp.fetch(url, options);
      Logger.log(response.getContentText());
      console.log(JSON.stringify(response, null, 5));

      switch (response.getResponseCode()) {
        case 200:Browser.msgBox("Статус кампании изменен на Завершить");return response.getContentText(); // Успешный ответ
        case 400:Browser.msgBox("Статус не изменен");break;
        case 401:Browser.msgBox("Не авторизован. Пожалуйста, проверьте ваш API ключ.");break;
        case 422:Browser.msgBox("Статус не изменен");break;
        default:Browser.msgBox(`Ошибка ${response.getResponseCode()}: ${response.getContentText()}`);}}
        catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 💵 Изменить ставку CPM у РК
// Измененная ставка отобразится в информации о кампании в течение трех минут.
// Допускается 5 запросов в секунду.

function adv_cpm() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);
  if (!isConnected) return;

  try {
    const status_kvo = 'emonkey_advert';
    const apiKey = getAPIStatus(status_kvo);  Logger.log('Используемый API Key: ' + apiKey);
    const credentials = Ecommonkey.Wildberries.getCampaignId(); if (!credentials) return;
    const campaignId = credentials.campaignId;
    // Запрашиваем CPM у пользователя
    const cpm = Ecommonkey.Wildberries.promptForCpm();  if (cpm === null) return;
    // Запрашиваем артикулы у пользователя
    const nmRaw = Browser.inputBox("Введите артикулы через запятую:", Browser.Buttons.OK_CANCEL);  if (nmRaw === 'cancel') return;

    const nmList = nmRaw
      .split(',')
      .map(str => parseInt(str.trim(), 10))
      .filter(nm => !isNaN(nm));

    if (nmList.length === 0) {  Browser.msgBox("⛔ Не введено ни одного корректного артикула."); return; }

    const Urls = Ecommonkey.Wildberries.getlinks();
    const apiUrl = `${Urls.advcpm}`;
    Ecommonkey.Wildberries.sendCpmRequestCPM(apiUrl, apiKey, campaignId, cpm, nmList);
  } catch (error) {
    Logger.log('Ошибка при выполнении: ' + error);  SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message); }
}

// 🗓 Средняя позиция товара в поисковой выдаче
function get_adv_booster() {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
    if (isConnected) {
    try { Logger.log('Запуск функции get_adv_booster');
    var status_kvo = 'emonkey_advert'; Logger.log('Статус KVO: ' + status_kvo);
    var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
    var campaignData = Ecommonkey.Wildberries.getCampaignData(); if (!campaignData) { Logger.log('Нет данных кампании');return; }
    var advBoostSheet = campaignData.advBoostSheet; Logger.log('🗓 Средняя позиция для кампании: ' + advBoostSheet.getName());
    const Urls = Ecommonkey.Wildberries.getlinks(); Logger.log('Получаем ссылки: ' + JSON.stringify(Urls));
    const apiUrl = `${Urls.advbooster}`; Logger.log('API URL: ' + apiUrl);
    var payload = campaignData.payload; Logger.log('Payload: ' + JSON.stringify(payload));
    const response = Ecommonkey.Wildberries.sendApiRequestBoost(apiUrl, apiKey, payload);
    if (response) {Ecommonkey.Wildberries.processApiResponseBoost(response, advBoostSheet);}}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 📦 Склад
// Возвращает остатки товаров на складах WB. Данные обновляются раз в 30 минут. Сервис статистики не хранит историю остатков товаров,
// поэтому получить данные о них можно только на текущий момент.

function get_stocks() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try { const status_kvo = 'emonkey_statistics';
  const apiKey = getAPIStatus(status_kvo);Logger.log('Используемый API Key: ' + apiKey);
  const stocksSheet = Ecommonkey.Wildberries.setupStocksSheet();
  const { formattedFromDate, formattedToDate } = Ecommonkey.Wildberries.getDateRangestock();
  const Urls = Ecommonkey.Wildberries.getlinks();
  const apiUrl = `${Urls.statstocks + formattedFromDate + '&dateTo=' + formattedToDate + '&flag=1'}`;
  const headers = { 'Authorization': 'Bearer ' + apiKey };
  Ecommonkey.Wildberries.fetchStockData(apiUrl, headers, stocksSheet);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error);  SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// Отчёт по остаткам на складах '📦 Склад остатки' Новый метод
// Создаёт задание на генерацию отчёта. Получив ID загружаем отчет.
// Параметры groupBy и filter можно задать в любой комбинации — аналогично версии в личном кабинете.

function get_stocks_warehouseId() {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
    const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids);
    Ecommonkey.Wildberries.checkConnection(isConnected);

    if (isConnected) {  try {
            var status_kvo = 'emonkey_supplies';
            var apiKey = getAPIStatus(status_kvo);
            Logger.log('Используемый API Key: ' + apiKey);
            const Urls = Ecommonkey.Wildberries.getlinks();
            const apiUrl = `${Urls.statstocks1}`;
            var downloadData = Ecommonkey.Wildberries.getStocksDataWarehouse(apiUrl, apiKey);
            if (downloadData) { Ecommonkey.Wildberries.writeToStocksSheetid(downloadData);}
        } catch (error) {
            Logger.log('Ошибка при выполнении: ' + error);
            SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
        }
    }
}

// 📦 Склад подробно 2
function get_stocks_warehouseIdV2() {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
    const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids);
    Ecommonkey.Wildberries.checkConnection(isConnected);
    if (isConnected) { try {
            var status_kvo = 'emonkey_supplies';
            var apiKey = getAPIStatus(status_kvo);
            const Urls = Ecommonkey.Wildberries.getlinks();
            const apiUrl = `${Urls.statstocks1}`;
            var downloadData = Ecommonkey.Wildberries.getStocksDataWarehouseV2(apiUrl, apiKey);
            if (downloadData) {Ecommonkey.Wildberries.writeToStocksSheetidV2(downloadData);
            Ecommonkey.Wildberries.findWarehouseWithMaxStock();}
        } catch (error) {SpreadsheetApp.getUi().alert('Ошибка: ' + error.message);}}
}

// 📦 Склад подробно 3
function get_stocks_warehouseIdV3() {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
    const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids);
    Ecommonkey.Wildberries.checkConnection(isConnected);
    if (isConnected) { try {
            var status_kvo = 'emonkey_supplies';
            var apiKey = getAPIStatus(status_kvo);
            const Urls = Ecommonkey.Wildberries.getlinks();
            const apiUrl = `${Urls.statstocks1}`;
            var downloadData = Ecommonkey.Wildberries.getStocksDataWarehouseV3(apiUrl, apiKey);
            if (downloadData) {Ecommonkey.Wildberries.writeToStocksSheetidV3(downloadData); }
        } catch (error) {SpreadsheetApp.getUi().alert('Ошибка: ' + error.message);}}
}

// Продажи 💳
// Возвращает продажи и возвраты. Данные обновляются раз в 30 минут. 1 строка = 1 заказ = 1 единица товара. Для определения заказа
// рекомендуем использовать поле srid. Данные заказа хранятся 90 дней от даты продажи

function get_sales() {
    // Создаем разовый триггер для get_salesV1(), который сработает через 9 минут
  ScriptApp.newTrigger("setupPeriodSalesTrigger")
      .timeBased()
      .after(9 * 60 * 1000) // Через 9 минут
      .create();

  // Создаем триггер для удаления всех триггеров через 30 минут
  ScriptApp.newTrigger("clearTriggersSales")
      .timeBased()
      .after(30 * 60 * 1000) // Через 30 минут
      .create();

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('💳 Продажи');
  if (sheet) sheet.clearContents(); // Очищаем содержимое листа перед началом работы

  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_statistics';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var { formattedFromDate, formattedToDate, salesSheet } = Ecommonkey.Wildberries.setupSalesSheet();
  const Urls = Ecommonkey.Wildberries.getlinks();
  const apiUrl = `${Urls.statsales + formattedFromDate + '&dateTo=' + formattedToDate + '&flag=0'}`;
  var headers = { 'Authorization': 'Bearer ' + apiKey };
  var response = UrlFetchApp.fetch(apiUrl, { headers: headers, method: 'get' });
  var responseData = JSON.parse(response.getContentText()); console.log(JSON.stringify(responseData, null, 5));
  if (responseData && responseData.length > 0) {Ecommonkey.Wildberries.processSalesData(responseData, salesSheet); }
  else {Logger.log('Данные не найдены или пустые');}}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// Этот метод создается первым триггером и запустит get_salesV1(), а также создаст постоянный триггер
function setupPeriodSalesTrigger() {
  // Создаем триггер для get_salesV1() с интервалом 10 минут
  ScriptApp.newTrigger("get_salesV1")
      .timeBased()
      .everyMinutes(10)
      .create();

  get_salesV1(); // Сразу вызываем функцию один раз
}

// Функция для удаления всех триггеров, связанных с get_salesV1()
function clearTriggersSales() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    var triggerFunction = trigger.getHandlerFunction();
    if (triggerFunction === "get_salesV1" || triggerFunction === "setupPeriodSalesTrigger" || triggerFunction === "clearTriggersSales") {  ScriptApp.deleteTrigger(trigger);  }
  });
}

function get_salesV1() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_statistics';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var { formattedFromDate, formattedToDate, salesSheet } = Ecommonkey.Wildberries.setupSalesSheet();
  const Urls = Ecommonkey.Wildberries.getlinks();
  const apiUrl = `${Urls.statsales + formattedFromDate + '&dateTo=' + formattedToDate + '&flag=0'}`;
  var headers = {'Authorization': 'Bearer ' + apiKey };
  var response = UrlFetchApp.fetch(apiUrl, { headers: headers, method: 'get' });
  var responseData = JSON.parse(response.getContentText()); console.log(JSON.stringify(responseData, null, 5));
  if (responseData && responseData.length > 0) {Ecommonkey.Wildberries.processSalesDataV1(responseData, salesSheet); }
  else {Logger.log('Данные не найдены или пустые');}}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Заказы 🛒
// Данные обновляются раз в 30 минут. Гарантируется хранение данных не более 90 дней от даты заказа.
// Для идентификации заказа следует использовать поле srid.
// 1 строка = 1 заказ = 1 единица товара.
// Максимум 1 запрос в минуту

/*/
function get_orders() {
  // Создаем разовый триггер для get_ordersV1(), который сработает через 9 минут
  ScriptApp.newTrigger("setupPeriodOrderTrigger")
      .timeBased()
      .after(9 * 60 * 1000) // Через 9 минут
      .create();

  // Создаем триггер для удаления всех триггеров через 30 минут
  ScriptApp.newTrigger("clearTriggersOrder")
      .timeBased()
      .after(30 * 60 * 1000) // Через 30 минут
      .create();

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('🛒 Заказы');
  if (sheet) sheet.clearContents(); // Очищаем содержимое листа перед началом работы

  const ids = spreadsheet.getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение

  if (isConnected) {
    try {
      var status_kvo = 'emonkey_statistics';
      var apiKey = getAPIStatus(status_kvo);
      Logger.log('Используемый API Key: ' + apiKey);
      var { formattedFromDate, formattedToDate, orderSheet } = Ecommonkey.Wildberries.initializeOrderSheet();
      const Urls = Ecommonkey.Wildberries.getlinks();
      var lastChangeDate = formattedFromDate;
      var headers = { 'Authorization': 'Bearer ' + apiKey };
      var allOrders = [];

      while (true) {
        var apiUrl = `${Urls.statorder + lastChangeDate + '&dateTo=' + formattedToDate + '&flag=0'}`;
        var response = UrlFetchApp.fetch(apiUrl, { headers: headers, method: 'get' });
        var responseData = JSON.parse(response.getContentText());
        if (!responseData || responseData.length === 0) break; // Если массив пуст, прекращаем запросы
        allOrders = allOrders.concat(responseData);
        lastChangeDate = responseData[responseData.length - 1].lastChangeDate;}

      console.log(JSON.stringify(allOrders, null, 5));
      Ecommonkey.Wildberries.processResponseData(allOrders, orderSheet);
    } catch (error) {Logger.log('Ошибка при выполнении: ' + error);}
  }
}
/*/

// В случае ошибки парсинга (например, из-за обрезанного ответа), добавлен дополнительный блок с попыткой восстановления ответа через match(/\{[^{}]+\}/g)
function get_orders() {
  // Создаем разовый триггер для get_ordersV1(), который сработает через 9 минут
  ScriptApp.newTrigger("setupPeriodOrderTrigger")
      .timeBased()
      .after(9 * 60 * 1000) // Через 9 минут
      .create();

  // Создаем триггер для удаления всех триггеров через 30 минут
  ScriptApp.newTrigger("clearTriggersOrder")
      .timeBased()
      .after(30 * 60 * 1000) // Через 30 минут
      .create();

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('🛒 Заказы');
  if (sheet) sheet.clearContents(); // Очищаем содержимое листа перед началом работы

  const ids = spreadsheet.getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение

  if (isConnected) {
    try {
      const status_kvo = 'emonkey_statistics';
      const apiKey = getAPIStatus(status_kvo);
      Logger.log('Используемый API Key: ' + apiKey);

      const { formattedFromDate, formattedToDate, orderSheet } = Ecommonkey.Wildberries.initializeOrderSheet();
      const Urls = Ecommonkey.Wildberries.getlinks();
      const headers = { 'Authorization': 'Bearer ' + apiKey };
      let lastChangeDate = formattedFromDate;
      let allOrders = [];

      while (true) {
        const apiUrl = `${Urls.statorder}${lastChangeDate}&dateTo=${formattedToDate}&flag=0`;
        Logger.log("Запрос к API: " + apiUrl);

        try {
          const response = UrlFetchApp.fetch(apiUrl, { headers: headers, method: 'get' });
          const text = response.getContentText();
          let responseData;

          try {
            responseData = JSON.parse(text);
            Logger.log("Успешный парсинг JSON. Получено заказов: " + responseData.length);
          } catch (jsonError) {
            Logger.log("Ошибка парсинга JSON: " + jsonError);
            Logger.log("Тело ответа (обрезано до 1000 символов): " + text.substring(0, 1000));

            try {
              const matches = text.match(/\{[^{}]+\}/g);

              if (!matches || matches.length === 0) {
                throw new Error("Не удалось найти валидные JSON-объекты в ответе");
              }

              const fixedJson = '[' + matches.join(',') + ']';
              responseData = JSON.parse(fixedJson);
              Logger.log("Успешно восстановлено заказов: " + responseData.length + " из " + matches.length);
            } catch (partialError) {
              Logger.log("Ошибка частичного восстановления JSON: " + partialError);
              break;
            }
          }

          if (!responseData || responseData.length === 0) {
            Logger.log("Пустой или некорректный ответ от API — завершаем цикл.");
            break;
          }

          allOrders = allOrders.concat(responseData);
          lastChangeDate = responseData[responseData.length - 1].lastChangeDate;
          Logger.log("Текущая общая сумма заказов: " + allOrders.length);
          Logger.log("Следующий lastChangeDate: " + lastChangeDate);

        } catch (requestError) {
          Logger.log("Ошибка запроса к API: " + requestError);
          break;
        }
      }

      Logger.log("Общее количество заказов к обработке: " + allOrders.length);
      Logger.log(JSON.stringify(allOrders.slice(0, 5), null, 2)); // логируем первые 5 заказов
      Ecommonkey.Wildberries.processResponseData(allOrders, orderSheet);

    } catch (error) {
      Logger.log('Ошибка при выполнении: ' + error);
    }
  }
}

// Этот метод создается первым триггером и запустит get_ordersV1(), а также создаст постоянный триггер
function setupPeriodOrderTrigger() {
  // Создаем триггер для get_ordersV1() с интервалом 10 минут
  ScriptApp.newTrigger("get_ordersV1")
      .timeBased()
      .everyMinutes(10)
      .create();
  get_ordersV1(); // Сразу вызываем функцию один раз
}

// Функция для удаления всех триггеров, связанных с get_ordersV1()
function clearTriggersOrder() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    var triggerFunction = trigger.getHandlerFunction();
    if (triggerFunction === "get_ordersV1" || triggerFunction === "setupPeriodOrderTrigger" || triggerFunction === "clearTriggersOrder") {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

/*/
function get_ordersV1() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
    try {
      var status_kvo = 'emonkey_statistics';
      var apiKey = getAPIStatus(status_kvo);
      Logger.log('Используемый API Key: ' + apiKey);
      var { formattedFromDate, formattedToDate, orderSheet } = Ecommonkey.Wildberries.initializeOrderSheet();
      const Urls = Ecommonkey.Wildberries.getlinks();
      var lastChangeDate = formattedFromDate;
      var headers = { 'Authorization': 'Bearer ' + apiKey };
      var allOrders = [];

      while (true) {
        var apiUrl = `${Urls.statorder + lastChangeDate + '&dateTo=' + formattedToDate + '&flag=0'}`;
        var response = UrlFetchApp.fetch(apiUrl, { headers: headers, method: 'get' });
        var responseData = JSON.parse(response.getContentText());
        if (!responseData || responseData.length === 0) break; // Если массив пуст, прекращаем запросы
        allOrders = allOrders.concat(responseData);
        lastChangeDate = responseData[responseData.length - 1].lastChangeDate;
      }

      console.log(JSON.stringify(allOrders, null, 5));
      Ecommonkey.Wildberries.processResponseDataV1(allOrders, orderSheet);
    } catch (error) {Logger.log('Ошибка при выполнении: ' + error);}
  }
}
/*/

function get_ordersV1() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение

  if (isConnected) {
    try {
      const status_kvo = 'emonkey_statistics';
      const apiKey = getAPIStatus(status_kvo);
      Logger.log('Используемый API Key: ' + apiKey);

      const { formattedFromDate, formattedToDate, orderSheet } = Ecommonkey.Wildberries.initializeOrderSheet();
      const Urls = Ecommonkey.Wildberries.getlinks();
      const headers = { 'Authorization': 'Bearer ' + apiKey };
      let lastChangeDate = formattedFromDate;
      let allOrders = [];

      while (true) {
        const apiUrl = `${Urls.statorder}${lastChangeDate}&dateTo=${formattedToDate}&flag=0`;
        Logger.log("Запрос к API: " + apiUrl);

        try {
          const response = UrlFetchApp.fetch(apiUrl, { headers: headers, method: 'get' });
          const text = response.getContentText();
          let responseData;

          try {
            responseData = JSON.parse(text);
            Logger.log("Успешный парсинг JSON. Получено заказов: " + responseData.length);
          } catch (jsonError) {
            Logger.log("Ошибка парсинга JSON: " + jsonError);
            Logger.log("Тело ответа (обрезано до 1000 символов): " + text.substring(0, 1000));

            try {
              const matches = text.match(/\{[^{}]+\}/g);

              if (!matches || matches.length === 0) {
                throw new Error("Не удалось найти валидные JSON-объекты в ответе");
              }

              const fixedJson = '[' + matches.join(',') + ']';
              responseData = JSON.parse(fixedJson);
              Logger.log("Успешно восстановлено заказов: " + responseData.length + " из " + matches.length);
            } catch (partialError) {
              Logger.log("Ошибка частичного восстановления JSON: " + partialError);
              break;
            }
          }

          if (!responseData || responseData.length === 0) {
            Logger.log("Пустой или некорректный ответ от API — завершаем цикл.");
            break;
          }

          allOrders = allOrders.concat(responseData);
          lastChangeDate = responseData[responseData.length - 1].lastChangeDate;
          Logger.log("Текущая общая сумма заказов: " + allOrders.length);
          Logger.log("Следующий lastChangeDate: " + lastChangeDate);

        } catch (requestError) {
          Logger.log("Ошибка запроса к API: " + requestError);
          break;
        }
      }

      Logger.log("Общее количество заказов к обработке: " + allOrders.length);
      Logger.log("Первые 5 заказов (обрезано): " + JSON.stringify(allOrders.slice(0, 5), null, 2));
      Ecommonkey.Wildberries.processResponseDataV1(allOrders, orderSheet);

    } catch (error) {
      Logger.log('Ошибка при выполнении: ' + error);
    }
  }
}

// 🚚 Поставки
// Дата и время последнего изменения по поставке.
// Дата в формате RFC3339. Можно передать дату или дату со временем. Время можно указывать с точностью до секунд или миллисекунд.
// Время передаётся в часовом поясе Мск (UTC+3).
// Примеры:
// 2019-06-20
// 2019-06-20T23:59:59
// 2019-06-20T00:00:00.12345
// 2017-03-25T00:00:00

function get_incomes() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_statistics';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var {formattedFromDate, formattedToDate, incomeSheet} = Ecommonkey.Wildberries.initializeIncomeSheet();
  const Urls = Ecommonkey.Wildberries.getlinks();
  const apiUrl = `${Urls.statincomes + formattedFromDate + '&dateTo=' + formattedToDate + '&flag=0'}`;
  var headers = {'Authorization': 'Bearer ' + apiKey};
  var response = UrlFetchApp.fetch(apiUrl, {headers: headers, method: 'get'});
  var responseData = JSON.parse(response.getContentText());
  console.log(JSON.stringify(responseData, null, 5));
  Ecommonkey.Wildberries.processIncomeData(responseData, incomeSheet);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 📊 Отчет о продажах по реализации
// Детализация к еженедельному отчёту реализации. Доступны данные, начиная с 29 января 2024 года. Максимум 1 запрос в минуту.
// Если нет данных за указанный период, метод вернет [].
// limit	Default: 100000 Максимальное количество строк отчета, возвращаемых методом. Не может быть более 100000.

function get_DetailByPeriod() {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
    if (isConnected) {
    try { const status_kvo = 'emonkey_statistics';
    const apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const byPeriodSheet = spreadsheet.getSheetByName('📊 Отчет по реализации');
    Ecommonkey.Wildberries.clearSheet(byPeriodSheet);
    const headers = Ecommonkey.Wildberries.getHeaders(); Ecommonkey.Wildberries.setHeaders(byPeriodSheet, headers);
    const { fromDate, toDate } = Ecommonkey.Wildberries.getDateRange(spreadsheet);
    const formattedDates = Ecommonkey.Wildberries.formatDates(fromDate, toDate);
    const arr = fetchData(formattedDates.from, formattedDates.to, apiKey, seePro);
    if (arr.length > 0) {
        const numRows = arr.length;
        const numCols = arr[0].length;
        const lastRow = byPeriodSheet.getMaxRows();
        const lastCol = byPeriodSheet.getMaxColumns();

        // Проверяем, достаточно ли строк на листе
        if (numRows > (lastRow - 1)) { // Добавляем нужное количество строк, чтобы соответствовать массиву
        byPeriodSheet.insertRowsAfter(lastRow, numRows - (lastRow - 1));}
        byPeriodSheet.getRange(2, 1, numRows, numCols).setValues(arr);}
        else {Logger.log('Нет данных для вставки.');}}
        catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

function fetchData(formattedFromDate, formattedToDate, apiKey) {
    const limit = 10000;
    let rrdid = 0;
    const arr = [];
    const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.statrealize}`;
    try {
        while (true) {
            const url_reports = `${apiUrl}?dateFrom=${formattedFromDate}&dateTo=${formattedToDate}&limit=${limit}&rrdid=${(rrdid ? rrdid + 1 : 0)}`; Logger.log(url_reports);
            const response = Ecommonkey.Wildberries.request(url_reports, 'get', apiKey); Logger.log(response);
            if (response.length === 0) {break;} arr.push(...Ecommonkey.Wildberries.parseResponse(response));
            if (response.length < limit) {break;} else {rrdid = response[response.length - 1].rrd_id;}}
    } catch (error) { Logger.log('Ошибка при выполнении запроса: ' + error); Browser.msgBox('Произошла ошибка: ' + error.message);}
    return arr;}

// 🛄 Товары - Список номенклатур (НМ)
// Метод позволяет получить список созданных НМ с фильтрацией по разным параметрам, пагинацией и сортировкой.

function get_card_list() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {const status_kvo = 'emonkey_content';
  const apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const Urls = Ecommonkey.Wildberries.getlinks(); const url = `${Urls.contcardlist}`;
  let { cursor, allCards, requestCount } = Ecommonkey.Wildberries.initializeParametersCardList();
  Ecommonkey.Wildberries.fetchCardData(url, apiKey, cursor, allCards, requestCount);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 🛄 Список товаров
// Возвращает информацию о товаре по его артикулу. Чтобы получить информацию обо всех товарах, оставьте артикул пустым

function get_list_goods() {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
    if (isConnected) {
    try { const status_kvo = 'emonkey_content';
    const apiKey = getAPIStatus(status_kvo);  Logger.log('Используемый API Key: ' + apiKey);
    const Urls = Ecommonkey.Wildberries.getlinks(); const url = `${Urls.contlistgoods}`;
    const list_goodsSheet = Ecommonkey.Wildberries.initializeGoodsSheet();
    const headers = ['Артикул WB', 'Артикул продавца', 'ID размера', 'Цена', 'Цена со скидкой', 'Размер товара', 'Валюта', 'Скидка, %', 'Можно ли устанавливать цены отдельно для разных размеров'];
    list_goodsSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    Ecommonkey.Wildberries.fetchGoodsData(url, apiKey, list_goodsSheet, headers);}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 🛄 Товары WB
// Забираем данные напрямую с сайта
function sppProductDetails() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try { const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const productSheet = spreadsheet.getSheetByName("🛄 Товары");
  if (!productSheet) { Logger.log("Лист '🛄 Товары' не найден."); return; }
  get_card_list(); Utilities.sleep(1000);
  get_list_goods(); Utilities.sleep(1000);
  const nmIds = productSheet.getRange("A2:A").getValues().flat().filter(Boolean);
  const allRows = [];
  Ecommonkey.Wildberries.setparamProductData(nmIds, allRows, seePro);
  const sheet = spreadsheet.getSheetByName("🛄 Товары WB");
  if (!sheet) { Logger.log("Лист '🛄 Товары WB' не найден."); return; }
  sheet.getRange("A:X").clearContent();
  const headers = ['ID продукта', 'Название', 'Бренд', 'Цвет', 'Размер', 'Оригинальное название размера', 'Цена (basic)', 'Цена (product)', 'ID склада', 'Количество', 'Предмет', 'Рейтинг поставщика', 'Рейтинг отзывов', 'Кол-во фото', 'Кол-во отзывов', 'ID акции', 'Время сборки', 'Время доставки'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (allRows.length > 0) {sheet.getRange(2, 1, allRows.length, allRows[0].length).setValues(allRows);
  Ecommonkey.Wildberries.delete_empty_columns_goods_wb();}
  Ecommonkey.Wildberries.setFormulasParaWb(); Logger.log("Данные успешно записаны на лист '🛄 Товары WB'.");}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 📊 Коэффициенты приёмки
// Возвращает коэффициенты приёмки для конкретных складов на ближайшие 14 дней.
// Максимум 6 запросов в минуту

function get_coefficient() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_supplies'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var coofListSheet = Ecommonkey.Wildberries.setupCoofListSheet();
  const warehouseIDs = Ecommonkey.Wildberries.getWarehouseIDs();
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.tarrifcoof}${warehouseIDs}`;
  Ecommonkey.Wildberries.fetchAndProcessDataCoof(apiUrl, apiKey, coofListSheet);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 📦 Список складов
// Возвращает список складов Wildberries.
// Максимум 6 запросов в минуту

function get_stock_list() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try { var status_kvo = 'emonkey_supplies'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo);  Logger.log('Используемый API Key: ' + apiKey);
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.tarrifstock}`;
  Ecommonkey.Wildberries.stockListDatsProp(apiUrl, apiKey); }
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// функция обновляет 📦 ID складов WB
// Забираем данные с внешки
function stocksid_refresh() {
  try {Ecommonkey.Wildberries.stocksid_refresh(); }
  catch (error) { Logger.log("Ошибка при вызове stocksid_refresh: " + error.message); }}

// 🛍️ Воронка продаж
// Получение статистики КТ за выбранный период, по nmID/предметам/брендам/тегам
// Поля brandNames,objectIDs, tagIDs, nmIDs могут быть пустыми, тогда в ответе идут все карточки продавца.
// Также в данных, где предоставляется информация по предыдущему периоду:
// В previousPeriod данные за такой же период, что и в selectedPeriod.

function get_nmId() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_analytics'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo);
  Logger.log('Используемый API Key: ' + apiKey);
  var { formattedFromDate1, formattedToDate1 } = Ecommonkey.Wildberries.getFormattedDatesNmID();
  const apiUrl = `${Ecommonkey.Wildberries.getlinks().djemnm}`;
  Ecommonkey.Wildberries.fetchDataFromAPInmid(apiUrl, apiKey, formattedFromDate1, formattedToDate1);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 🛍️ Воронка по дням - Воронка продаж
// Получение статистики КТ по дням по выбранным nmID. Можно получить отчёт максимум за последнюю неделю.
// Чтобы получать отчёты за период до года, подпишитесь на расширенную аналитику Джем.
// Максимум 3 запроса в минуту.
// https://openapi.wb.ru/analytics/api/ru/#tag/Voronka-prodazh/paths/~1api~1v2~1nm-report~1detail~1history/post

function get_nmId_days() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_analytics';
  var apiKey = getAPIStatus(status_kvo);
  Logger.log('Используемый API Key: ' + apiKey);
  var { formattedFromDate1, formattedToDate1 } = Ecommonkey.Wildberries.getFormattedDatesNmDays();
  const Urls = Ecommonkey.Wildberries.getlinks();const apiUrl = `${Urls.djemnmdays}`;
  var responseData = Ecommonkey.Wildberries.dataFromApiNmDay(apiKey, apiUrl, formattedFromDate1, formattedToDate1);
  if (responseData) {Ecommonkey.Wildberries.initializeNmIdaySheet(); Ecommonkey.Wildberries.processCardsNmDays(responseData.data);}}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 🪧 Комиссии
// Возвращает комиссию WB по родительским категориям товаров согласно модели продаж.
function get_commissions() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_analytics'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const Urls = Ecommonkey.Wildberries.getlinks();
  const apiUrl = `${Urls.tarrifcommiss}`;
  var list_commissions = Ecommonkey.Wildberries.initializeCommissionsSheet();
  var headers = {"Authorization": apiKey, "Content-Type": "application/json"};
  var options = {"method": "get", "headers": headers, "muteHttpExceptions": true};
  var response = UrlFetchApp.fetch(apiUrl, options);
  if (response.getResponseCode() !== 200) {Logger.log("Ошибка при получении данных: " + response.getContentText()); return;}
  var data = JSON.parse(response.getContentText()); Logger.log(JSON.stringify(data, null, 5));
  Ecommonkey.Wildberries.writeCommissionsToSheet(list_commissions, data);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 📦 Тарифы короба - Тарифы для коробов / Максимум — 60 запросов в минуту.
// Для товаров, которые поставляются на склад в коробах (коробках), возвращает стоимость:
// доставки со склада или пункта приёма до покупателя;
// доставки от покупателя до пункта приёма;
// хранения на складе Wildberries.

function get_tariffsbox() {
    const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
    const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
    if (isConnected) {
    try { var status_kvo = 'emonkey_analytics'; // Здесь можно менять статус
    var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
    var { sDatePeriod_1, sDatePeriod_2, list_tarrifs } = Ecommonkey.Wildberries.initializeTariffsSheet();

    Logger.log('sDatePeriod_1: ' + sDatePeriod_1);
    Logger.log('sDatePeriod_2: ' + sDatePeriod_2);

    const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.tarrifbox + sDatePeriod_1}`;
    var headers = {"Authorization": apiKey, "Content-Type": "application/json"};
    var options = {"method": "get", "headers": headers, "muteHttpExceptions": true};
    var response = UrlFetchApp.fetch(apiUrl, options);if (response.getResponseCode() !== 200) {
    Logger.log("Ошибка при получении данных: " + response.getContentText());return;}
    var data = JSON.parse(response.getContentText()).response.data; Logger.log(JSON.stringify(data, null, 5));
    Ecommonkey.Wildberries.processTariffData(data, list_tarrifs);}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 📦 Тарифы паллеты - Тарифы для монопаллет / Максимум — 60 запросов в минуту.
// Для товаров, которые поставляются на склад Wildberries на монопаллетах, возвращает стоимость:
// доставки со склада до покупателя;
// доставки от покупателя до склада;
// хранения на складе Wildberries.

function get_tariffpallet() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_analytics'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var { sDatePeriod_1, list_tarrifs } = Ecommonkey.Wildberries.initializeSheetAndDates();
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.tarrifpallet + sDatePeriod_1}`;

    var headersArray = [
      'Дата начала следующего тарифа',
      'Дата окончания последнего установленного тарифа',
      'Название склада',
      'Коэффициент доставки, %',
      'Доставка 1 литра, ₽',
      'Доставка каждого дополнительного литра, ₽',
      'Коэффициент хранения, %',
      'Хранение 1 монопаллеты, ₽'];
    Ecommonkey.Wildberries.setHeadersPall(list_tarrifs, headersArray);
    var headers = { "Authorization": apiKey, "Content-Type": "application/json" };
    var options = {"method": "get","headers": headers,"muteHttpExceptions": true};
    var response = UrlFetchApp.fetch(apiUrl, options);
    Logger.log(JSON.stringify(response, null, 5));
    if (response.getResponseCode() !== 200) {Logger.log("Ошибка при получении данных: " + response.getContentText());return;}
    var data = JSON.parse(response.getContentText()).response.data;
    Ecommonkey.Wildberries.processWarehouseDataPall(data, list_tarrifs, headersArray);}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 📦 Тарифы возвраты / Тарифы на возврат / Максимум — 60 запросов в минуту.
// Возвращает тарифы:
// на перевозку товаров со склада Wildberries или из пункта приёма до продавца
// на обратную перевозку возвратов, которые не забрал продавец

function get_tariffreturn() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try { var status_kvo = 'emonkey_analytics'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo);Logger.log('Используемый API Key: ' + apiKey);
  var { sDatePeriod, list } = Ecommonkey.Wildberries.initializeTariffRetSheet();

    var headers = { "Authorization": apiKey, "Content-Type": "application/json" };
    var options = { "method": "get", "headers": headers, "muteHttpExceptions": true };
    const Urls = Ecommonkey.Wildberries.getlinks();
    const apiUrl = `${Urls.tarrifreturn + '?date=' + sDatePeriod}`;
    var response = UrlFetchApp.fetch(apiUrl, options);
    Logger.log(JSON.stringify(response, null, 5));
    if (response.getResponseCode() !== 200) {Logger.log("Ошибка при получении данных: " + response.getContentText());return;}
    var data = JSON.parse(response.getContentText()).response.data;
    if (data.warehouseList && data.warehouseList.length > 0) {
    Ecommonkey.Wildberries.processWarehouseData(data, list);} else {Logger.log("Нет данных для записи.");}}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 🧑‍💻 Необработанные отзывы кол-во
// Метод позволяет получить количество необработанных отзывов за сегодня, за всё время, и среднюю оценку всех отзывов.

function unanswered_feedbacks() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try { var status_kvo = 'emonkey_feedbacks'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = Urls.feedbackscount;
  var unanswered_feedbacks = Ecommonkey.Wildberries.setupUnansweredFeedbackSheet();
  Ecommonkey.Wildberries.fetchFeedbackDataUnAnswer(apiUrl, apiKey, unanswered_feedbacks);}
  catch (error) {Logger.log('Ошибка при выполнении: ' + error); SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);}
  }
}

// 📢 Список отзывов с выбором
// Метод позволяет получить список отзывов по заданным параметрам с пагинацией и сортировкой.

function startFeedbacks() {
  var html = HtmlService.createHtmlOutputFromFile('SelectIsAnswered')
      .setWidth(400)
      .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, 'Выбор типа отзывов');
}

function feedbacks(isAnsweredInput) {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  var status_kvo = 'emonkey_feedbacks';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var isAnswered = (isAnsweredInput === 'true');
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = Urls.feedbacksall;
  var { feedbacksheet, dateFrom, dateTo } = Ecommonkey.Wildberries.feedbackSheetlisting();

  const headersArray = ['ID', 'Текст', 'Рейтинг', 'Дата', 'Отвечен', 'Статус отзыва', 'Достоинства товара', 'Недостатки товара', 'Артикул WB', 'ШВ карточки товара', 'Название товара', 'Артикул продавца', 'Имя продавца', 'Бренд товара', 'Размер товара', 'Имя автора отзыва', 'Соответствие заявленного размера реальному', 'Штрихкод товара', 'Название предмета', 'Просмотрен ли отзыв', 'Фото'];

  let allRows = [];
  var params = {
    isAnswered: isAnswered,
    nmId: '',
    take: 5000,
    skip: 0,
    order: 'dateDesc',
    dateFrom: dateFrom,
    dateTo: dateTo};

  var queryString = Object.keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

  const fullUrl = apiUrl + '?' + queryString;
  var headers = { "Authorization": apiKey, "Content-Type": "application/json" };
  var options = { "method": "get", "headers": headers, "muteHttpExceptions": true };

  try {
    var response = UrlFetchApp.fetch(fullUrl, options);
    const jsonResponse = JSON.parse(response.getContentText());
    console.log(JSON.stringify(jsonResponse, null, 5));

    if (jsonResponse.data && jsonResponse.data.feedbacks) {
      jsonResponse.data.feedbacks.forEach(feedback => {
        var row = Ecommonkey.Wildberries.createFeedbackRow(feedback);
        allRows.push(row);});}
  } catch (error) {console.error(`Ошибка при получении отзывов: ${error.message}`);}

  if (allRows.length > 0) {
    feedbacksheet.getRange(2, 1, allRows.length, headersArray.length).setValues(allRows);
    feedbacksheet.getRange(1, 1, 1, headersArray.length).setValues([headersArray]);}
  try {
  Ecommonkey.Wildberries.setFeedbackFormulas(feedbacksheet);
  Ecommonkey.Wildberries.disableCheckboxes(); Utilities.sleep(2000);
  Ecommonkey.Wildberries.checkStopPhrases(); Utilities.sleep(2000);
  Ecommonkey.Wildberries.updateUniqueReviews(); Utilities.sleep(2000);
  Ecommonkey.Wildberries.delete_empty_columns_feedBack();
 }
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 📢 Список отзывов полностью все
// Метод позволяет получить список отзывов по заданным параметрам с пагинацией и сортировкой.

function feedbacks_all() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  var status_kvo = 'emonkey_feedbacks'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var { feedbacksheet, dateFrom, dateTo } = Ecommonkey.Wildberries.initializeFeedbackSheetAll();

  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = Urls.feedbacksall;
  const headersArray = ['ID', 'Текст', 'Рейтинг', 'Дата', 'Отвечен', 'Статус отзыва', 'Достоинства товара', 'Недостатки товара', 'Артикул WB', 'ШВ карточки товара', 'Название товара', 'Артикул продавца', 'Имя продавца', 'Бренд товара', 'Размер товара', 'Имя автора отзыва', 'Соответствие заявленного размера реальному','Штрихкод товара','Название предмета','Просмотрен ли отзыв', 'Фото'];

  var allRows = [];

  function fetchFeedbacks(isAnswered) {
    var params = { isAnswered: isAnswered, nmId: '', take: 5000, skip: 0, order: 'dateDesc', dateFrom: dateFrom, dateTo: dateTo };
    var queryString = Object.keys(params)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');
    const fullUrl = apiUrl + '?' + queryString;

      var headers = { "Authorization": apiKey, "Content-Type": "application/json" };
      var options = { "method": "get", "headers": headers, "muteHttpExceptions": true };

      try {
        var response = UrlFetchApp.fetch(fullUrl, options);
        const jsonResponse = JSON.parse(response.getContentText());
        console.log(JSON.stringify(jsonResponse, null, 5));

        if (jsonResponse.data && jsonResponse.data.feedbacks) {
          jsonResponse.data.feedbacks.forEach(feedback => {
            var row = Ecommonkey.Wildberries.createFeedbackRowAll(feedback); allRows.push(row);});
        }
      } catch (error) {console.error(`Ошибка при получении отзывов: ${error.message}`);}

  }
try {
  fetchFeedbacks('false');
  Utilities.sleep(1000);
  fetchFeedbacks('true');

  if (allRows.length > 0) {
    feedbacksheet.getRange(2, 1, allRows.length, headersArray.length).setValues(allRows);
    feedbacksheet.getRange(1, 1, 1, headersArray.length).setValues([headersArray]);


    // Задержка перед запуском следующей функции
    Utilities.sleep(5000); Ecommonkey.Wildberries.disableCheckboxes(); // Отключаем чекбоксы
    Utilities.sleep(5000); Ecommonkey.Wildberries.checkStopPhrases(); // Определяем стоп фразы
    Utilities.sleep(5000); Ecommonkey.Wildberries.updateUniqueReviews(); // Обновляем 🧑‍💻 Ответы на отзывы
    Utilities.sleep(1000); Ecommonkey.Wildberries.delete_empty_columns_feedBack_all(); // Удаляем пустые строки
  }
}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// Работа с отзывами - 🧑‍💻 Ответы на отзывы
// В зависимости от тела запроса можно:
// Просмотреть отзыв.
// Ответить на отзыв, или отредактировать ответ.
// Оценить отзыв и/или товар.
// Отредактировать ответ на отзыв можно в течение 2 месяцев (60 дней), после предоставления ответа и только 1 раз.

function feedbacks_patch() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try { var status_kvo = 'emonkey_feedbacks'; // Здесь можно менять статус
  const Urls = Ecommonkey.Wildberries.getlinks();
  const apiUrl = Urls.feedbackspatch;
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);

    var feedbackData = Ecommonkey.Wildberries.getFeedbackData();
    var feedbackIds = feedbackData.ids;
    var responseTextsMatrix = feedbackData.texts;

    // Вызов функции для обработки отзывов
    Ecommonkey.Wildberries.processFeedbacks(feedbackIds, responseTextsMatrix, apiUrl, apiKey);}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 📢 Автоответы на отзывы 🧑‍💻
// Запускаем автоответы на отзывы раз в 3 часа
// Запускаем обновление отзывов и потом запускаем ответы на них
function start_feedbacks_partch() {feedbacks_all(); Utilities.sleep(2000); feedbacks_patch(); Utilities.sleep(2000); }

// Устанавливаем обновление каждые 3 часа
function trigger_start_feedbacks_partch() {
    const triggers = ScriptApp.getProjectTriggers();
    let triggerExists = false; for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'start_feedbacks_partch') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('start_feedbacks_partch')
    .timeBased().everyHours(3) .create();}}

// Удаляем автоответы на отзывы
function delete_start_feedbacks_partch() {
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'start_feedbacks_partch') {ScriptApp.deleteTrigger(trigger);break; }}
}

// 🚧 Поисковые запросы по товару // Максимум 3 запроса в минуту
// Формирует топ поисковых запросов по товару.
// Параметр выбора поисковых запросов:
// limit — количество запросов (максимум 30)
// topOrderBy — способ выбора топа запросов

// topOrderBy
// Сортировка по полю поискового запроса:
// openCard - Перешли в карточку из поиска
// addToCart - Добавили в корзину из поиска
// openToCart - Конверсия в корзину из поиска
// orders - Заказали товаров из поиска
// cartToOrder - Конверсия в заказ из поиска

// field
// Виды сортировки:
// avgPosition — по средней позиции
// addToCart — по добавлениям в корзину
// openCard — по открытию карточки (переход на страницу товара)
// orders — по количеству заказов
// cartToOrder — по товарам, которые перешли из корзины в заказ
// visibility — по видимости товара
// minPrice — по минимальной цене
// maxPrice — по максимальной цене

function search_words() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try { var status_kvo = 'emonkey_content'; // Здесь можно менять статус
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var sheetsData = Ecommonkey.Wildberries.initializeSheetsSearchWords();
  Ecommonkey.Wildberries.processSearchWordsData(sheetsData, apiKey);
  Utilities.sleep(1000); Ecommonkey.Wildberries.generateNewSentences(); }
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

///////////*///////////*///////////*///////////*///////////*///////////*///////////*///////////*///////////*///////////*///////////*
// 📕 Список акций
// Возвращает список акций с датами и временем проведения
// Максимум 10 запросов за 6 секунд для всех методов Календаря акций на один аккаунт продавца

function get_promoList() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_statistics';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const Urls = Ecommonkey.Wildberries.getlinks();
  const { formattedStartDateTime, formattedEndDateTime } = Ecommonkey.Wildberries.getFormattedDateTimesParaPromo();
  const url = `${Urls.promoCalendar}?startDateTime=${formattedStartDateTime}&endDateTime=${formattedEndDateTime}&allPromo=false&limit=10&offset=0`;
  var options = {method: "get", headers: {"Authorization": apiKey}, muteHttpExceptions: true};
  var response = UrlFetchApp.fetch(url, options); Logger.log(response.getContentText());
  var jsonResponse = JSON.parse(response.getContentText());
  if (jsonResponse.data && jsonResponse.data.promotions) {Ecommonkey.Wildberries.writePromotionsToSheet(jsonResponse.data.promotions);}
  else {Logger.log("Нет акций для отображения.");}}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 📕 Список товаров для участия в акции
// Возвращает список товаров, подходящих для участия в акции. Неприменимо для автоакций
// Максимум 10 запросов за 6 секунд для всех методов Календаря акций на один аккаунт продавца

function get_promoArt() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_statistics';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promotionsSheet = ss.getSheetByName('📕 Список акций');
  const productsSheet = ss.getSheetByName('📕 Список товаров');
  const promotionsIDs = promotionsSheet.getRange("A2:A").getValues();
  Ecommonkey.Wildberries.processPromotions(promotionsIDs, productsSheet, apiKey);}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// 📕 Детальная информация по акциям
// Возвращает подробную информацию о выбранных акциях
// Максимум 10 запросов за 6 секунд для всех методов Календаря акций на один аккаунт продавца

function get_promoInfo() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId(); const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids); Ecommonkey.Wildberries.checkConnection(isConnected); // Проверяем соединение
  if (isConnected) {
  try {var status_kvo = 'emonkey_statistics';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const promotionsSheet = ss.getSheetByName('📕 Список акций');
  const promotionsIDs = promotionsSheet.getRange("A2:A").getValues();   // Получаем массив ID акций
  Ecommonkey.Wildberries.fetchPromotionsData(promotionsIDs, apiKey);}
    catch (error) {Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
    }
  }
}

// ####################################################################################################################################
// 🛡️ Функции для настройки и подключения API ключей
// ####################################################################################################################################

// Диалоговое окно для записи API ключей
function showApiKeyDialog() {
  var html = HtmlService.createHtmlOutputFromFile('ApiKeyDialog')
      .setWidth(400)
      .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Введите API ключ');}

// Функция добавляет API ключи из диалогового окна в свойства проекта
function setApiProperties(apiKeys) {
  var scriptProperties = PropertiesService.getScriptProperties();
  for (var key in apiKeys) {scriptProperties.setProperty(key, apiKeys[key]);}
  var liame = Session.getActiveUser().getEmail();scriptProperties.setProperty('Email', liame); return true;}

// Функция очищает свойства и удаляет все API ключи
function clearApiProperties() {
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert(
        'Подтверждение',
        'Вы уверены, что хотите удалить все данные по API?',
        ui.ButtonSet.YES_NO);

    if (response == ui.Button.YES) {
        var scriptProperties = PropertiesService.getScriptProperties();
        var properties = scriptProperties.getProperties();
        for (var key in properties) {scriptProperties.deleteProperty(key);}
        Logger.log("Все свойства успешно очищены.");
    } else { Logger.log("Удаление свойств отменено пользователем."); return; }
  }

// Функция создаёт статусную карту для объектов и выбора API ключа исходя из разрешений на чтение либо запись
function getAPIStatus(status_kvo) {
  // Получаем доступ к активному документу и нужному листу
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('⚙️ API');

  // Определим диапазон для чекбоксов и значений
  var checkboxesRange = sheet.getRange('C6:D17');
  var valuesRange = sheet.getRange('E6:E17');

  // Получаем массивы чекбоксов и значений
  var checkboxes = checkboxesRange.getValues();
  var values = valuesRange.getValues().flat(); // Преобразуем в одномерный массив

  // Находим индекс статуса в массиве
  var index = values.indexOf(status_kvo);
  if (index === -1) { throw new Error('Статус не найден');}

  // Получаем значения чекбоксов для соответствующего статуса
  var checkboxC = checkboxes[index][0]; // C-столбец
  var checkboxD = checkboxes[index][1]; // D-столбец

  // Определяем, какой ключ API использовать
  if (checkboxC && !checkboxD) {
    return PropertiesService.getScriptProperties().getProperty('API_KEY_1');
  } else if (!checkboxC && checkboxD) {
    return PropertiesService.getScriptProperties().getProperty('API_KEY_2');
  } else {throw new Error('Ошибка состояния чекбоксов');}
}

// ####################################################################################################################################
// ⏰  Updates - Функции для автоматического автообновления
// ####################################################################################################################################

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Юнит экономика и РК аналитика advanalytics(); transferDataUnits();
function unit_get_unit() {
  try {advanalytics(); Utilities.sleep(2000); transferDataUnits(); Utilities.sleep(2000);}
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_unit_get_unit() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');
    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'unit_get_unit') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('unit_get_unit')
    .timeBased().atHour(9).nearMinute(11).everyDays(1).create();
    sheet.appendRow([new Date(), 'Создан триггер unit_get_unit', userEmail]);}} // ⏰ 9:11

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 📦 Тарифы короба + 📦 Тарифы паллеты + 📦 Тарифы возвраты + 🪧 Комиссии + 📊 Коэффициенты
function tarrif_get_tariffs() {
  try {
    get_tariffsbox();Utilities.sleep(2000);
    get_tariffpallet();Utilities.sleep(2000);
    get_tariffreturn();Utilities.sleep(2000);
    get_commissions();Utilities.sleep(2000);
    get_coefficient();Utilities.sleep(2000);
  }
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_get_tariffs() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'tarrif_get_tariffs') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('tarrif_get_tariffs')
    .timeBased().atHour(4).nearMinute(30).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер tarrif_get_tariffs', userEmail]);}} // ⏰ 4:30

// ####################################################################################################################################
// 📦 Список складов + 📦 ID складов + 📦 Склад подробно 2
function stocks_get_stocksid() {
  try {get_stock_list(); Utilities.sleep(2000); stocksid_refresh(); Utilities.sleep(2000); get_stocks_warehouseIdV2();}
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_get_stocksID() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'stocks_get_stocksid') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('stocks_get_stocksid')
    .timeBased().atHour(4).nearMinute(35).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер stocks_get_stocksid', userEmail]);}} // ⏰ 4:35

// ####################################################################################################################################
// 🛄 Товары WB + 🛄 Товары + 🛄 Список товаров
function prod_sppProductDetails() {
  try {sppProductDetails(); Utilities.sleep(2000);}  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_prod_sppProductDetails() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'prod_sppProductDetails') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('prod_sppProductDetails')
    .timeBased().atHour(7).nearMinute(40).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер prod_sppProductDetails', userEmail]);}}  // ⏰ 7:40

// ####################################################################################################################################
// 🛍️ Воронка + 🛍️ Воронка по дням + 💳 Истории затрат РК
function stat_get_nmId() {
  try {get_nmId(); Utilities.sleep(2000); get_nmId_days(); Utilities.sleep(2000); get_advupd(); Utilities.sleep(2000);}
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_get_nmId() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'stat_get_nmId') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('stat_get_nmId')
    .timeBased().atHour(7).nearMinute(45).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер stat_get_nmId', userEmail]);}}  // ⏰ 7:45

// ####################################################################################################################################
// 🛒 Заказы
function stat_get_orders() {
  try {get_orders(); Utilities.sleep(2000);}
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_orders() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'stat_get_orders') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('stat_get_orders')
    .timeBased().atHour(7).nearMinute(50).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер stat_get_orders', userEmail]);}} // ⏰ 7:50

// ####################################################################################################################################
// 💳 Продажи
function stat_get_sales() {
  try {get_sales(); Utilities.sleep(2000);}
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_sales() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'stat_get_sales') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('stat_get_sales')
    .timeBased().atHour(7).nearMinute(50).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер stat_get_sales', userEmail]);}} // ⏰ 7:50

// ####################################################################################################################################
// 📝 Список РК + ✅ Статистика РК + 🗓 Позиции
function adverts_advList() {
  try {get_adverts(); Utilities.sleep(2000); get_advList(); Utilities.sleep(2000); get_adv_booster();}
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_adverts_advList() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'adverts_advList') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('adverts_advList')
    .timeBased().atHour(7).nearMinute(55).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер adverts_advList', userEmail]);}}  // ⏰ 7:55

// ####################################################################################################################################
// 🚧 Статистика РК + 🚧 Запросы + 🚧 Кластер
function full_stats_weeks() {
  try {get_advStats(); Utilities.sleep(2000);} // Запускаем не weeks а за 1 месяц
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_full_stats_weeks() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'full_stats_weeks') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('full_stats_weeks')
    .timeBased().atHour(8).nearMinute(00).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер full_stats_weeks', userEmail]);}}  // ⏰ 8:00

// ####################################################################################################################################
// 📦 Склад + 📦 Склад остатки
function stat_get_stocks() {
  try {get_stocks(); Utilities.sleep(2000); get_stocks_warehouseId(); Utilities.sleep(2000);}
  catch (e) { Logger.log('Ошибка при выполнении stat_get_stocks: ' + e.message);}}

function trigger_get_stocks() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'stat_get_stocks') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('stat_get_stocks')
    .timeBased().atHour(8).nearMinute(05).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер stat_get_stocks', userEmail]);}}  // ⏰ 8:05

// ####################################################################################################################################
// ####################################################################################################################################
// ▶️ Запустить все триггеры функция
function start_all_trigers() { // массив функций
  var scripts = [trigger_unit_get_unit, trigger_prod_sppProductDetails, trigger_get_nmId, trigger_orders,trigger_sales, trigger_adverts_advList, trigger_full_stats_weeks, trigger_get_stocks, trigger_get_tariffs, trigger_get_stocksID  ];
  for (var i = 0; i < scripts.length; i++) {scripts[i](); Utilities.sleep(500);}}

// ⛔ Удалить все триггеры функция
function deleteAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();   // Получаем все триггеры проекта
  for (var i = 0; i < triggers.length; i++) {ScriptApp.deleteTrigger(triggers[i]);}   // Удаляем каждый триггер
  Logger.log('Все триггеры были удалены');}

// Отправляем информацию об ошибках на почту
function executeWithErrorHandling(func) {try {func();} // Выполняем переданную функцию
  catch (error) {sendErrorReport(func.name, error);}} // Отправляем отчет об ошибке

function sendErrorReport(functionName, error, triggerName) {
  const emailAddress = PropertiesService.getScriptProperties().getProperty('Email');
  const subject = 'Ошибка в Google Apps Script';
  const message = `Произошла ошибка в функции: ${functionName}\n` +
                  `Время возникновения ошибки: ${new Date().toLocaleString()}\n` +
                  `Сообщение об ошибке: ${error.message}\n` +
                  `Наименование триггера: ${triggerName}`;
                   MailApp.sendEmail(emailAddress, subject, message);}


// ####################################################################################################################################
// ⏰ Auto Adverts 🤖🤖🤖 - Функции для автоматизации работы Робота
// ####################################################################################################################################

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🤖 Функция для автоматической оптимизации РК ///////////////////////////////////////////////////////////////////////////////////////
function autoAdvertUpdate() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('⚙️ Настройки');
  const dataRange = sheet.getRange('B9:B97').getValues();
  const checkboxRangeK = sheet.getRange('K9:K97');
  const checkboxesK = checkboxRangeK.getValues();
  const checkboxRangeE = sheet.getRange('E9:E97');
  const checkboxesE = checkboxRangeE.getValues();

  // Ищем первую ячейку с TRUE в K
  let firstTrueIndex = -1;
  for (let i = 0; i < checkboxesK.length; i++) {if (checkboxesK[i][0] === true) {firstTrueIndex = i;break;}}

  // Если нашли ячейку с TRUE в K
  if (firstTrueIndex !== -1) {
    const firstTrueRow = firstTrueIndex + 9; // Поскольку индексы массива начинаются с 0
    let foundNext = false;    // Флаг, чтобы проверить, удалось ли найти следующий заполненный элемент

    for (let i = firstTrueRow + 1; i <= 97; i++) {  // Ищем следующую строку с данными
      if (dataRange[i - 9][0] !== '') { // Убедимся, что строка B не пустая
        // Обновляем чекбокс K
        checkboxesK[firstTrueIndex][0] = false; // Убираем TRUE
        checkboxesK[i - 9][0] = true; // Ставим TRUE на следующей ячейке
        foundNext = true; break;}
    }

    if (!foundNext) { // Если не нашли заполненной строки, сбрасываем текущую TRUE
      checkboxesK[firstTrueIndex][0] = false; // Убираем TRUE
      checkboxesK[0][0] = true; // Устанавливаем TRUE в первой ячейке
    }

    // Обновляем диапазон чекбоксов K
    checkboxRangeK.setValues(checkboxesK); console.log("Смещаем чек-бокс в K."); Utilities.sleep(1000);
    Ecommonkey.Wildberries.updateCheckParaRecPolSettings(); console.log("Проверяем совпадение B9:B97 & M38:M97 ставим check в E"); Utilities.sleep(1000);
    // Ecommonkey.Wildberries.filterRoboCampaignsAuto(); // Фильтруем кампании для Робота 🤖🤖🤖 только со статусом Автоматическая
    // Utilities.sleep(1000);
    updateSettingsFromStatistics(); Utilities.sleep(1000); // Обновляет фото на главной
    // Проверяем пары чекбоксов E и K
    for (let i = 0; i < checkboxesE.length; i++) {
      const eChecked = checkboxesE[i][0]; // Значение чекбокса E
      const kChecked = checkboxesK[i][0]; // Значение чекбокса K

      if (eChecked && kChecked) {
        console.log(`Оба чекбокса E${i + 9} и K${i + 9} установлены. Вызываем оптимизацию Рекомендательных полок.`);
        updateWildberriesStatsRecPol();
      } else if (!eChecked && kChecked) {
        console.log(`Чекбокс K${i + 9} установлен, E${i + 9} не установлен. Вызываем оптимизацию CPC/CTR.`);
        updateWildberriesStats();
      } else {console.log(`Чекбоксы E${i + 9} и K${i + 9} не соответствуют условиям для вызова функций.`);}
    }
  }
}

// Запуск функций для стандартной оптимизации
function updateWildberriesStats() {
    console.log("Начинаем обновление статистики Wildberries.");
    Ecommonkey.Wildberries.updateSettingsFromStatistics();console.log("Меняем Фото."); Utilities.sleep(1000);
    get_stats_keywords_weeks(); console.log("Получаем Фразы и Показы."); Utilities.sleep(1000);
    get_words_clust(); console.log("Получаем кластеры."); Utilities.sleep(1000);
    Ecommonkey.Wildberries.updateCheckboxes_CpcCtr(); console.log("Выделяем чек-боксы CPC/CTR."); Utilities.sleep(3000);
    set_excludedRobo(); console.log("Удаляем выбранные минус слова."); Utilities.sleep(1000);
    Ecommonkey.Wildberries.uncheckCheckboxes(); console.log("Отключаем чек-боксы.");
    console.log("Обновление завершено.");
}

// Запуск функций для оптимизации Рекомендательных полок
function updateWildberriesStatsRecPol() {
    console.log("Начинаем обновление статистики Wildberries.");
    Ecommonkey.Wildberries.updateSettingsFromStatistics();console.log("Меняем Фото."); Utilities.sleep(1000);
    get_stats_keywords_weeks(); console.log("Получаем Фразы и Показы."); Utilities.sleep(1000);
    get_words_clust(); console.log("Получаем кластеры."); Utilities.sleep(1000);
    Ecommonkey.Wildberries.updateCheckboxesRecPol(); console.log("Выделяем чек-боксы для Рекомендательных полок");
    Utilities.sleep(3000);
    set_excludedRobo(); console.log("Удаляем выбранные минус слова."); Utilities.sleep(1000);
    Ecommonkey.Wildberries.uncheckCheckboxes(); console.log("Отключаем чек-боксы.");
    console.log("Обновление завершено.");
}

// Минус фразы для Робота 🤖🤖🤖 Автоматическая кампания *************************************
function set_excludedRobo() {
  setexcludedFormulas();
  var status_kvo = 'emonkey_advert';
  var apiKey = getAPIStatus(status_kvo); Logger.log('Используемый API Key: ' + apiKey);
  var credentials = Ecommonkey.Wildberries.getCampaignId(); if (!credentials) return;
  var campaignId = credentials.campaignId;
  const Urls = Ecommonkey.Wildberries.getlinks(); const apiUrl = `${Urls.advsetexcluded}${campaignId}`;
  Ecommonkey.Wildberries.sendExcludedPhrasesRobo(apiUrl, apiKey); }


// ####################################################################################################################################
// ####################################################################################################################################
// 🤖 Создать триггер для выполнения функции каждые 5 минут Триггер из Меню

function createAutoAdvertTrigger() {
  const userEmail = Session.getActiveUser().getEmail();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

  ScriptApp.newTrigger('autoAdvertUpdate') .timeBased(). everyMinutes(5) .create(); sheet.appendRow([new Date(), 'Создан триггер autoAdvertUpdate', userEmail]); // ⏰ 5 min
  try {  // Вывод сообщения пользователю в диалоговом окне
  SpreadsheetApp.getUi().alert('🤖 Вы успешно включили 🚀 Автоматическую оптимизацию РК, каждые 5 минут робот будет обходить рекламные кампании и оптимизировать ключевые запросы');} catch (error) {
  Logger.log('Не могу вывести диалоговое окно для 🤖 Робота, скрипт запущен');}} // Если произошла ошибка, логируем сообщение для 🤖

// ####################################################################################################################################
// 🤖 Удалить триггер автоматической оптимизации РК функция из Меню

function deleteAutoAdvertTrigger() {
    const triggers = ScriptApp.getProjectTriggers();  // Получаем все триггеры проекта
    for (const trigger of triggers) { // Перебираем триггеры и ищем нужный
        if (trigger.getHandlerFunction() === 'autoAdvertUpdate') {  // Проверяем, соответствует ли триггер имени функции
            ScriptApp.deleteTrigger(trigger);
            Logger.log('Триггер autoAdvertUpdate был удален.');
            // SpreadsheetApp.getUi().alert('🤖 Вы успешно ⛔ отключили 🚀 Автоматическую оптимизацию РК');
            return; // Завершаем функцию после удаления триггера
        }}
    Logger.log('Триггер autoAdvertUpdate не найден.');} // Вывод сообщения пользователю
    // SpreadsheetApp.getUi().alert('🤖 Триггер autoAdvertUpdate не найден.');


// ####################################################################################################################################
// Удалить робота для основных обновлений в ⏰ 3:00 и запустить автообновления deleteAutoAdvertTrigger + start_all_trigers

function auto_robo_stop() { deleteAutoAdvertTrigger(); Utilities.sleep(2000); start_all_trigers(); }
function trigger_auto_robo_stop() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'auto_robo_stop') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('auto_robo_stop')
    .timeBased().atHour(3).nearMinute(00).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер auto_robo_stop', userEmail]);}}  // ⏰ 3:00

// ####################################################################################################################################
// Запустить робота в ⏰ 9:00 createAutoAdvertTrigger
function auto_robo_start() {createAutoAdvertTrigger();}
function trigger_auto_robo_start() {
    const userEmail = Session.getActiveUser().getEmail();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Logs');

    const triggers = ScriptApp.getProjectTriggers(); let triggerExists = false;
    for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'auto_robo_start') {triggerExists = true; break;}}
    if (!triggerExists) {ScriptApp.newTrigger('auto_robo_start')
    .timeBased().atHour(23).nearMinute(05).everyDays(1).create(); sheet.appendRow([new Date(), 'Создан триггер auto_robo_start', userEmail]);}}  // ⏰ 9:05


/**
 * {@link https://developer.mozilla.org/ru/docs/Web/HTTP/Status Расшифровка кодов ответа (состояния) HTTP}
 **/
const ResponseCodesHTTP = Object.freeze({
  SUCCESS: Object.freeze({
    200: "200 OK («хорошо»)",
    201: "201 Created («создано»)",
    202: "202 Accepted («принято»)",
    203: "203 Non-Authoritative Information («информация не авторитетна»)",
    204: "204 No Content («нет содержимого»)",
    205: "205 Reset Content («сбросить содержимое»)",
    206: "206 Partial Content («частичное содержимое»)",
    207: "207 Multi-Status («многостатусный»)",
    208: "208 Already Reported («уже сообщалось»)",
    226: "226 IM Used («использовано IM»)",
  }),
  OTHERCODES: Object.freeze({
    100: "100 Continue («продолжай»)",
    101: "101 Switching Protocols («переключение протоколов»)",
    102: "102 Processing («идёт обработка»);",
    103: "103 Early Hints («ранняя метаинформация»)",
    300: "300 Multiple Choices («множество выборов»)",
    301: "301 Moved Permanently («перемещено навсегда»)",
    302: "302 Moved Temporarily («перемещено временно»)",
    303: "303 See Other («смотреть другое»)",
    304: "304 Not Modified («не изменялось»)",
    305: "305 Use Proxy («использовать прокси»)",
    306: "306 - зарезервировано (код использовался только в ранних спецификациях)",
    307: "307 Temporary Redirect («временное перенаправление»)",
    308: "308 Permanent Redirect («постоянное перенаправление»)",
    400: "400 Bad Request («неправильный, некорректный запрос»)",
    401: "401 Unauthorized («не авторизован (не представился)»)",
    402: "402 Payment Required («необходима оплата»)",
    403: "403 Forbidden («запрещено (не уполномочен)»)",
    404: "404 Not Found («не найдено»)",
    405: "405 Method Not Allowed («метод не поддерживается»)",
    406: "406 Not Acceptable («неприемлемо»)",
    407: "407 Proxy Authentication Required («необходима аутентификация прокси»)",
    408: "408 Request Timeout («истекло время ожидания»)",
    409: "409 Conflict («конфликт»)",
    410: "410 Gone («удалён»)",
    411: "411 Length Required («необходима длина»)",
    412: "412 Precondition Failed («условие ложно»)",
    413: "413 Payload Too Large («полезная нагрузка слишком велика»)",
    414: "414 URI Too Long («URI слишком длинный»)",
    415: "415 Unsupported Media Type («неподдерживаемый тип данных»)",
    416: "416 Range Not Satisfiable («диапазон не достижим»)",
    417: "417 Expectation Failed («ожидание не удалось»)",
    418: "418 I’m a teapot («я — чайник»)",
    419: "419 Authentication Timeout (not in RFC 2616) («обычно ошибка проверки CSRF»)",
    421: "421 Misdirected Request",
    422: "422 Unprocessable Entity («необрабатываемый экземпляр»)",
    423: "423 Locked («заблокировано»);",
    424: "424 Failed Dependency («невыполненная зависимость»)",
    425: "425 Too Early («слишком рано»);",
    426: "426 Upgrade Required («необходимо обновление»)",
    428: "428 Precondition Required («необходимо предусловие»)",
    429: "429 Too Many Requests («слишком много запросов»)",
    431: "431 Request Header Fields Too Large («поля заголовка запроса слишком большие»)",
    449: "449 Retry With («повторить с»)",
    451: "451 Unavailable For Legal Reasons («недоступно по юридическим причинам»)",
    499: "499 Client Closed Request (клиент закрыл соединение)",
    500: "500 Internal Server Error («внутренняя ошибка сервера»)",
    501: "501 Not Implemented («не реализовано»)",
    502: "502 Bad Gateway («плохой, ошибочный шлюз»)",
    503: "503 Service Unavailable («сервис недоступен»)",
    504: "504 Gateway Timeout («шлюз не отвечает»)",
    505: "505 HTTP Version Not Supported («версия HTTP не поддерживается»)",
    506: "506 Variant Also Negotiates («вариант тоже проводит согласование»)",
    507: "507 Insufficient Storage («переполнение хранилища»);",
    508: "508 Loop Detected («обнаружено бесконечное перенаправление»)",
    509: "509 Bandwidth Limit Exceeded («исчерпана пропускная ширина канала»)",
    510: "510 Not Extended («не расширено»)",
    511: "511 Network Authentication Required («требуется сетевая аутентификация»)",
    520: "520 Unknown Error («неизвестная ошибка»)",
    521: "521 Web Server Is Down («веб-сервер не работает»)",
    522: "522 Connection Timed Out («соединение не отвечает»)",
    523: "523 Origin Is Unreachable («источник недоступен»)",
    524: "524 A Timeout Occurred («время ожидания истекло»)",
    525: "525 SSL Handshake Failed («квитирование SSL не удалось»)",
    526: "526 Invalid SSL Certificate («недействительный сертификат SSL»)",
  }),

  message: function (code) {
    for (const category in this) {
      if (this[category][code]) {
        return this[category][code];
      }
    }
    return `Unknown code: ${code}`;
  },
});

// Функция для 💎 Выкупа % через продажи и заказы по размерам
function runOrdersSalesPercent() {
  get_orders(); Utilities.sleep(2000);
  get_sales(); Utilities.sleep(5000);
  Ecommonkey.Wildberries.aggregateSales();
}

function runRun(){ Ecommonkey.Wildberries.aggregateSales(); }

/*/ /*/
/*/ /*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Смотрим какие триггеры установлены
function showTriggersDialog() {
  var triggers = ScriptApp.getProjectTriggers();

  function getTriggerType(trigger) {
    if (trigger.getEventType() === ScriptApp.EventType.CLOCK) {
      return "Time-driven";
    } else if (trigger.getEventType() === ScriptApp.EventType.EDIT) {
      return "On edit";
    } else if (trigger.getEventType() === ScriptApp.EventType.OPEN) {
      return "On open";
    } else {
      return "Другой";
    }
  }

  function getTriggerSchedule(trigger) {
    if (trigger.getEventType() === ScriptApp.EventType.CLOCK) {
      return "Временной триггер";
    } else {
      return "Нет расписания";
    }
  }

  var triggersData = triggers.map(function(trigger, index) {
    return {
      id: trigger.getUniqueId(),
      functionName: trigger.getHandlerFunction(),
      typeName: getTriggerType(trigger),
      schedule: getTriggerSchedule(trigger)
    };
  });

  var htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #363c49;
            color: #f3f3f3;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #49505f;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #49505f;
            color: #67ffbf;
          }
          tr:nth-child(even) {
            background-color: #49505f;
          }
          input[type="checkbox"] {
            transform: scale(1.2);
          }
          button {
            background-color: #67ffbf;
            color: #363c49;
            font-weight: bold;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            border-radius: 4px;
          }
          button:hover {
            background-color: #52e6a9;
          }
        </style>
      </head>
      <body>
        <h2>Активные триггеры</h2>
        <form id="triggerForm">
          <table>
            <thead>
              <tr>
                <th>✓</th>
                <th>#</th>
                <th>Функция</th>
                <th>Тип триггера</th>
                <th>Расписание</th>
              </tr>
            </thead>
            <tbody id="triggerTableBody"></tbody>
          </table>
          <button type="button" onclick="deleteSelected()">Удалить выбранные</button>
        </form>

        <script>
          let triggers = ${JSON.stringify(triggersData)};
          const tbody = document.getElementById("triggerTableBody");

          function renderTable() {
            tbody.innerHTML = '';
            triggers.forEach(function(trigger, i) {
              const row = document.createElement("tr");
              row.innerHTML = \`
                <td><input type="checkbox" name="triggerCheckbox" value="\${trigger.id}"></td>
                <td>\${i + 1}</td>
                <td>\${trigger.functionName}</td>
                <td>\${trigger.typeName}</td>
                <td>\${trigger.schedule}</td>
              \`;
              tbody.appendChild(row);
            });
          }

          function deleteSelected() {
            const checkboxes = document.querySelectorAll('input[name="triggerCheckbox"]:checked');
            const ids = Array.from(checkboxes).map(cb => cb.value);
            if (ids.length === 0) {
              alert("Выберите хотя бы один триггер для удаления.");
              return;
            }

            if (confirm("Удалить выбранные триггеры?")) {
              google.script.run.withSuccessHandler((newTriggers) => {
                alert("Выбранные триггеры успешно удалены.");
                triggers = newTriggers;
                renderTable();
              }).deleteTriggersByIds(ids);
            }
          }

          renderTable();
        </script>
      </body>
    </html>
  `;

  var html = HtmlService.createHtmlOutput(htmlContent).setWidth(1000).setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, "Действующие триггеры");
}

// Удаляем триггеры из диалогового окна
function deleteTriggersByIds(ids) {
  const allTriggers = ScriptApp.getProjectTriggers();
  ids.forEach(id => {
    const trigger = allTriggers.find(t => t.getUniqueId() === id);
    if (trigger) ScriptApp.deleteTrigger(trigger);
  });
  return getTriggersList(); // вернуть новый список
}

// Получаем список триггеров
function getTriggersList() {
  function getTriggerType(trigger) {
    if (trigger.getEventType() === ScriptApp.EventType.CLOCK) return "Time-driven";
    if (trigger.getEventType() === ScriptApp.EventType.EDIT) return "On edit";
    if (trigger.getEventType() === ScriptApp.EventType.OPEN) return "On open";
    return "Другой";
  }

  function getTriggerSchedule(trigger) {
    if (trigger.getEventType() === ScriptApp.EventType.CLOCK) return "Временной триггер";
    return "Нет расписания";
  }

  return ScriptApp.getProjectTriggers().map(trigger => ({
    id: trigger.getUniqueId(),
    functionName: trigger.getHandlerFunction(),
    typeName: getTriggerType(trigger),
    schedule: getTriggerSchedule(trigger),
  }));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Заказы и позиции по поисковым запросам товара

function get_searchReport() {
  const ids = SpreadsheetApp.getActiveSpreadsheet().getId();
  const seePro = Ecommonkey.Wildberries.isConnected();
  const isConnected = seePro.includes(ids);
  Ecommonkey.Wildberries.checkConnection(isConnected);

  if (!isConnected) {
    Logger.log("Подключение не активно. Запрос не отправлен.");
    return;
  }

  const statusKvo = 'emonkey_statistics';
  const apiKey = getAPIStatus(statusKvo);
  Logger.log('Используемый API Key: ' + apiKey);

  const Urls = Ecommonkey.Wildberries.getlinks();
  const url = Urls.searchreport;

  try {
    const sheetSettings = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('⚙️ Настройки');
    const dateFrom = sheetSettings.getRange('AQ31').getValue();
    const dateTo = sheetSettings.getRange('AR31').getValue();
    const nmId = Number(sheetSettings.getRange('O30').getValue());

    const allSearchTexts = sheetSettings.getRange('U6:U').getValues()
      .flat()
      .filter(val => val && val.toString().trim() !== "");

    const chunkSize = 30;
    const maxChunks = 10; // максимум 10 запросов к API (300 searchTexts)
    const delayMs = 25000; // 25 секунд задержки между запросами

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('🔥 Заказы и позиции по запросам');
    sheet.clearContents();

    // Заголовки
    let rows = [];
    rows.push(["Тип", "Дата", "Поисковый запрос", "Средняя позиция", "Количество заказов", "Частота"]);
    sheet.getRange(1, 1, 1, rows[0].length).setValues(rows);

    let writeRowIndex = 2; // строка для записи данных (после заголовков)

    for (let i = 0; i < maxChunks; i++) {
      let chunk = allSearchTexts.slice(i * chunkSize, i * chunkSize + chunkSize);
      if (chunk.length === 0) {
        Logger.log("Данные для запроса закончились на итерации " + i);
        break;
      }

      const payload = {
        period: {
          start: Utilities.formatDate(new Date(dateFrom), Session.getScriptTimeZone(), "yyyy-MM-dd"),
          end: Utilities.formatDate(new Date(dateTo), Session.getScriptTimeZone(), "yyyy-MM-dd")
        },
        nmId: nmId,
        searchTexts: chunk
      };

      Logger.log("Отправка запроса номер " + (i + 1) + " с поисковыми текстами: " + chunk.join(", "));

      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        headers: {
          Authorization: apiKey
        },
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(url, options);
      const code = response.getResponseCode();

      if (code !== 200) {
        Logger.log("Ошибка от WB на запросе " + (i + 1) + ": " + response.getContentText());
        SpreadsheetApp.getUi().alert("Ошибка при получении данных от Wildberries: " + response.getContentText());
        break;
      }

      const json = JSON.parse(response.getContentText());
      const data = json.data;

      let chunkRows = [];

      // Итоговые значения по всему товару
      if (data.total && Array.isArray(data.total)) {
        data.total.forEach(item => {
          chunkRows.push(["Итого", item.dt, "", item.avgPosition, item.orders, ""]);
        });
      }

      // Детализация по поисковым запросам
      if (data.items && Array.isArray(data.items)) {
        data.items.forEach(entry => {
          entry.dateItems.forEach(di => {
            chunkRows.push(["Поисковый запрос", di.dt, entry.text, di.avgPosition, di.orders, entry.frequency]);
          });
        });
      }

      if (chunkRows.length > 0) {
        sheet.getRange(writeRowIndex, 1, chunkRows.length, chunkRows[0].length).setValues(chunkRows);
        writeRowIndex += chunkRows.length;
      }

      // Задержка между запросами, кроме последнего
      if (i < maxChunks - 1) {
        Logger.log("Ждем " + (delayMs / 1000) + " секунд перед следующим запросом...");
        Utilities.sleep(delayMs);
      }
    }

    Logger.log("Запросы завершены.");

  } catch (error) {
    Logger.log('Ошибка при выполнении: ' + error);
    SpreadsheetApp.getUi().alert('Ошибка при получении данных: ' + error.message);
  }
}
