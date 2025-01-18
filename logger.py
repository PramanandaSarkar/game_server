import logging
import os

class Logger:
    def __init__(self, log_path: str = "logs/app.log"):
        if not os.path.exists("logs"):
            os.makedirs("logs")
        logging.basicConfig(
            filename=log_path,
            level=logging.INFO,
            format="%(asctime)s - %(message)s",
        )
        self.logger = logging.getLogger()

    def log(self, message: str):
        self.logger.info(message)

    def error(self, message: str):
        self.logger.error(message)

    def warning(self, message: str):
        self.logger.warning(message)
