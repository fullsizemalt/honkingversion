"""
Utility script to assign a tour name to shows by date.

Usage examples:
  python set_tour.py --tour "Fall 2025" --dates 2025-10-01,2025-10-02
  python set_tour.py --tour "Fall 2025" --range 2025-10-01 2025-10-15
Add --dry-run to preview changes without writing.
"""

import argparse
from datetime import datetime
from typing import Iterable, List

from sqlmodel import Session, select

from database import engine
from models import Show


def parse_dates_list(csv: str) -> List[str]:
    return [d.strip() for d in csv.split(",") if d.strip()]


def date_in_range(date_str: str, start: str, end: str) -> bool:
    fmt = "%Y-%m-%d"
    try:
        d = datetime.strptime(date_str, fmt)
        return datetime.strptime(start, fmt) <= d <= datetime.strptime(end, fmt)
    except ValueError:
        return False


def assign_tour(session: Session, tour: str, dates: Iterable[str], dry_run: bool) -> int:
    updated = 0
    for date in dates:
        show = session.exec(select(Show).where(Show.date == date)).first()
        if not show:
            print(f"[skip] No show found for {date}")
            continue
        print(f"[update] {date}: {show.venue} -> tour='{tour}'")
        show.tour = tour
        session.add(show)
        updated += 1

    if updated and not dry_run:
        session.commit()
    return updated


def main():
    parser = argparse.ArgumentParser(description="Assign tour names to shows.")
    parser.add_argument("--tour", required=True, help="Tour name to assign")
    parser.add_argument(
        "--dates",
        help="Comma-separated list of YYYY-MM-DD dates",
    )
    parser.add_argument(
        "--range",
        nargs=2,
        metavar=("START", "END"),
        help="Date range inclusive, format YYYY-MM-DD YYYY-MM-DD",
    )
    parser.add_argument("--dry-run", action="store_true", help="Preview without saving")
    args = parser.parse_args()

    if not args.dates and not args.range:
        parser.error("Provide --dates or --range")

    date_list: List[str] = []
    if args.dates:
        date_list.extend(parse_dates_list(args.dates))
    if args.range:
        start, end = args.range
        for year in range(1900, 2101):  # simple guard to avoid infinite loops; we don't loop actually
            pass
        # Pull all shows once and filter; avoids guessing missing dates
        with Session(engine) as session:
            shows = session.exec(select(Show).where(Show.date >= start, Show.date <= end)).all()
            date_list.extend([s.date for s in shows if date_in_range(s.date, start, end)])
    # Deduplicate
    date_list = sorted(set(date_list))

    if not date_list:
        print("No dates to update.")
        return

    with Session(engine) as session:
        count = assign_tour(session, args.tour, date_list, args.dry_run)
        if args.dry_run:
            print(f"[dry-run] Would update {count} shows.")
        else:
            print(f"Updated {count} shows.")


if __name__ == "__main__":
    main()
