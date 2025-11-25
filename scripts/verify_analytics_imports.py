import sys
import os

# Add the current directory to sys.path so we can import api
sys.path.append(os.getcwd())

try:
    from api.main import app
    print("Successfully imported api.main.app")
except Exception as e:
    print(f"Failed to import api.main.app: {e}")
    sys.exit(1)
