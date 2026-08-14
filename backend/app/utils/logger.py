"""
Logging configuration for the Company Research & Outreach Agent.
"""

import logging


def get_logger(name: str) -> logging.Logger:
    """
    Create and return a configured logger.
    """

    logger = logging.getLogger(name)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = logging.Formatter(
            "%(levelname)s | %(name)s | %(message)s"
        )

        handler.setFormatter(formatter)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)

    return logger