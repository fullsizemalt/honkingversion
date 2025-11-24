import { useEffect, useState } from "react";

type PrefKey =
  | "email_notifications"
  | "digest_frequency"
  | "in_app_notifications"
  | "do_not_disturb";

type Prefs = Record<PrefKey, string | boolean>;

const DEFAULT_PREFS: Prefs = {
  email_notifications: true,
  digest_frequency: "weekly",
  in_app_notifications: true,
  do_not_disturb: "off",
};

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem("hv_notification_prefs");
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Prefs) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: Prefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("hv_notification_prefs", JSON.stringify(prefs));
  } catch {
    // ignore storage failures
  }
}

export function PrefsForm() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  const updatePref = (key: PrefKey, value: string | boolean) => {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    savePrefs(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  return (
    <div className="space-y-6 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-[var(--text-primary)]">
            Notification Preferences
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Control how you’re notified about follows, votes, and mentions.
          </p>
        </div>
        {saved && (
          <span className="text-xs text-green-400 font-[family-name:var(--font-ibm-plex-mono)]">
            Saved
          </span>
        )}
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!prefs.email_notifications}
            onChange={(e) => updatePref("email_notifications", e.target.checked)}
          />
          <span className="text-sm text-[var(--text-primary)]">Email notifications</span>
        </label>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] mb-1">
            Digest frequency
          </p>
          <select
            value={prefs.digest_frequency as string}
            onChange={(e) => updatePref("digest_frequency", e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-2 text-[var(--text-primary)]"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="off">Off</option>
          </select>
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={!!prefs.in_app_notifications}
            onChange={(e) => updatePref("in_app_notifications", e.target.checked)}
          />
          <span className="text-sm text-[var(--text-primary)]">In-app notifications</span>
        </label>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] mb-1">
            Do Not Disturb
          </p>
          <select
            value={prefs.do_not_disturb as string}
            onChange={(e) => updatePref("do_not_disturb", e.target.value)}
            className="bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-2 text-[var(--text-primary)]"
          >
            <option value="off">Off</option>
            <option value="evenings">Evenings</option>
            <option value="overnight">Overnight</option>
          </select>
        </div>
      </div>
    </div>
  );
}
