'use client';

import { useState } from 'react';
import { User } from '@/types';
import Link from 'next/link';
import { Edit, Twitter, Instagram, Link as LinkIcon } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface ProfileHeaderProps {
    user: {
        id: number;
        username: string;
        display_name?: string;
        bio?: string;
        profile_picture_url?: string;
        role?: string;
        social_links?: {
            twitter?: string;
            instagram?: string;
            custom_url?: string;
        };
    };
    selectedTitle?: {
        title_name: string;
        color: string;
        icon?: string;
    } | null;
    isCurrentUser?: boolean;
}

const getRoleBadge = (role?: string) => {
    const roleKey = role || 'user';
    const badges = {
        user: { label: 'Member', color: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400' },
        power_user: { label: 'Power User', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
        mod: { label: 'Moderator', color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
        admin: { label: 'Admin', color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
        superadmin: { label: 'Super Admin', color: 'bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400' },
    };
    return badges[roleKey as keyof typeof badges] || badges.user;
};

export default function ProfileHeader({ user, selectedTitle, isCurrentUser }: ProfileHeaderProps) {
    const roleBadge = getRoleBadge(user.role);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-12 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div className="w-32 h-32 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-1 transition-transform duration-300 hover:scale-105">
                                <div className="w-full h-full bg-[var(--bg-secondary)] flex items-center justify-center overflow-hidden">
                                    {user.profile_picture_url ? (
                                        <img
                                            src={user.profile_picture_url}
                                            alt={user.username}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[var(--text-primary)]">
                                            {user.username.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1 space-y-4">
                            {/* Username & Role */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-[var(--text-primary)] tracking-tight">
                                            {user.display_name || user.username}
                                        </h1>
                                        <span className={`px-3 py-1 text-xs font-[family-name:var(--font-ibm-plex-mono)] uppercase tracking-wider ${roleBadge.color} transition-colors duration-200`}>
                                            {roleBadge.label}
                                        </span>
                                    </div>

                                    {/* Edit Button */}
                                    {isCurrentUser && (
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors group"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span className="font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider">
                                                Edit Profile
                                            </span>
                                        </button>
                                    )}
                                </div>

                                <p className="font-[family-name:var(--font-ibm-plex-mono)] text-sm text-[var(--text-tertiary)] tracking-wide">
                                    @{user.username}
                                </p>

                                {/* Selected Title */}
                                {selectedTitle && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20 transition-all duration-300 hover:border-[var(--accent-primary)]/40">
                                        {selectedTitle.icon && <span>{selectedTitle.icon}</span>}
                                        <span
                                            className="font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase tracking-widest"
                                            style={{ color: selectedTitle.color }}
                                        >
                                            {selectedTitle.title_name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            {user.bio && (
                                <p className="text-[var(--text-secondary)] max-w-2xl leading-relaxed">
                                    {user.bio}
                                </p>
                            )}

                            {/* Social Links */}
                            {user.social_links && Object.keys(user.social_links).length > 0 && (
                                <div className="flex items-center gap-3">
                                    {user.social_links.twitter && (
                                        <a
                                            href={`https://twitter.com/${user.social_links.twitter}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 border border-[var(--border)] hover:border-[var(--accent-tertiary)] hover:bg-[var(--accent-tertiary)]/5 transition-all duration-200"
                                        >
                                            <Twitter className="w-4 h-4 text-[var(--text-secondary)]" />
                                        </a>
                                    )}
                                    {user.social_links.instagram && (
                                        <a
                                            href={`https://instagram.com/${user.social_links.instagram}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 border border-[var(--border)] hover:border-[var(--accent-tertiary)] hover:bg-[var(--accent-tertiary)]/5 transition-all duration-200"
                                        >
                                            <Instagram className="w-4 h-4 text-[var(--text-secondary)]" />
                                        </a>
                                    )}
                                    {user.social_links.custom_url && (
                                        <a
                                            href={user.social_links.custom_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 border border-[var(--border)] hover:border-[var(--accent-tertiary)] hover:bg-[var(--accent-tertiary)]/5 transition-all duration-200"
                                        >
                                            <LinkIcon className="w-4 h-4 text-[var(--text-secondary)]" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Edit Button (if current user) */}
                        {isCurrentUser && (
                            <Link
                                href="/profile/edit"
                                className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/5 transition-all duration-200 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                username={user.username}
                initialBio={user.bio}
                initialSocialLinks={user.social_links}
                onSuccess={() => window.location.reload()}
            />
        </>
    );
}
