"use client";

import { useEffect, useState } from "react";
import { getApiEndpoint } from "@/lib/api";
import { format } from "date-fns";
import { Bug, Lightbulb, Zap, User } from "lucide-react";
import Link from "next/link";

interface ChangelogEntry {
    id: number;
    title: string;
    description: string;
    date: string;
    type: "fix" | "feature" | "improvement";
    credited_user?: {
        username: string;
    };
}

export default function UpdatesPage() {
    const [entries, setEntries] = useState<ChangelogEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(getApiEndpoint("/changelog/"))
            .then((res) => res.json())
            .then((data) => {
                setEntries(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch changelog", err);
                setLoading(false);
            });
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "fix":
                return <Bug className="w-5 h-5 text-red-500" />;
            case "feature":
                return <Lightbulb className="w-5 h-5 text-blue-500" />;
            case "improvement":
                return <Zap className="w-5 h-5 text-amber-500" />;
            default:
                return <Lightbulb className="w-5 h-5 text-zinc-500" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case "fix":
                return "Bug Fix";
            case "feature":
                return "New Feature";
            case "improvement":
                return "Improvement";
            default:
                return type;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Updates & Roadmap</h1>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    Keep track of what's new, what's fixed, and what's coming next to HonkingVersion.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
            ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent dark:before:via-zinc-800">
                    {entries.map((entry, index) => (
                        <div
                            key={entry.id}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                {getTypeIcon(entry.type)}
                            </div>

                            {/* Content */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className={`text-xs font-medium px-2.5 py-0.5 rounded ${entry.type === "fix"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                                            : entry.type === "feature"
                                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                            }`}
                                    >
                                        {getTypeLabel(entry.type)}
                                    </span>
                                    <time className="text-sm text-zinc-500">
                                        {format(new Date(entry.date), "MMM d, yyyy")}
                                    </time>
                                </div>
                                <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                                    {entry.description}
                                </p>

                                {entry.credited_user && (
                                    <div className="flex items-center gap-2 text-sm text-zinc-500 border-t border-zinc-100 dark:border-zinc-800 pt-3 mt-3">
                                        <User className="w-4 h-4" />
                                        <span>
                                            Thanks to{" "}
                                            <Link
                                                href={`/u/${entry.credited_user.username}`}
                                                className="font-medium text-amber-600 hover:underline"
                                            >
                                                @{entry.credited_user.username}
                                            </Link>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {entries.length === 0 && (
                        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-500">No updates yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
