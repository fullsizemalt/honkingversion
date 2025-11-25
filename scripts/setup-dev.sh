#!/bin/bash
# Setup development environment
# This script sets up a clean dev environment with proper dependencies

set -e

echo "🚀 Setting up development environment..."

# Create scripts directory if it doesn't exist
mkdir -p "$(dirname "$0")"

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Clean up old venv if it exists
if [ -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Removing old venv...${NC}"
    rm -rf venv
fi

# 2. Create fresh venv
echo -e "${BLUE}📦 Creating virtual environment...${NC}"
python3 -m venv venv

# 3. Activate venv and upgrade pip
echo -e "${BLUE}📦 Upgrading pip...${NC}"
source venv/bin/activate
pip install --upgrade pip setuptools wheel

# 4. Install API dependencies
echo -e "${BLUE}📦 Installing API dependencies...${NC}"
pip install -r api/requirements.txt

# 5. Clean up databases
echo -e "${YELLOW}🧹 Cleaning test databases and caches...${NC}"
rm -f api/database.db api/test_db.db api/database.seedtest.db database.db
rm -rf api/data/cache/ .cache/

echo ""
echo -e "${GREEN}✓ Development environment setup complete!${NC}"
echo ""
echo "To activate the environment, run:"
echo -e "  ${BLUE}source venv/bin/activate${NC}"
echo ""
echo "To populate the database with seed data, run:"
echo -e "  ${BLUE}python api/seed_from_elgoose.py --limit 100${NC}"
echo ""
echo "To run tests, run:"
echo -e "  ${BLUE}pytest api/tests/${NC}"
