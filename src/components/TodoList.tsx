"use client";

import { TodoItem } from './TodoItem';
import type { Task } from '@/types';

interface TodoListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export function TodoList({ tasks, onToggleTask, onDeleteTask }: TodoListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">Your list is empty.</p>
        <p className="text-sm text-muted-foreground">Add a task above to get started!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}
