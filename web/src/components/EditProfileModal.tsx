'use client';

import { useState } from 'react';
import { X, Cloud, Instagram, Link as LinkIcon, Loader2 } from 'lucide-react';
import { getApiEndpoint } from '@/lib/api';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
    initialBio?: string;
    initialSocialLinks?: {
        bluesky?: string;
        instagram?: string;
        custom_url?: string;
    };
    onSuccess: () => void;
}

export default function EditProfileModal({
    isOpen,
    onClose,
    username,
    initialBio = '',
    initialSocialLinks = {},
    onSuccess
}: EditProfileModalProps) {
    const [bio, setBio] = useState(initialBio);
    const [bluesky, setBluesky] = useState(initialSocialLinks.bluesky || '');
    const [instagram, setInstagram] = useState(initialSocialLinks.instagram || '');
    const [customUrl, setCustomUrl] = useState(initialSocialLinks.custom_url || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(getApiEndpoint(`/profile/${username}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bio,
                    social_links: {
                        bluesky,
                        instagram,
                        custom_url: customUrl
                    }
                })
            });

            if (!res.ok) {
                throw new Error('Failed to update profile');
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError('Failed to save changes. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] w-full max-w-md shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold uppercase tracking-wide">
                        Edit Profile
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="block text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider text-[var(--text-secondary)]">
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            maxLength={160}
                            rows={3}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] p-3 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors resize-none"
                            placeholder="Tell us about yourself..."
                        />
                        <div className="text-right text-xs text-[var(--text-tertiary)]">
                            {bio.length}/160
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <label className="block text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider text-[var(--text-secondary)]">
                            Social Links
                        </label>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                                <Cloud className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={bluesky}
                                onChange={(e) => setBluesky(e.target.value)}
                                placeholder="Bluesky handle (e.g. @user.bsky.social)"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] pl-10 pr-3 py-2 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                                <Instagram className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={instagram}
                                onChange={(e) => setInstagram(e.target.value)}
                                placeholder="Instagram username"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] pl-10 pr-3 py-2 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                                <LinkIcon className="w-4 h-4" />
                            </div>
                            <input
                                type="url"
                                value={customUrl}
                                onChange={(e) => setCustomUrl(e.target.value)}
                                placeholder="https://your-website.com"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] pl-10 pr-3 py-2 text-sm focus:border-[var(--accent-primary)] focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] text-sm font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider hover:bg-[var(--accent-primary)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
