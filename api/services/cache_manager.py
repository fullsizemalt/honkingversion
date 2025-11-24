import json
import os
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

class CacheManager:
    """
    Simple file-based cache manager for storing API responses.
    """
    
    def __init__(self, cache_dir: str = "api/data/cache"):
        self.cache_dir = Path(cache_dir)
        self._ensure_cache_dir()
        
    def _ensure_cache_dir(self):
        """Ensure the cache directory exists."""
        if not self.cache_dir.exists():
            try:
                self.cache_dir.mkdir(parents=True, exist_ok=True)
                logger.info(f"Created cache directory at {self.cache_dir}")
            except Exception as e:
                logger.error(f"Failed to create cache directory: {e}")

    def _get_file_path(self, key: str) -> Path:
        """Get the file path for a given key."""
        # Sanitize key to be safe for filenames
        safe_key = "".join(c for c in key if c.isalnum() or c in ('-', '_', '.'))
        return self.cache_dir / f"{safe_key}.json"

    def get(self, key: str):
        """
        Retrieve data from cache.
        
        Args:
            key: The cache key.
            
        Returns:
            The cached data (dict/list) or None if not found/error.
        """
        file_path = self._get_file_path(key)
        
        if not file_path.exists():
            return None
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                logger.debug(f"Cache hit for key: {key}")
                return data
        except Exception as e:
            logger.warning(f"Failed to read cache for key {key}: {e}")
            return None

    def set(self, key: str, data):
        """
        Save data to cache.
        
        Args:
            key: The cache key.
            data: The data to cache (must be JSON serializable).
        """
        file_path = self._get_file_path(key)
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
                logger.debug(f"Cached data for key: {key}")
        except Exception as e:
            logger.error(f"Failed to write cache for key {key}: {e}")
