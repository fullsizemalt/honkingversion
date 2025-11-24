import Link from "next/link";
import { ReactNode } from "react";

type ErrorAction =
  | { label: string; href: string; variant?: "primary" | "secondary" }
  | { label: string; onClick: () => void; variant?: "primary" | "secondary" };

interface ErrorLayoutProps {
  code?: string;
  title: string;
  message: string;
  icon?: ReactNode;
  helpText?: string;
  actions?: ErrorAction[];
  children?: ReactNode;
}

const buttonClass = (variant?: "primary" | "secondary") =>
  variant === "secondary"
    ? "font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-secondary)] border border-[var(--border)] px-6 py-3 rounded-full hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-colors"
    : "font-[family-name:var(--font-space-grotesk)] text-sm font-bold text-[var(--text-inverse)] bg-[var(--accent-primary)] px-6 py-3 rounded-full hover:opacity-90 transition-colors";

export function ErrorLayout({
  code,
  title,
  message,
  icon,
  helpText,
  actions = [],
  children,
}: ErrorLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl space-y-4">
        {icon && <div className="flex justify-center">{icon}</div>}
        {code && (
          <div className="font-[family-name:var(--font-space-grotesk)] text-5xl font-bold text-[var(--accent-primary)] tracking-tight">
            {code}
          </div>
        )}
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold text-[var(--text-primary)]">
          {title}
        </h1>
        <p className="font-[family-name:var(--font-ibm-plex-mono)] text-[var(--text-secondary)]">
          {message}
        </p>
        {children}
        {helpText && (
          <p className="text-sm text-[var(--text-tertiary)]">{helpText}</p>
        )}
        {actions.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            {actions.map((action, idx) =>
              "href" in action ? (
                <Link
                  key={idx}
                  href={action.href}
                  className={buttonClass(action.variant)}
                >
                  {action.label}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className={buttonClass(action.variant)}
                >
                  {action.label}
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
