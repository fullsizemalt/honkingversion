'use client';

import { useEffect, useState } from 'react';

interface ProfileData {
    display_name: string;
    bio: string;
    profile_picture_url?: string;
}

export default function ProfileSettings() {
    const [profile, setProfile] = useState<ProfileData>({
        display_name: '',
        bio: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/hv/users/me', {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setProfile({
                    display_name: data.display_name || '',
                    bio: data.bio || '',
                    profile_picture_url: data.profile_picture_url,
                });
                if (data.profile_picture_url) {
                    setImagePreview(data.profile_picture_url);
                }
            }
        } catch (err) {
            setError('Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/hv/settings/profile', {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    display_name: profile.display_name,
                    bio: profile.bio,
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError('Failed to save profile');
            }
        } catch (err) {
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-12 bg-[var(--bg-secondary)] rounded animate-pulse" />
                <div className="h-32 bg-[var(--bg-secondary)] rounded animate-pulse" />
            </div>
        );
    }

    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-6">
                Profile Settings
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
                    Profile updated successfully!
                </div>
            )}

            <div className="space-y-6">
                {/* Profile Picture */}
                <div>
                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
                        Profile Picture
                    </label>
                    <div className="flex items-center gap-4">
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border border-[var(--border-subtle)]"
                            />
                        )}
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="text-sm text-[var(--text-secondary)]"
                        />
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)] mt-2">
                        Max 5MB. Supported: JPEG, PNG, WebP
                    </p>
                </div>

                {/* Display Name */}
                <div>
                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        maxLength={50}
                        value={profile.display_name}
                        onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                        placeholder="Your name"
                    />
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        {profile.display_name.length}/50 characters
                    </p>
                </div>

                {/* Bio */}
                <div>
                    <label className="block font-[family-name:var(--font-ibm-plex-mono)] text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-2">
                        Bio
                    </label>
                    <textarea
                        maxLength={500}
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] transition-colors font-[family-name:var(--font-ibm-plex-mono)] text-sm rounded"
                        placeholder="Tell us about yourself..."
                    />
                    <p className="text-xs text-[var(--text-tertiary)] mt-1">
                        {profile.bio.length}/500 characters
                    </p>
                </div>

                {/* Save Button */}
                <div className="flex gap-2 pt-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
