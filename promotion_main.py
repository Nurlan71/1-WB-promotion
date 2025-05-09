import logging
import os
import time # time здесь не используется напрямую, но может быть полезен для других целей

# --- НАСТРОЙКА ЛОГГИРОВАНИЯ САМЫМ ПЕРВЫМ ДЕЙСТВИЕМ ---
# Это гарантирует, что конфигурация будет применена до импорта других ваших модулей,
# которые могут использовать logging.getLogger() на уровне модуля.
LOG_FILENAME = 'app_debug.log' # Новое имя для теста
try:
    # Попробуем удалить старый лог-файл перед запуском для чистоты эксперимента
    if os.path.exists(LOG_FILENAME):
        os.remove(LOG_FILENAME)
except OSError as e:
    print(f"Warning: Could not remove old log file {LOG_FILENAME}: {e}")

logging.basicConfig(
    filename=LOG_FILENAME,
    level=logging.INFO, # Оставляем INFO, можно временно поставить DEBUG для большей детализации
    format='%(asctime)s - %(levelname)s - [%(threadName)s] - %(filename)s:%(lineno)d - %(message)s', # Добавил threadName для отладки если понадобится
    filemode='w' # 'w' - перезаписывать при каждом запуске для чистоты теста. Позже можно вернуть 'a'.
)
# --- КОНЕЦ НАСТРОЙКИ ЛОГГИРОВАНИЯ ---

# Теперь импортируем остальные модули
from promotion_metrics_tracking import main as track_metrics
from promotion_automation import main as automate_promotion

def main_orchestrator(): # Переименовал, чтобы не конфликтовать с main из других модулей при возможном импорте
    """Главная точка входа приложения."""
    
    logging.info("--- Запуск MCP сервера ---")
    print("MCP сервер запущен.")

    # Добавим тестовое сообщение в лог сразу после настройки
    logger_main = logging.getLogger(__name__)
    logger_main.info("Тестовое сообщение из promotion_main.py после настройки basicConfig.")


    try:
        # Шаг 1: Отслеживание метрик
        print("\n--- Запуск отслеживания метрик ---")
        logger_main.info("Вызов track_metrics()")
        track_metrics()
        logger_main.info("track_metrics() завершен.")

        # Шаг 2: Автоматизация ставок
        print("\n--- Запуск автоматизации ставок ---")
        logger_main.info("Вызов automate_promotion()")
        automate_promotion()
        logger_main.info("automate_promotion() завершен.")

        print("\n--- MCP сервер завершил работу ---")
        logging.info("--- MCP сервер завершил работу (успешно) ---")

    except KeyboardInterrupt:
        logging.warning("--- MCP сервер прерван пользователем (KeyboardInterrupt) ---")
        print("\n--- MCP сервер прерван пользователем ---")
    except Exception as e:
        logging.error(f"Критическая ошибка в главном модуле: {str(e)}", exc_info=True)
        print(f"\nПроизошла критическая ошибка: {str(e)}")
    finally:
        logging.info("--- MCP сервер: блок finally - вызов logging.shutdown() ---")
        logging.shutdown() # Принудительно закрываем все обработчики логов
        print("--- MCP сервер: логгирование завершено (shutdown) ---")

if __name__ == "__main__":
    main_orchestrator() # Вызываем переименованную функцию