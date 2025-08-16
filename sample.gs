// Процент выкупа
function get_percent(){
  sumValuesVikup();
  sumValuesVozvrat();
}

function sumValuesVikup() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('%%'); // Получаем лист '%%'

  // Получаем диапазоны данных
  const aritkuls = sheet.getRange("A2:A").getValues();
  const eValues = sheet.getRange("E2:E").getValues();
  const sizesA = sheet.getRange("C2:C").getValues();
  const repeatAritkuls = sheet.getRange("H2:H").getValues();
  const sizesH = sheet.getRange("J2:J").getValues();

  // Создаем объект для хранения сумм
  const sums = {};

  // Проходим по исходным артикулом и суммируем значения
  for (let i = 0; i < aritkuls.length; i++) {
    const article = aritkuls[i][0];
    const size = sizesA[i][0];
    const value = eValues[i][0];

    if (article && size !== "") {
      const key = article + "|" + size; // Создаем уникальный ключ для артикула и размера
      if (!sums[key]) {
        sums[key] = 0;
      }
      sums[key] += value; // Суммируем значения
    }
  }

  // Массив для записей результатов
  const results = [];

  // Проходим по повторяющимся артикулом и размерам
  for (let j = 0; j < repeatAritkuls.length; j++) {
    const article = repeatAritkuls[j][0];
    const size = sizesH[j][0];

    const key = article + "|" + size;
    const sumValue = sums[key] || 0; // Получаем сумму или 0, если такой ключ нет
    results.push([sumValue]);
  }

  // Записываем результаты в диапазон K2:K на листе '%%'
  sheet.getRange(2, 11, results.length, 1).setValues(results); // 11 - это номер колонки M
}

function sumValuesVozvrat() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('%%'); // Получаем лист '%%'

  // Получаем диапазоны данных
  const aritkuls = sheet.getRange("A2:A").getValues();
  const eValues = sheet.getRange("F2:F").getValues();
  const sizesA = sheet.getRange("C2:C").getValues();
  const repeatAritkuls = sheet.getRange("H2:H").getValues();
  const sizesH = sheet.getRange("J2:J").getValues();

  // Создаем объект для хранения сумм
  const sums = {};

  // Проходим по исходным артикулом и суммируем значения
  for (let i = 0; i < aritkuls.length; i++) {
    const article = aritkuls[i][0];
    const size = sizesA[i][0];
    const value = eValues[i][0];

    if (article && size !== "") {
      const key = article + "|" + size; // Создаем уникальный ключ для артикула и размера
      if (!sums[key]) {
        sums[key] = 0;
      }
      sums[key] += value; // Суммируем значения
    }
  }

  // Массив для записей результатов
  const results = [];

  // Проходим по повторяющимся артикулом и размерам
  for (let j = 0; j < repeatAritkuls.length; j++) {
    const article = repeatAritkuls[j][0];
    const size = sizesH[j][0];

    const key = article + "|" + size;
    const sumValue = sums[key] || 0; // Получаем сумму или 0, если такой ключ нет
    results.push([sumValue]);
  }

  // Записываем результаты в диапазон L2:L на листе '%%'
  sheet.getRange(2, 12, results.length, 1).setValues(results); // 12 - это номер колонки M
}
