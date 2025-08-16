function showChart() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('🛍️ Подсорт');
  const articles = sheet.getRange('C3:C').getValues().flat().filter(article => article); // Фильтруем пустые значения
  const dates = sheet.getRange('M2:Z2').getValues()[0].map(date => new Date(date).toLocaleDateString('ru-RU', { weekday: 'short', month: 'short', day: 'numeric' }));

  const htmlOutput = HtmlService.createHtmlOutputFromFile('statdata')
      .setWidth(850)
      .setHeight(550);

  // Устанавливаем значения в качестве скрипт-параметров
  htmlOutput.addMetaTag('viewport', 'width=device-width, initial-scale=1');
  htmlOutput.append(
    `<script>
      google.script.host.articles = ${JSON.stringify(articles)};
      google.script.host.dates = ${JSON.stringify(dates)};
    </script>`
  );

  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Динамика заказов / сравнение периодов');
}

function getArticleData(article) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('🛍️ Подсорт');
  const articles = sheet.getRange('C3:C').getValues().flat();
  const rowIndex = articles.indexOf(article) + 3; // Находим индекс строки артикула
  const rangeValues = sheet.getRange(`M${rowIndex}:Z${rowIndex}`).getValues()[0];
  const values = rangeValues.map(Number); // Преобразуем значения в числа

  return values;
}
