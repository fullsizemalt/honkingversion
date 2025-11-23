#!/bin/bash

# Reverse merge script: Copy improvements from hv3 to honkingversion
# Run from honkingversion directory

set -e

HV3_DIR="/Users/ten/ANTIGRAVITY/hv3"
CURRENT_DIR="/Users/ten/ANTIGRAVITY/honkingversion"

echo "🔄 Copying improvements from hv3 to honkingversion..."

# Step 1: Copy centralized API handling
echo "📦 Copying centralized API utilities..."
cp "$HV3_DIR/web/src/lib/api.ts" "$CURRENT_DIR/web/src/lib/api.ts"

# Step 2: Copy documentation
echo "📦 Copying documentation..."
if [ -f "$HV3_DIR/API_USAGE_POLICY.md" ]; then
    cp "$HV3_DIR/API_USAGE_POLICY.md" "$CURRENT_DIR/API_USAGE_POLICY.md"
fi

# Step 3: Copy bulk scraper
echo "📦 Copying bulk scraper..."
if [ -f "$HV3_DIR/api/seed_from_elgoose.py" ]; then
    cp "$HV3_DIR/api/seed_from_elgoose.py" "$CURRENT_DIR/api/seed_from_elgoose.py"
fi

# Step 4: Copy on-demand show fetcher
echo "📦 Copying show fetcher service..."
if [ -f "$HV3_DIR/api/services/show_fetcher.py" ]; then
    mkdir -p "$CURRENT_DIR/api/services"
    cp "$HV3_DIR/api/services/show_fetcher.py" "$CURRENT_DIR/api/services/show_fetcher.py"
fi

# Step 5: Update profile pages to use centralized API
echo "🔧 Updating profile pages to use getApiUrl()..."

# Update profile/page.tsx
sed -i '' "s|'http://localhost:8000/users/me'|getApiUrl('/users/me')|g" "$CURRENT_DIR/web/src/app/profile/page.tsx"
sed -i '' "s|\`http://localhost:8000/votes/user/\${userData.username}\`|getApiUrl(\`/votes/user/\${userData.username}\`)|g" "$CURRENT_DIR/web/src/app/profile/page.tsx"

# Add import if not present
if ! grep -q "import.*getApiUrl" "$CURRENT_DIR/web/src/app/profile/page.tsx"; then
    sed -i '' "1i\\
import { getApiUrl } from '@/lib/api';\\
" "$CURRENT_DIR/web/src/app/profile/page.tsx"
fi

# Update u/[username]/page.tsx
sed -i '' "s|\`http://localhost:8000/users/\${username}\`|getApiUrl(\`/users/\${username}\`)|g" "$CURRENT_DIR/web/src/app/u/[username]/page.tsx"
sed -i '' "s|\`http://localhost:8000/votes/user/\${username}\`|getApiUrl(\`/votes/user/\${username}\`)|g" "$CURRENT_DIR/web/src/app/u/[username]/page.tsx"

# Add import if not present
if ! grep -q "import.*getApiUrl" "$CURRENT_DIR/web/src/app/u/[username]/page.tsx"; then
    sed -i '' "4i\\
import { getApiUrl } from '@/lib/api';\\
" "$CURRENT_DIR/web/src/app/u/[username]/page.tsx"
fi

echo "✅ Merge complete!"
echo ""
echo "Next steps:"
echo "1. git status (review changes)"
echo "2. git add ."
echo "3. git commit -m 'feat: Add centralized API handling and documentation from hv3'"
echo "4. npm run build (in web directory to verify)"
