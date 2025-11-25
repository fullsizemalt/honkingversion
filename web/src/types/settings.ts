/**
 * Settings and Account Type Definitions
 * Provides strong typing for all settings-related features
 */

/**
 * User account information
 * Represents the core user identity and authentication details
 */
export interface UserAccount {
    id: number;
    username: string;
    email: string;
    created_at: string;
    email_verified: boolean;
}

/**
 * User profile information
 * Contains display and biographical information
 */
export interface UserProfile {
    display_name: string;
    bio: string;
    profile_picture_url?: string;
}

/**
 * Complete user data (account + profile)
 */
export type UserData = UserAccount & UserProfile;

/**
 * Privacy visibility options
 * Determines who can see the user's profile
 */
export type ProfileVisibility = 'public' | 'unlisted' | 'private';

/**
 * Activity visibility options
 * Determines who can see the user's activity
 */
export type ActivityVisibility = 'everyone' | 'followers' | 'private';

/**
 * Message permission options
 * Determines who can send messages to the user
 */
export type MessagePermission = 'everyone' | 'followers' | 'none';

/**
 * User privacy settings
 * Controls visibility and access permissions
 */
export interface PrivacySettings {
    profile_visibility: ProfileVisibility;
    activity_visibility: ActivityVisibility;
    show_attendance_public: boolean;
    allow_follows: boolean;
    allow_messages: MessagePermission;
    show_stats: boolean;
    indexable: boolean;
}

/**
 * User preference settings
 * Controls UI and application behavior
 */
export interface PreferenceSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
}

/**
 * Email change request
 * Requires password verification for security
 */
export interface EmailChangeRequest {
    new_email: string;
    password: string;
}

/**
 * Password change request
 * Requires current password and new password
 */
export interface PasswordChangeRequest {
    current_password: string;
    new_password: string;
}

/**
 * Profile update request
 * For updating user profile information
 */
export interface ProfileUpdateRequest {
    display_name?: string;
    bio?: string;
}

/**
 * Session information
 * Represents an active login session
 */
export interface Session {
    id: string;
    device_name: string;
    device_type: 'web' | 'mobile' | 'tablet' | 'unknown';
    browser: string;
    os: string;
    ip_address: string;
    last_activity: string;
    created_at: string;
    is_current: boolean;
}

/**
 * Two-factor authentication methods
 */
export type TwoFactorMethod = 'authenticator' | 'sms' | 'email' | null;

/**
 * Two-factor authentication settings
 * Tracks 2FA configuration
 */
export interface TwoFactorSettings {
    enabled: boolean;
    method: TwoFactorMethod;
    backup_codes_generated: boolean;
    last_backup_codes_generated?: string;
}

/**
 * OAuth provider types
 */
export type OAuthProvider = 'github' | 'google' | 'spotify' | 'apple';

/**
 * OAuth connection status
 */
export interface OAuthConnection {
    id: string;
    provider: OAuthProvider;
    connected: boolean;
    email?: string;
    username?: string;
    connected_at?: string;
    last_used?: string;
}

/**
 * Notification preference settings
 */
export interface NotificationSettings {
    email_notifications: boolean;
    in_app_notifications: boolean;
    digest_frequency: 'daily' | 'weekly' | 'monthly' | 'never';
    notify_on_follows: boolean;
    notify_on_votes: boolean;
    notify_on_messages: boolean;
}

/**
 * Settings state component props
 * Provides typing for settings component state
 */
export interface SettingsComponentState {
    loading: boolean;
    saving: boolean;
    error: string | null;
    success: boolean;
}

/**
 * Settings API response
 * Standard response format from settings endpoints
 */
export interface SettingsResponse<T> {
    data: T;
    message?: string;
    status: 'success' | 'error';
}

/**
 * Settings panel configuration
 * Describes each settings panel
 */
export interface SettingsPanelConfig {
    key: string;
    label: string;
    description: string;
    icon?: string;
    requiredAuth?: boolean;
}

/**
 * Settings section union type
 * All possible settings sections
 */
export type SettingsSection =
    | 'profile'
    | 'account'
    | 'privacy'
    | 'preferences'
    | 'sessions'
    | 'security'
    | 'connections'
    | 'data';

/**
 * Settings section mapping
 * Maps section keys to their configurations
 */
export const SETTINGS_SECTIONS: Record<SettingsSection, SettingsPanelConfig> = {
    profile: {
        key: 'profile',
        label: 'Profile',
        description: 'Display name, bio, avatar',
        requiredAuth: true
    },
    account: {
        key: 'account',
        label: 'Account',
        description: 'Email, password, authentication',
        requiredAuth: true
    },
    privacy: {
        key: 'privacy',
        label: 'Privacy',
        description: 'Visibility and notification settings',
        requiredAuth: true
    },
    preferences: {
        key: 'preferences',
        label: 'Preferences',
        description: 'Theme, language, timezone',
        requiredAuth: true
    },
    sessions: {
        key: 'sessions',
        label: 'Sessions',
        description: 'Active login sessions and devices',
        requiredAuth: true
    },
    security: {
        key: 'security',
        label: 'Security',
        description: 'Two-factor authentication',
        requiredAuth: true
    },
    connections: {
        key: 'connections',
        label: 'Connections',
        description: 'Connected apps and accounts',
        requiredAuth: true
    },
    data: {
        key: 'data',
        label: 'Data',
        description: 'Export and delete your data',
        requiredAuth: true
    }
};

/**
 * Validation result type
 * For form validation
 */
export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

/**
 * Settings form event handlers
 * Standard handlers for settings components
 */
export interface SettingsFormHandlers {
    onSave: () => Promise<void>;
    onCancel?: () => void;
    onError?: (error: string) => void;
    onSuccess?: (message: string) => void;
}
