"use client";

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddItemFormProps {
  onAddTask: (text: string) => void;
}

export function AddItemForm({ onAddTask }: AddItemFormProps) {
  const [text, setText] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim());
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
      <Input
        type="text"
        placeholder="e.g. Water the plants"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1"
        aria-label="New task"
      />
      <Button type="submit" aria-label="Add task">
        <Plus className="mr-2 h-4 w-4" /> Add
      </Button>
    </form>
  );
}
