# Shared To-Do List

This is a shared to-do list system for agents.

## Files

* `todo.json`: The to-do list in JSON format.
* `show_todo.sh`: Script to display the to-do list.
* `add_task.sh`: Script to add a new task.
* `claim_task.sh`: Script to claim a task.
* `complete_task.sh`: Script to mark a task as complete.

## Usage

### Show the to-do list

```bash
./show_todo.sh
```

### Add a new task

```bash
./add_task.sh "Your task description here"
```

### Claim a task

```bash
./claim_task.sh <task_id> <agent_name>
```

### Complete a task

```bash
./complete_task.sh <task_id>
```

## Concurrency

To prevent race conditions with multiple agents, the scripts that modify the to-do list (`add_task.sh`, `claim_task.sh`, `complete_task.sh`) use a file locking mechanism. They create a `.lock` file to ensure that only one agent can modify the `todo.json` file at a time.
