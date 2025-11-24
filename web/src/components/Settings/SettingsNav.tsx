type SettingsSection = 'profile' | 'account' | 'privacy';

interface SettingsNavProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const sections: { key: SettingsSection; label: string; description: string }[] = [
  { key: 'profile', label: 'Profile', description: 'Display name, bio, avatar' },
  { key: 'account', label: 'Account', description: 'Email, password, authentication' },
  { key: 'privacy', label: 'Privacy', description: 'Visibility and notification settings' },
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
