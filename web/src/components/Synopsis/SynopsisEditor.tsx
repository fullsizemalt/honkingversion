'use client';

import { useState } from 'react';
import { Save, X, Eye, Edit2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface SynopsisEditorProps {
    initialContent: string;
    onSave: (content: string, summary: string) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

export default function SynopsisEditor({
    initialContent,
    onSave,
    onCancel,
    isSaving
}: SynopsisEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [summary, setSummary] = useState('');
    const [mode, setMode] = useState<'write' | 'preview'>('write');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(content, summary);
    };

    return (
        <form onSubmit={handleSubmit} className="border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMode('write')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider transition-colors ${mode === 'write'
                                ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                            }`}
                    >
                        <Edit2 className="w-3 h-3" />
                        Write
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('preview')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider transition-colors ${mode === 'preview'
                                ? 'bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]'
                                : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                            }`}
                    >
                        <Eye className="w-3 h-3" />
                        Preview
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="mb-4">
                {mode === 'write' ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 bg-[var(--bg-primary)] border border-[var(--border)] p-4 text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--accent-primary)] transition-colors resize-y"
                        placeholder="Write your synopsis here using Markdown..."
                        required
                    />
                ) : (
                    <div className="w-full h-64 overflow-y-auto bg-[var(--bg-primary)] border border-[var(--border)] p-4 prose prose-invert max-w-none prose-sm prose-p:text-[var(--text-secondary)] prose-headings:text-[var(--text-primary)] prose-a:text-[var(--accent-primary)]">
                        <ReactMarkdown>{content || '*No content*'}</ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Change Summary */}
            <div className="mb-6">
                <label className="block text-xs font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                    Change Summary (Optional)
                </label>
                <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] p-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors"
                    placeholder="e.g. Added historical context about the venue..."
                />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider hover:border-[var(--text-secondary)] transition-colors disabled:opacity-50"
                >
                    <X className="w-3 h-3" />
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving || !content.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider hover:bg-[var(--accent-primary)]/90 transition-colors disabled:opacity-50"
                >
                    {isSaving ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-3 h-3" />
                    )}
                    Save Changes
                </button>
            </div>
        </form>
    );
}
