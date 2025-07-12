"use client";

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

interface TodoItemProps {
  task: Task;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export function TodoItem({ task, onToggleTask, onDeleteTask }: TodoItemProps) {
  return (
    <li className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-secondary animate-in fade-in-50 duration-300">
      <Checkbox
        id={`task-${task.id}`}
        checked={task.completed}
        onCheckedChange={() => onToggleTask(task.id)}
        aria-labelledby={`task-label-${task.id}`}
      />
      <label
        id={`task-label-${task.id}`}
        htmlFor={`task-${task.id}`}
        className={cn(
          'flex-1 text-sm font-medium cursor-pointer',
          task.completed && 'line-through text-muted-foreground'
        )}
      >
        {task.text}
      </label>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDeleteTask(task.id)}
        aria-label={`Delete task: ${task.text}`}
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </li>
  );
}
