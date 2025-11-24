"use client";

import { useState } from "react";
import { X, MessageSquare, Bug, Lightbulb } from "lucide-react";
import { getApiEndpoint } from "@/lib/api";

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
    const [type, setType] = useState("bug");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const res = await fetch(getApiEndpoint("/feedback/"), {
                method: "POST",
                headers,
                body: JSON.stringify({ type, subject, message }),
            });

            if (!res.ok) throw new Error("Failed to submit feedback");

            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setSubject("");
                setMessage("");
                onClose();
            }, 2000);
        } catch (_error) {
            console.error("Feedback submission failed", _error);
            setError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[var(--bg-secondary)] shadow-xl w-full max-w-md overflow-hidden border border-[var(--border)]">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-500" />
                        Send Feedback
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {submitted ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Thank You!</h3>
                        <p className="text-[var(--text-secondary)]">
                            Your feedback has been received.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setType("bug")}
                                className={`flex items-center justify-center gap-2 p-3 border transition-all ${type === "bug"
                                    ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
                                    : "border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]"
                                    }`}
                            >
                                <Bug className="w-4 h-4" />
                                Report Bug
                            </button>
                            <button
                                type="button"
                                onClick={() => setType("feature")}
                                className={`flex items-center justify-center gap-2 p-3 border transition-all ${type === "feature"
                                    ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400"
                                    : "border-[var(--border)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)]"
                                    }`}
                            >
                                <Lightbulb className="w-4 h-4" />
                                Feature Idea
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-2 border border-[var(--border)] bg-transparent focus:ring-2 focus:ring-amber-500 outline-none text-[var(--text-primary)]"
                                placeholder="Brief summary..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={4}
                                className="w-full p-2 border border-[var(--border)] bg-transparent focus:ring-2 focus:ring-amber-500 outline-none resize-none text-[var(--text-primary)]"
                                placeholder="Describe the issue or idea in detail..."
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                        )}

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Sending..." : "Submit Feedback"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
