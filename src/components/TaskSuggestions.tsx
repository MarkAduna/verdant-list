"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Sparkles } from 'lucide-react';
import { suggestSimilarTasks } from '@/ai/flows/suggest-similar-tasks';
import type { Task } from '@/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface TaskSuggestionsProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
}

export function TaskSuggestions({ tasks, onAddTask }: TaskSuggestionsProps) {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const taskTexts = tasks.filter(t => !t.completed).map((t) => t.text);
      if (taskTexts.length === 0) {
        setError("Add some tasks first to get relevant suggestions.");
        setIsLoading(false);
        return;
      }
      const result = await suggestSimilarTasks({ tasks: taskTexts });
      setSuggestions(result.suggestions);
    } catch (e) {
      console.error(e);
      setError('Failed to get suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span>AI Task Suggestions</span>
        </CardTitle>
        <CardDescription>
          Get new ideas based on your current tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetSuggestions} disabled={isLoading || tasks.length === 0} className="w-full" variant="outline">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Suggest Tasks
        </Button>
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {suggestions.length > 0 && (
          <div className="space-y-2 pt-4">
            <h4 className="font-semibold text-sm">Suggestions:</h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center justify-between gap-2 rounded-md bg-secondary p-2 animate-in fade-in-50 duration-500">
                  <span className="text-sm text-secondary-foreground">{suggestion}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onAddTask(suggestion)}
                    aria-label={`Add task: ${suggestion}`}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
