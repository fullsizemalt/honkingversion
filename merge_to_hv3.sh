#!/bin/bash

# Merge script: Copy backend improvements from honkingversion to hv3
# Run from honkingversion directory

set -e

HV3_DIR="/Users/ten/ANTIGRAVITY/hv3"
CURRENT_DIR="/Users/ten/ANTIGRAVITY/honkingversion"

echo "🔄 Merging backend improvements to hv3..."

# Step 1: Copy updated backend files
echo "📦 Copying backend models and routes..."
cp "$CURRENT_DIR/api/models.py" "$HV3_DIR/api/models.py"
cp "$CURRENT_DIR/api/routes/users.py" "$HV3_DIR/api/routes/users.py"
cp "$CURRENT_DIR/api/routes/votes.py" "$HV3_DIR/api/routes/votes.py"
cp "$CURRENT_DIR/api/routes/lists.py" "$HV3_DIR/api/routes/lists.py"
cp "$CURRENT_DIR/api/routes/tags.py" "$HV3_DIR/api/routes/tags.py"
cp "$CURRENT_DIR/api/routes/search.py" "$HV3_DIR/api/routes/search.py"
cp "$CURRENT_DIR/api/main.py" "$HV3_DIR/api/main.py"

# Step 2: Copy frontend profile pages and new features
echo "📦 Copying frontend pages and components..."
cp -r "$CURRENT_DIR/web/src/app/profile" "$HV3_DIR/web/src/app/"
cp -r "$CURRENT_DIR/web/src/app/u" "$HV3_DIR/web/src/app/"
cp -r "$CURRENT_DIR/web/src/app/lists" "$HV3_DIR/web/src/app/"
cp -r "$CURRENT_DIR/web/src/app/search" "$HV3_DIR/web/src/app/"
cp "$CURRENT_DIR/web/src/components/ListCard.tsx" "$HV3_DIR/web/src/components/"
cp "$CURRENT_DIR/web/src/components/TagBadge.tsx" "$HV3_DIR/web/src/components/"
cp "$CURRENT_DIR/web/src/components/TagSelector.tsx" "$HV3_DIR/web/src/components/"
cp "$CURRENT_DIR/web/src/components/SearchBar.tsx" "$HV3_DIR/web/src/components/"
cp "$CURRENT_DIR/web/src/types/list.ts" "$HV3_DIR/web/src/types/"
cp "$CURRENT_DIR/web/src/types/tag.ts" "$HV3_DIR/web/src/types/"

# Step 3: Update frontend pages to use centralized API
echo "🔧 Updating profile pages to use centralized API..."

# Update profile/page.tsx to use getApiUrl()
sed -i '' "s|'http://localhost:8000/users/me'|getApiUrl('/users/me')|g" "$HV3_DIR/web/src/app/profile/page.tsx"
sed -i '' "s|\`http://localhost:8000/votes/user/\${userData.username}\`|getApiUrl(\`/votes/user/\${userData.username}\`)|g" "$HV3_DIR/web/src/app/profile/page.tsx"

# Add import for getApiUrl if not present
if ! grep -q "import.*getApiUrl" "$HV3_DIR/web/src/app/profile/page.tsx"; then
    sed -i '' "1i\\
import { getApiUrl } from '@/lib/api'\\
" "$HV3_DIR/web/src/app/profile/page.tsx"
fi

# Update u/[username]/page.tsx to use getApiUrl()
sed -i '' "s|\`http://localhost:8000/users/\${username}\`|getApiUrl(\`/users/\${username}\`)|g" "$HV3_DIR/web/src/app/u/[username]/page.tsx"
sed -i '' "s|\`http://localhost:8000/votes/user/\${username}\`|getApiUrl(\`/votes/user/\${username}\`)|g" "$HV3_DIR/web/src/app/u/[username]/page.tsx"

# Add import for getApiUrl if not present
if ! grep -q "import.*getApiUrl" "$HV3_DIR/web/src/app/u/[username]/page.tsx"; then
    sed -i '' "4i\\
import { getApiUrl } from '@/lib/api';\\
" "$HV3_DIR/web/src/app/u/[username]/page.tsx"
fi

echo "✅ Merge complete!"
echo ""
echo "Next steps:"
echo "1. cd $HV3_DIR"
echo "2. git status (review changes)"
echo "3. git add ."
echo "4. git commit -m 'feat: Merge profile/review features with API integration'"
echo "5. npm run build (in web directory to verify)"
