"use client";

import * as React from 'react';
import type { Task } from '@/types';
import { AddItemForm } from './AddItemForm';
import { TodoList } from './TodoList';
import { TaskSuggestions } from './TaskSuggestions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from './ui/separator';

export function VerdantList() {
    const [tasks, setTasks] = React.useState<Task[]>([]);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        try {
            const storedTasks = localStorage.getItem('verdant-tasks');
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.error("Failed to parse tasks from localStorage", error);
        }
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            localStorage.setItem('verdant-tasks', JSON.stringify(tasks));
        }
    }, [tasks, isMounted]);
    
    // A simple skeleton loader to prevent hydration mismatch and layout shift
    if (!isMounted) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                 <div className="w-full max-w-2xl mx-auto space-y-4">
                    <div className="h-10 w-48 bg-muted rounded-md animate-pulse mx-auto"></div>
                    <div className="h-6 w-64 bg-muted rounded-md animate-pulse mx-auto"></div>
                    <div className="h-48 w-full bg-muted rounded-lg animate-pulse mt-8"></div>
                    <div className="h-64 w-full bg-muted rounded-lg animate-pulse"></div>
                 </div>
            </div>
        )
    }

    const handleAddTask = (text: string) => {
        const newTask: Task = {
            id: Date.now(),
            text,
            completed: false,
        };
        setTasks(prevTasks => [newTask, ...prevTasks]);
    };

    const handleToggleTask = (id: number) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDeleteTask = (id: number) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    };
    
    return (
        <div className="min-h-screen bg-background flex flex-col items-center py-8 sm:py-12 px-4">
            <div className="w-full max-w-2xl mx-auto space-y-8">
                <header className="text-center space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-bold font-headline text-primary">VerdantList</h1>
                    <p className="text-muted-foreground">Your serene and simple to-do list.</p>
                </header>

                <main className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add a New Task</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddItemForm onAddTask={handleAddTask} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Tasks</CardTitle>
                             <CardDescription>
                                You have {tasks.filter(t => !t.completed).length} pending task(s).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TodoList tasks={tasks} onToggleTask={handleToggleTask} onDeleteTask={handleDeleteTask} />
                        </CardContent>
                    </Card>
                    
                    <Separator />
                    
                    <TaskSuggestions tasks={tasks} onAddTask={handleAddTask} />
                </main>
            </div>
        </div>
    );
}
