#!/bin/bash
# Setup Forgejo Runner on this machine
# Run this script on the deployment server (nexus-vector)

set -e

echo "🚀 Forgejo Runner Setup"
echo "======================"
echo ""

# Get runner configuration from user
read -p "Enter Forgejo instance URL (default: https://git.runfoo.run): " FORGEJO_URL
FORGEJO_URL="${FORGEJO_URL:-https://git.runfoo.run}"

read -p "Enter runner registration token (from $FORGEJO_URL/admin/runners): " RUNNER_TOKEN

if [ -z "$RUNNER_TOKEN" ]; then
    echo "❌ Runner token is required!"
    exit 1
fi

read -p "Enter runner name (default: honkingversion-runner): " RUNNER_NAME
RUNNER_NAME="${RUNNER_NAME:-honkingversion-runner}"

# Create runner directory
echo "📁 Creating runner directory..."
sudo mkdir -p /opt/forgejo-runner
cd /opt/forgejo-runner

# Check if runner already exists
if [ -f "act_runner" ]; then
    echo "✅ Runner already installed, skipping download"
else
    echo "⬇️  Downloading Forgejo Runner..."

    # Get latest release
    LATEST_RELEASE=$(curl -s https://api.github.com/repos/nektos/act/releases/latest | grep tag_name | cut -d'"' -f4)
    RUNNER_VERSION="${LATEST_RELEASE#v}"

    echo "   Version: $RUNNER_VERSION"

    sudo wget -q https://github.com/nektos/act/releases/download/${LATEST_RELEASE}/act_Linux_x86_64.tar.gz
    sudo tar xzf act_Linux_x86_64.tar.gz
    sudo rm act_Linux_x86_64.tar.gz
    sudo chmod +x act_runner
fi

# Register runner
echo ""
echo "📝 Registering runner..."
sudo ./act_runner register --no-interactive \
    --instance "$FORGEJO_URL" \
    --token "$RUNNER_TOKEN" \
    --name "$RUNNER_NAME" \
    --labels ubuntu-latest

echo ""
echo "✅ Runner registered successfully!"
echo ""
echo "Starting runner..."
sudo ./act_runner daemon > /tmp/forgejo-runner.log 2>&1 &

echo "✅ Runner started in background"
echo ""
echo "📋 Next steps:"
echo "1. Go to $FORGEJO_URL/admin/runners"
echo "2. Verify your runner shows as 'Online' with green checkmark"
echo "3. Configure secrets in the repository:"
echo "   - DEPLOY_KEY: Your SSH private key"
echo "   - DEPLOY_HOST: nexus-vector"
echo "   - DEPLOY_USER: root"
echo ""
echo "📊 Monitor runner:"
echo "   tail -f /tmp/forgejo-runner.log"
echo ""
echo "🛑 Stop runner:"
echo "   sudo pkill -f 'act_runner daemon'"
echo ""
