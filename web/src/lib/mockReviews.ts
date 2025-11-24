import { Review } from "@/types";

export const mockReviews: Review[] = [
  {
    id: 1,
    rating: 9,
    blurb: "Absolute heater — peak jam in set two.",
    full_review:
      "Arcadia opened with a slow build that exploded into a blissy peak. Second set Creatures stretched into Type II territory. Crowd energy was electric.",
    created_at: new Date().toISOString(),
    user: { id: 101, username: "ArcadiaGoose", created_at: new Date().toISOString() },
    show: {
      id: 501,
      date: "2023-10-05",
      venue: "Red Rocks Amphitheatre",
      location: "Morrison, CO",
      setlist_data: "[]",
    },
  },
  {
    id: 2,
    rating: 8,
    blurb: "Great pacing, encore landed hard.",
    full_review:
      "Loved the flow. Tumble closer was tight and the encore had everyone singing. Would love a longer Empress next time.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    user: { id: 102, username: "YetiSpaghetti", created_at: new Date().toISOString() },
    show: {
      id: 502,
      date: "2023-06-22",
      venue: "The Louisville Palace",
      location: "Louisville, KY",
      setlist_data: "[]",
    },
  },
];

export function loadLocalReviews(): Review[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("hv_reviews_local");
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalReviews(reviews: Review[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("hv_reviews_local", JSON.stringify(reviews));
  } catch {
    // ignore storage failures
  }
}
