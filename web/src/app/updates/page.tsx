"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
    const { data: session } = useSession();
    const [entries, setEntries] = useState<ChangelogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [filter, setFilter] = useState<"all" | "feature" | "improvement" | "fix">("all");
    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "feature" as ChangelogEntry["type"],
        credited_user_id: ""
    });

    useEffect(() => {
        fetch(getApiEndpoint("/changelog/"))
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch changelog: ${res.status}`);
                }
                return res.json();
            })
            .then((data: ChangelogEntry[]) => {
                setEntries(data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch changelog", err);
                setError("Unable to load updates right now. Please try again in a bit.");
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
                return "Fix";
            case "feature":
                return "Feature";
            case "improvement":
                return "Improvement";
            default:
                return type;
        }
    };

    const handleSubmit = async () => {
        if (!session?.user?.accessToken) {
            setSubmitError("You need to be signed in with permission to post updates.");
            return;
        }

        if (!form.title.trim() || !form.description.trim()) {
            setSubmitError("Title and description are required.");
            return;
        }

        setSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        try {
            const res = await fetch(getApiEndpoint("/changelog/"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.user.accessToken}`
                },
                body: JSON.stringify({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    type: form.type,
                    credited_user_id: form.credited_user_id
                        ? Number(form.credited_user_id)
                        : null
                })
            });

            if (!res.ok) {
                throw new Error(`Failed to create changelog entry (${res.status})`);
            }

            const created: ChangelogEntry = await res.json();
            setEntries((prev) => [created, ...prev]);
            setSubmitSuccess("Update posted.");
            setForm({ title: "", description: "", type: "feature", credited_user_id: "" });
        } catch (err) {
            console.error(err);
            setSubmitError("Could not post update. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredEntries =
        filter === "all" ? entries : entries.filter((entry) => entry.type === filter);

    const filters: { key: typeof filter; label: string }[] = [
        { key: "all", label: "All" },
        { key: "feature", label: "Features" },
        { key: "improvement", label: "Improvements" },
        { key: "fix", label: "Fixes" }
    ];

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Updates & Roadmap</h1>
                <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                    Keep track of what's new, what's fixed, and what's coming next to HonkingVersion.
                </p>
            </div>

            <div className="mb-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Post an update</h2>
                        <p className="text-sm text-zinc-500">
                            Admin-only. Posts appear immediately in the timeline.
                        </p>
                    </div>
                    {session?.user ? (
                        <span className="text-xs px-2 py-1 rounded-full border border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-200">
                            Signed in
                        </span>
                    ) : (
                        <Link
                            href="/auth/signin"
                            className="text-sm text-amber-700 hover:underline dark:text-amber-200"
                        >
                            Sign in
                        </Link>
                    )}
                </div>

                <div className="grid gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                                placeholder="Short headline"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Type
                            </label>
                            <select
                                value={form.type}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        type: e.target.value as ChangelogEntry["type"]
                                    }))
                                }
                                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                            >
                                <option value="feature">Feature</option>
                                <option value="improvement">Improvement</option>
                                <option value="fix">Fix</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm((f) => ({ ...f, description: e.target.value }))
                            }
                            rows={3}
                            className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                            placeholder="What changed? Keep it concise."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                                Credited user ID (optional)
                            </label>
                            <input
                                type="number"
                                value={form.credited_user_id}
                                onChange={(e) =>
                                    setForm((f) => ({
                                        ...f,
                                        credited_user_id: e.target.value
                                    }))
                                }
                                className="w-full rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                                placeholder="123"
                            />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
                            <div className="flex gap-2 text-sm text-zinc-500">
                                {submitSuccess && (
                                    <span className="text-green-600 dark:text-green-300">
                                        {submitSuccess}
                                    </span>
                                )}
                                {submitError && (
                                    <span className="text-red-600 dark:text-red-300">
                                        {submitError}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded border transition-colors ${
                                    submitting
                                        ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800 cursor-not-allowed"
                                        : "bg-amber-500 text-white border-amber-500 hover:bg-amber-600"
                                }`}
                            >
                                {submitting ? "Posting..." : "Post update"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6 flex items-center gap-3 justify-center flex-wrap">
                {filters.map((f) => {
                    const active = filter === f.key;
                    return (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`text-sm px-4 py-2 rounded-full border transition-colors ${active
                                ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800"
                                : "border-zinc-200 text-zinc-600 hover:border-amber-200 hover:text-amber-700 dark:border-zinc-800 dark:text-zinc-300"
                                }`}
                        >
                            {f.label}
                        </button>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-b-2 border-amber-500"></div>
                </div>
            ) : error ? (
                <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-200">
                    <p>{error}</p>
                </div>
            ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent dark:before:via-zinc-800">
                    {filteredEntries.map((entry) => (
                        <div
                            key={entry.id}
                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                        >
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                {getTypeIcon(entry.type)}
                            </div>

                            {/* Content */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span
                                        className={`text-xs font-medium px-2.5 py-0.5 ${entry.type === "fix"
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
                        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-500">No updates yet. Check back soon!</p>
                        </div>
                    )}

                    {entries.length > 0 && filteredEntries.length === 0 && (
                        <div className="text-center py-10 bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-zinc-500">
                                No {getTypeLabel(filter)} entries yet. Try another filter.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
