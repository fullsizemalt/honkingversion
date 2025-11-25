/**
 * Shared utilities and components for Settings sections
 * Reduces duplication across all settings components
 */

import React from 'react';

/**
 * Loading skeleton for settings panels
 * Shows 2 animated placeholder boxes to indicate loading state
 */
export function SettingsLoadingSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-12 bg-[var(--bg-secondary)] rounded animate-pulse" />
            <div className="h-48 bg-[var(--bg-secondary)] rounded animate-pulse" />
        </div>
    );
}

/**
 * Error message alert component
 * Displays error messages with red styling and close functionality
 */
export function ErrorAlert({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
    if (!message) return null;

    return (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm flex items-center justify-between">
            <span>{message}</span>
            {onDismiss && (
                <button onClick={onDismiss} className="text-red-500 hover:text-red-700">
                    ✕
                </button>
            )}
        </div>
    );
}

/**
 * Success message alert component
 * Displays success messages with green styling
 */
export function SuccessAlert({ message }: { message: string }) {
    if (!message) return null;

    return (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
            {message}
        </div>
    );
}

/**
 * Settings section header
 * Reusable heading and description for each settings section
 */
export function SettingsSectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-6">
            <h2 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-[var(--text-primary)] mb-2">
                {title}
            </h2>
            {description && (
                <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            )}
        </div>
    );
}

/**
 * Settings subsection divider
 * Visual separator with heading for grouping related settings
 */
export function SettingsSubsection({
    children,
    title,
    description,
    isLast = false
}: {
    children: React.ReactNode;
    title: string;
    description?: string;
    isLast?: boolean;
}) {
    return (
        <div className={isLast ? '' : 'pb-6 border-b border-[var(--border-subtle)]'}>
            <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                {title}
            </h3>
            {description && (
                <p className="text-xs text-[var(--text-tertiary)] mb-3">{description}</p>
            )}
            {children}
        </div>
    );
}

/**
 * Primary action button for settings (Save, Enable, etc.)
 */
export function PrimaryButton({
    children,
    onClick,
    disabled = false,
    loading = false
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className="px-4 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] hover:opacity-90 disabled:opacity-50 transition-opacity font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded"
        >
            {loading ? 'Saving...' : children}
        </button>
    );
}

/**
 * Secondary action button for settings (Cancel, Disconnect, etc.)
 */
export function SecondaryButton({
    children,
    onClick,
    variant = 'default'
}: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'danger';
}) {
    const baseClasses = 'px-4 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider rounded';

    const variants = {
        default: `${baseClasses} bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--accent-primary)]`,
        danger: `${baseClasses} bg-red-100 text-red-700 border border-red-300 hover:bg-red-200`
    };

    return (
        <button onClick={onClick} className={variants[variant]}>
            {children}
        </button>
    );
}

/**
 * Radio button group for multiple choice settings
 * Handles state management and styling
 */
export function RadioGroup({
    name,
    options,
    value,
    onChange,
    descriptions = {}
}: {
    name: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
    descriptions?: Record<string, string>;
}) {
    return (
        <div className="space-y-2">
            {options.map((option) => (
                <label key={option} className="flex items-start cursor-pointer">
                    <input
                        type="radio"
                        name={name}
                        value={option}
                        checked={value === option}
                        onChange={(e) => onChange(e.target.value)}
                        className="mt-1 mr-3"
                    />
                    <div>
                        <span className="text-sm text-[var(--text-secondary)] capitalize font-semibold">
                            {option}
                        </span>
                        {descriptions[option] && (
                            <p className="text-xs text-[var(--text-tertiary)]">{descriptions[option]}</p>
                        )}
                    </div>
                </label>
            ))}
        </div>
    );
}

/**
 * Status badge component
 * Shows enabled/disabled, connected/not connected status
 */
export function StatusBadge({
    status,
    variant = 'success'
}: {
    status: string;
    variant?: 'success' | 'warning' | 'danger';
}) {
    const variants = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700'
    };

    return (
        <div className={`inline-block px-3 py-1 rounded text-xs font-bold ${variants[variant]}`}>
            {status}
        </div>
    );
}

/**
 * Toggle switch component for boolean settings
 */
export function ToggleSwitch({
    checked,
    onChange,
    disabled = false
}: {
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[var(--border-subtle)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent-primary)] peer-disabled:opacity-50" />
        </label>
    );
}

/**
 * Form container for consistent settings form styling
 */
export function SettingsFormContainer({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded p-6">
            {children}
        </div>
    );
}

/**
 * Modal for settings operations (setup, confirmation, etc.)
 */
export function SettingsModal({
    isOpen,
    title,
    children,
    onClose
}: {
    isOpen: boolean;
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded p-6 max-w-md w-full">
                <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)] mb-4">
                    {title}
                </h3>
                {children}
                <button
                    onClick={onClose}
                    className="w-full mt-4 px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase rounded hover:border-[var(--accent-primary)]"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

/**
 * Info section for displaying help text or important information
 */
export function InfoSection({
    title,
    children
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="mt-6 pt-6 border-t border-[var(--border-subtle)]">
            <h3 className="font-[family-name:var(--font-ibm-plex-mono)] text-sm uppercase tracking-wider text-[var(--text-primary)] mb-3">
                {title}
            </h3>
            {children}
        </div>
    );
}
