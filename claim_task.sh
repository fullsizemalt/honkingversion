#!/bin/bash
LOCKFILE="/Users/ten/ANTIGRAVITY/honkingversion/todo.json.lock"
trap "rm -f $LOCKFILE; exit" INT TERM EXIT

while [ -e "$LOCKFILE" ]; do
    sleep 0.1
done
touch "$LOCKFILE"

TASK_ID=$1
AGENT_NAME=$2
jq "(.[] | select(.id == \"$TASK_ID\") | .status) = \"in-progress\" | (.[] | select(.id == \"$TASK_ID\") | .agent) = \"$AGENT_NAME\"" /Users/ten/ANTIGRAVITY/honkingversion/todo.json > /Users/ten/ANTIGRAVITY/honkingversion/todo.json.tmp && mv /Users/ten/ANTIGRAVITY/honkingversion/todo.json.tmp /Users/ten/ANTIGRAVITY/honkingversion/todo.json

rm -f "$LOCKFILE"
trap - INT TERM EXIT
