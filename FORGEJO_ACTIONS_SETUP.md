# Forgejo Actions & Runners Setup Guide

This guide will set up Forgejo Actions CI/CD to automatically build and deploy on every push to master.

## Architecture

- **Forgejo Repository**: git.runfoo.run/runfoo/honkingversion
- **Forgejo Runner**: Runs on nexus-vector (same deployment server)
- **Workflow**: `.gitea/workflows/deploy.yml` triggers on push to master
- **Deployment**: Automatically pulls, rebuilds, and restarts services

## Step 1: Prepare SSH Key for Runner

The runner needs an SSH key to access the deployment server. You have two options:

### Option A: Create a Dedicated SSH Key (Recommended)
```bash
ssh-keygen -t ed25519 -f ~/.ssh/forgejo_deploy_key -N ""
```

Store this key safely - you'll need it for the runner.

### Option B: Use Existing SSH Key
Use your existing deployment key if you have one.

## Step 2: Set Up Forgejo Runner on nexus-vector

SSH into nexus-vector and follow these steps:

```bash
# 1. Create runner directory
mkdir -p /opt/forgejo-runner
cd /opt/forgejo-runner

# 2. Download Forgejo Runner
# Check latest version at https://gitea.com/gitea/act_runner/releases
RUNNER_VERSION="0.9.2"
wget https://github.com/nektos/act/releases/download/v${RUNNER_VERSION}/act_Linux_x86_64.tar.gz
tar xzf act_Linux_x86_64.tar.gz

# 3. Register the runner with Forgejo
./act_runner register --no-interactive \
  --instance https://git.runfoo.run \
  --token <REGISTRATION_TOKEN> \
  --name honkingversion-runner \
  --labels ubuntu-latest

# 4. Start the runner
./act_runner daemon &
```

### Getting Registration Token

1. Go to https://git.runfoo.run/admin/runners
2. Click "Create new runner"
3. Copy the registration token
4. Use it in the command above

## Step 3: Configure Forgejo Secrets

The workflow needs SSH credentials to deploy. Add these secrets to the Forgejo repository:

1. Go to: https://git.runfoo.run/runfoo/honkingversion/settings/secrets
2. Add these secrets:

**Secret 1: DEPLOY_KEY**
```
Name: DEPLOY_KEY
Value: <contents of ~/.ssh/forgejo_deploy_key>
```

**Secret 2: DEPLOY_HOST**
```
Name: DEPLOY_HOST
Value: nexus-vector
```

**Secret 3: DEPLOY_USER**
```
Name: DEPLOY_USER
Value: root
```

## Step 4: Update Workflow File

The workflow (`.gitea/workflows/deploy.yml`) uses these secrets:

```yaml
- name: Deploy
  env:
    DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
    DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
    DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
  run: |
    # Setup SSH
    mkdir -p ~/.ssh
    echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
    chmod 600 ~/.ssh/deploy_key

    # Deploy
    ssh -o StrictHostKeyChecking=no -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST << 'ENDSSH'
    cd /root/ANTIGRAVITY/honkingversion
    git pull origin master
    docker compose down
    docker compose pull
    docker compose up -d --build
    ENDSSH
```

## Step 5: Test the Setup

1. Make a small change to the code:
```bash
cd ~/ANTIGRAVITY/honkingversion
echo "# Test" >> README.md
git add README.md
git commit -m "Test CI/CD"
git push origin master
```

2. Go to https://git.runfoo.run/runfoo/honkingversion/actions to watch the workflow run

3. Check nexus-vector for deployment:
```bash
ssh root@nexus-vector "cd /root/ANTIGRAVITY/honkingversion && docker compose ps"
```

## Troubleshooting

### Runner Won't Start

**Error**: "No such file or directory"
```bash
# Make sure you're in the right directory
cd /opt/forgejo-runner
chmod +x act_runner
./act_runner daemon
```

### SSH Authentication Fails

**Error**: "Permission denied (publickey)"
1. Verify the SSH key is in the secret correctly
2. Check that the public key is authorized on nexus-vector:
```bash
cat ~/.ssh/forgejo_deploy_key.pub >> ~/.ssh/authorized_keys
```

### Workflow Not Triggering

1. Check runner is online: https://git.runfoo.run/admin/runners
2. Verify `.gitea/workflows/deploy.yml` is in `master` branch
3. Check workflow syntax: push should show a green checkmark

### Deployment Hangs

1. Check runner logs: `tail -f /opt/forgejo-runner/act_runner.log`
2. Check Docker on deployment server: `docker compose logs -f`

## Advanced: Using Self-Signed Certificates

If your Forgejo instance uses self-signed certs:

```bash
./act_runner register --no-interactive \
  --instance https://git.runfoo.run \
  --insecure \
  --token <TOKEN> \
  --name honkingversion-runner
```

## Running Runner as Service (Optional)

For production, run the runner as a systemd service:

```bash
# Create service file
sudo tee /etc/systemd/system/forgejo-runner.service > /dev/null << 'EOF'
[Unit]
Description=Forgejo Runner
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/forgejo-runner
ExecStart=/opt/forgejo-runner/act_runner daemon
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable forgejo-runner
sudo systemctl start forgejo-runner

# Check status
sudo systemctl status forgejo-runner
```

## Monitoring

### Check Runner Status
```bash
# At https://git.runfoo.run/admin/runners
# Should show green checkmark and last ping timestamp
```

### View Workflow Runs
```bash
# At https://git.runfoo.run/runfoo/honkingversion/actions
# Shows all workflow runs, logs, and status
```

### Check Deployment Logs
```bash
ssh root@nexus-vector "docker compose logs -f --tail 50"
```

## Next Steps

Once CI/CD is working:
1. All pushes to `master` will automatically deploy
2. Workflow status visible at https://git.runfoo.run/runfoo/honkingversion/actions
3. Failed deployments will show in workflow logs
4. Can add additional steps (notifications, health checks, etc.)

## References

- [Forgejo Actions Docs](https://forgejo.org/docs/latest/admin/actions/)
- [Forgejo Runner Docs](https://gitea.com/gitea/act_runner)
- [Act (Docker Runner) Docs](https://nektosact.com/)
