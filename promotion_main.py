import time
from promotion_metrics_tracking import main as track_metrics
from promotion_automation import main as automate_promotion
import logging
import os

def main():
    """Главная точка входа приложения."""
    log_file_path = 'promotion_logs.txt'
    # Настраиваем базовое логирование
    logging.basicConfig(
        filename=log_file_path,
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s',
        filemode='a' # 'a' - добавлять в конец, 'w' - перезаписывать при каждом запуске
    )

    logging.info("--- Запуск MCP сервера ---")
    print("MCP сервер запущен.")

    try:
        # Шаг 1: Отслеживание метрик
        print("\n--- Запуск отслеживания метрик ---")
        track_metrics()

        # Шаг 2: Автоматизация ставок
        print("\n--- Запуск автоматизации ставок ---")
        automate_promotion()

        print("\n--- MCP сервер завершил работу ---")
        logging.info("--- MCP сервер завершил работу ---")

    except Exception as e:
        logging.error(f"Критическая ошибка в главном модуле: {str(e)}", exc_info=True)
        print(f"\nПроизошла критическая ошибка: {str(e)}")

if __name__ == "__main__":
    main()