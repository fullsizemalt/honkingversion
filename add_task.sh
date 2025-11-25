#!/bin/bash
LOCKFILE="/Users/ten/ANTIGRAVITY/honkingversion/todo.json.lock"
trap "rm -f $LOCKFILE; exit" INT TERM EXIT

while [ -e "$LOCKFILE" ]; do
    sleep 0.1
done
touch "$LOCKFILE"

TASK_DESCRIPTION=$1
ID=$(jq 'length' /Users/ten/ANTIGRAVITY/honkingversion/todo.json)
NEW_TASK=$(jq -n --arg id "$ID" --arg desc "$TASK_DESCRIPTION" '{id: $id, description: $desc, status: "pending", agent: null}')
jq ". += [$NEW_TASK]" /Users/ten/ANTIGRAVITY/honkingversion/todo.json > /Users/ten/ANTIGRAVITY/honkingversion/todo.json.tmp && mv /Users/ten/ANTIGRAVITY/honkingversion/todo.json.tmp /Users/ten/ANTIGRAVITY/honkingversion/todo.json

rm -f "$LOCKFILE"
trap - INT TERM EXIT
