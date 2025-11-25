#!/bin/bash
# Task Helper: Simplified task management with file tracking and logging

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TODO_FILE="$REPO_ROOT/todo.json"
TASKS_LOG="$REPO_ROOT/.tasks.log"

usage() {
    cat << EOF
Task Helper - Manage tasks with built-in file tracking and logging

Usage:
    $0 claim <task_id> <agent_name>     Claim a task and start logging
    $0 log <task_id> <message>          Log a message to task
    $0 files <task_id>                  Show files touched for task
    $0 complete <task_id>               Mark task complete and show summary
    $0 show <task_id>                   Show task details and history

Examples:
    $0 claim 13 "Claude Code"
    $0 log 13 "Fixed SQLAlchemy relationships"
    $0 files 13                         # Shows: api/models.py, api/routes/songs.py
    $0 complete 13

EOF
    exit 1
}

ensure_lock() {
    local lockfile="$TODO_FILE.lock"
    local max_wait=30
    local waited=0

    while [ -f "$lockfile" ] && [ $waited -lt $max_wait ]; do
        echo "⏳ Waiting for lock ($waited/$max_wait)..."
        sleep 1
        waited=$((waited + 1))
    done

    if [ -f "$lockfile" ]; then
        echo "❌ Lock stuck after ${max_wait}s. Force release with: rm $lockfile"
        exit 1
    fi

    touch "$lockfile"
    trap "rm -f $lockfile" EXIT
}

claim_task() {
    local task_id="$1"
    local agent_name="$2"

    if [ -z "$task_id" ] || [ -z "$agent_name" ]; then
        echo "❌ Usage: $0 claim <task_id> <agent_name>"
        exit 1
    fi

    ensure_lock

    # Update todo.json
    local updated_json=$(jq --arg id "$task_id" --arg agent "$agent_name" \
        '.[] |= if .id == $id then .status = "in-progress" | .agent = $agent else . end' \
        "$TODO_FILE")

    echo "$updated_json" | jq . > "$TODO_FILE"

    # Log the claim
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] CLAIM: Task $task_id claimed by $agent_name" >> "$TASKS_LOG"

    echo "✅ Task $task_id claimed by $agent_name"
    echo "📝 Files touched: (run '$0 files $task_id' to track)"
}

log_task() {
    local task_id="$1"
    local message="$2"

    if [ -z "$task_id" ] || [ -z "$message" ]; then
        echo "❌ Usage: $0 log <task_id> <message>"
        exit 1
    fi

    # Get current files changed
    local files_changed=$(git diff --name-only 2>/dev/null | tr '\n' ',' | sed 's/,$//')

    # Log entry
    local log_entry="[$(date '+%Y-%m-%d %H:%M:%S')] TASK_$task_id: $message"
    if [ -n "$files_changed" ]; then
        log_entry="$log_entry (files: $files_changed)"
    fi

    echo "$log_entry" >> "$TASKS_LOG"
    echo "📝 Logged: $message"
}

show_files() {
    local task_id="$1"

    if [ -z "$task_id" ]; then
        echo "❌ Usage: $0 files <task_id>"
        exit 1
    fi

    # Get all log entries for this task
    echo "📋 Files touched for task $task_id:"
    grep "TASK_$task_id" "$TASKS_LOG" 2>/dev/null | sed 's/.*files: /  ✓ /' || echo "  (no files logged yet)"
}

complete_task() {
    local task_id="$1"

    if [ -z "$task_id" ]; then
        echo "❌ Usage: $0 complete <task_id>"
        exit 1
    fi

    ensure_lock

    # Get task info
    local task_info=$(jq ".[] | select(.id == \"$task_id\")" "$TODO_FILE")
    local task_desc=$(echo "$task_info" | jq -r '.description')

    # Update todo.json
    local updated_json=$(jq --arg id "$task_id" \
        '.[] |= if .id == $id then .status = "completed" else . end' \
        "$TODO_FILE")

    echo "$updated_json" | jq . > "$TODO_FILE"

    # Log completion
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] COMPLETE: Task $task_id completed" >> "$TASKS_LOG"

    # Show summary
    echo ""
    echo "✅ Task $task_id completed!"
    echo "📝 Description: $task_desc"
    echo ""
    echo "📋 Task history:"
    grep "TASK_$task_id\|CLAIM.*$task_id\|COMPLETE.*$task_id" "$TASKS_LOG" 2>/dev/null | tail -10 || echo "  (no history)"
    echo ""
    echo "📊 Git summary:"
    git log --oneline --all -- . | head -3 || echo "  (no commits yet)"
    echo ""
    echo "💡 Next: Run 'git push origin master' to deploy"
}

show_task() {
    local task_id="$1"

    if [ -z "$task_id" ]; then
        echo "❌ Usage: $0 show <task_id>"
        exit 1
    fi

    local task_info=$(jq ".[] | select(.id == \"$task_id\")" "$TODO_FILE")

    if [ -z "$task_info" ]; then
        echo "❌ Task $task_id not found"
        exit 1
    fi

    echo ""
    echo "📋 Task $task_id:"
    echo "   Description: $(echo "$task_info" | jq -r '.description')"
    echo "   Status: $(echo "$task_info" | jq -r '.status')"
    echo "   Agent: $(echo "$task_info" | jq -r '.agent')"
    echo ""
    echo "📝 Task history:"
    grep "TASK_$task_id\|CLAIM.*$task_id" "$TASKS_LOG" 2>/dev/null | tail -10 || echo "   (no history)"
    echo ""
}

# Initialize .tasks.log if it doesn't exist
if [ ! -f "$TASKS_LOG" ]; then
    touch "$TASKS_LOG"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INIT: Task logging started" > "$TASKS_LOG"
fi

# Command routing
case "${1:-}" in
    claim)
        claim_task "$2" "$3"
        ;;
    log)
        log_task "$2" "$3"
        ;;
    files)
        show_files "$2"
        ;;
    complete)
        complete_task "$2"
        ;;
    show)
        show_task "$2"
        ;;
    *)
        usage
        ;;
esac
