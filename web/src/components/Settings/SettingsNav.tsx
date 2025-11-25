type SettingsSection = 'profile' | 'account' | 'privacy' | 'preferences' | 'sessions' | 'security' | 'connections' | 'data';

interface SettingsNavProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const sections: { key: SettingsSection; label: string; description: string }[] = [
  { key: 'profile', label: 'Profile', description: 'Display name, bio, avatar' },
  { key: 'account', label: 'Account', description: 'Email, password, authentication' },
  { key: 'privacy', label: 'Privacy', description: 'Visibility and notification settings' },
  { key: 'preferences', label: 'Preferences', description: 'Theme, language, timezone' },
  { key: 'sessions', label: 'Sessions', description: 'Active login sessions and devices' },
  { key: 'security', label: 'Security', description: 'Two-factor authentication' },
  { key: 'connections', label: 'Connections', description: 'Connected apps and accounts' },
  { key: 'data', label: 'Data', description: 'Export and delete your data' },
];

export default function SettingsNav({ activeSection, onSectionChange }: SettingsNavProps) {
  return (
    <nav className="space-y-2">
      {sections.map((section) => {
        const isActive = activeSection === section.key;
        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onSectionChange(section.key)}
            className={`w-full text-left p-3 border transition ${
              isActive
                ? 'border-[var(--accent-primary)] bg-[var(--bg-secondary)]'
                : 'border-[var(--border-subtle)] hover:border-[var(--accent-primary)]'
            }`}
          >
            <div className="font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] font-semibold">
              {section.label}
            </div>
            <div className="text-[12px] text-[var(--text-tertiary)]">{section.description}</div>
          </button>
        );
      })}
    </nav>
  );
}
