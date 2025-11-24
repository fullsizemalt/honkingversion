import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Review, Show } from "@/types";
import { saveLocalReviews, loadLocalReviews } from "@/lib/mockReviews";

const MIN_LENGTH = 60;
const PROFANITY = ["damn", "shit", "fuck"]; // basic stub

function hasProfanity(text: string) {
  const lower = text.toLowerCase();
  return PROFANITY.some((w) => lower.includes(w));
}

interface ReviewComposerProps {
  onSubmit?: (review: Review) => void;
  defaultShow?: Show;
}

export function ReviewComposer({ onSubmit, defaultShow }: ReviewComposerProps) {
  const router = useRouter();
  const [rating, setRating] = useState(8);
  const [blurb, setBlurb] = useState("");
  const [body, setBody] = useState("");
  const [showDate, setShowDate] = useState(defaultShow?.date || "");
  const [showVenue, setShowVenue] = useState(defaultShow?.venue || "");
  const [error, setError] = useState<string | null>(null);
  const remaining = Math.max(0, MIN_LENGTH - body.length);

  useEffect(() => {
    if (defaultShow) {
      setShowDate(defaultShow.date);
      setShowVenue(defaultShow.venue);
    }
  }, [defaultShow]);

  const handleSubmit = () => {
    setError(null);
    if (body.trim().length < MIN_LENGTH) {
      setError(`Review must be at least ${MIN_LENGTH} characters (need ${remaining} more).`);
      return;
    }
    if (hasProfanity(body) || hasProfanity(blurb)) {
      setError("Please remove profanity before submitting.");
      return;
    }
    if (!showDate || !showVenue) {
      setError("Show date and venue are required.");
      return;
    }

    const review: Review = {
      id: Date.now(),
      rating,
      blurb: blurb.trim(),
      full_review: body.trim(),
      created_at: new Date().toISOString(),
      user: { id: 0, username: "you", created_at: new Date().toISOString() },
      show: {
        id: Number(Date.now()),
        date: showDate,
        venue: showVenue,
        location: "",
      },
    };

    const locals = loadLocalReviews();
    const next = [review, ...locals];
    saveLocalReviews(next);
    onSubmit?.(review);
    router.push("/reviews");
  };

  const charColor = useMemo(() => {
    if (body.length === 0) return "text-[var(--text-tertiary)]";
    return body.length >= MIN_LENGTH ? "text-green-400" : "text-amber-400";
  }, [body.length]);

  return (
    <div className="space-y-4 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 rounded">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] mb-2">
            Show Date
          </label>
          <input
            value={showDate}
            onChange={(e) => setShowDate(e.target.value)}
            placeholder="YYYY-MM-DD"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text-primary)]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] mb-2">
            Venue
          </label>
          <input
            value={showVenue}
            onChange={(e) => setShowVenue(e.target.value)}
            placeholder="Venue name"
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text-primary)]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] mb-2">
            Rating (1–10)
          </label>
          <input
            type="number"
            min={1}
            max={10}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text-primary)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] mb-2">
          Short summary (optional)
        </label>
        <input
          value={blurb}
          onChange={(e) => setBlurb(e.target.value)}
          placeholder="One-liner"
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text-primary)]"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-[family-name:var(--font-ibm-plex-mono)] mb-2">
          Full Review
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          placeholder="Share details, highlights, and why it mattered..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-[var(--text-primary)] resize-vertical"
        />
        <div className={`text-xs mt-1 font-[family-name:var(--font-ibm-plex-mono)] ${charColor}`}>
          {body.length}/{MIN_LENGTH} characters
        </div>
      </div>

      {error && (
        <div className="text-sm text-amber-400 font-[family-name:var(--font-ibm-plex-mono)]">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="px-5 py-2 rounded bg-[var(--accent-primary)] text-[var(--text-inverse)] font-[family-name:var(--font-space-grotesk)] font-bold text-sm hover:opacity-90"
        >
          Publish Review
        </button>
        <button
          onClick={() => router.push('/reviews')}
          className="px-5 py-2 rounded border border-[var(--border)] text-[var(--text-secondary)] font-[family-name:var(--font-space-grotesk)] font-bold text-sm hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
