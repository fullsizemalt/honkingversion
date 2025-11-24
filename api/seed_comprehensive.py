#!/usr/bin/env python3
"""
Comprehensive database seeding script with diverse user personas and 3 months of historical data.
User types: casuals, hardcore, god level, rail riders, run club, experts, jam aficionados, haters
"""

from datetime import datetime, timedelta
from typing import List, Tuple
import random
import hashlib
from sqlmodel import Session, select
from database import engine, get_session
from models import User, Show, Song, SongPerformance, Vote, UserFollow, UserList

# ==================== USER PERSONAS ====================

USER_PERSONAS = {
    "casual": {
        "count": 15,
        "base_votes_per_month": 8,
        "rating_preference": lambda: random.randint(6, 9),
        "follow_ratio": 0.2,
        "blurbs": [
            "Great vibes!",
            "Had fun at this one",
            "Nice energy",
            "Solid set",
            "Enjoyed it",
            "Fun show",
            "Good times",
            "Liked it",
        ]
    },
    "hardcore": {
        "count": 12,
        "base_votes_per_month": 25,
        "rating_preference": lambda: random.choices([i for i in range(1, 11)], weights=[1,1,2,3,4,5,5,4,3,2])[0],
        "follow_ratio": 0.5,
        "blurbs": [
            "Incredible chemistry between band members",
            "One of the tightest performances I've seen",
            "Peak Goose energy",
            "Flawless execution",
            "The way they built that jam was magical",
            "Precision and passion combined",
            "Album quality performance",
            "This is why we follow the band",
        ]
    },
    "god": {
        "count": 3,
        "base_votes_per_month": 40,
        "rating_preference": lambda: (10 if random.random() > 0.3 else random.randint(7, 9)),
        "follow_ratio": 0.8,
        "blurbs": [
            "Transcendent. This will be remembered as one of the defining performances of the era.",
            "The interplay here is beyond description. Pure musical conversation.",
            "This performance elevated the song to new dimensions.",
            "Every note, every pause, every transition was intentional and perfect.",
            "Career-defining moment captured forever.",
            "This is what live music is meant to feel like.",
            "Standing ovation energy",
            "Masterclass in improvisation and arrangement",
        ]
    },
    "rail": {
        "count": 8,
        "base_votes_per_month": 35,
        "rating_preference": lambda: random.choices([i for i in range(1, 11)], weights=[1,1,1,2,2,3,4,5,4,4])[0],
        "follow_ratio": 0.7,
        "blurbs": [
            "Caught this from the rail - unforgettable perspective",
            "Best view of the summer",
            "The energy hit different from where I was standing",
            "Rail riding through this one was special",
            "Nothing beats being up close for a show like this",
            "Front row magic",
            "The connection from the rail was real",
            "This is why we rail ride",
        ]
    },
    "run": {
        "count": 10,
        "base_votes_per_month": 20,
        "rating_preference": lambda: random.randint(6, 10),
        "follow_ratio": 0.6,
        "blurbs": [
            "Run club was lit for this one!",
            "Squad was feeling it",
            "Crew energy was immaculate",
            "We all left on cloud nine",
            "The whole crew was vibing",
            "Best night with the fam",
            "Run club approves",
            "This one brought the crew together",
        ]
    },
    "expert": {
        "count": 7,
        "base_votes_per_month": 30,
        "rating_preference": lambda: random.choices([i for i in range(1, 11)], weights=[2,2,2,3,3,3,3,3,2,1])[0],
        "follow_ratio": 0.7,
        "blurbs": [
            "Technically impressive with sophisticated arrangement choices",
            "The modulation in the second jam segment was unexpected and brilliant",
            "Their use of dynamics here showed real growth as musicians",
            "This performance demonstrates why they're one of the best live bands",
            "Masterful control of tempo and groove throughout",
            "The composition work paired perfectly with their improvisational abilities",
        ]
    },
    "jam": {
        "count": 9,
        "base_votes_per_month": 28,
        "rating_preference": lambda: random.choices([i for i in range(1, 11)], weights=[1,1,2,3,4,5,5,5,4,3])[0],
        "follow_ratio": 0.65,
        "blurbs": [
            "The jam in the middle third was everything",
            "That exploratory section took me on a journey",
            "The way they got out of that jam was chef's kiss",
            "Built to an absolutely climactic peak",
            "The groove never let up during the extended section",
            "Raw jam energy for the whole duration",
            "This is the kind of improvisation jam bands are known for",
            "Every musician was in the zone during that jam",
        ]
    },
    "hater": {
        "count": 5,
        "base_votes_per_month": 15,
        "rating_preference": lambda: random.choices([i for i in range(1, 11)], weights=[5,4,3,2,2,1,1,0,0,0])[0],
        "follow_ratio": 0.1,
        "blurbs": [
            "Not their best work",
            "Could've been better",
            "Felt phoned in",
            "The sound was off",
            "Didn't work for me",
            "They've done it better before",
            "This one missed the mark",
            "Not feeling this version",
            "Disappointed honestly",
        ]
    },
}

COMMENT_BLURBS = {
    "casual": [
        "Same here!",
        "Yes!",
        "Totally agree",
        "Facts",
        "Love this take",
        "Couldn't have said it better",
        "+1",
    ],
    "hardcore": [
        "The musical maturity on display here is incredible",
        "This performance exemplifies their growth as artists",
        "I've been following them for years and this ranks in the top 10",
        "The interaction between [musician] and [musician] was telepathic",
        "This deserves to be on a best-of compilation",
    ],
    "god": [
        "Absolute peak performance",
        "This will define their legacy",
        "Every element aligned perfectly",
        "Transcendent",
    ],
    "rail": [
        "Felt this energy from the rail!",
        "The connection was real from the front",
        "Best seat in the house vibes",
    ],
    "run": [
        "Squad was living for this",
        "Crew was so hyped",
        "Run club moment right here",
    ],
    "expert": [
        "Technically masterful",
        "The compositional choices here are smart",
        "Their musicianship shines through",
    ],
    "jam": [
        "The jam here was pristine",
        "Built beautifully",
        "That improvisational section was perfect",
    ],
    "hater": [
        "Not as good as [other version]",
        "Could've done better",
        "Disagree completely",
    ]
}


def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()


# Goose-themed user names mapped to personas
GOOSE_NAMES = {
    "casual": [
        "TreeDancer", "VenueVibe", "RoadRunner", "GrooveWalker", "SoundSeeker",
        "EchoChaser", "TuneLover", "StageLight", "RhythmRider", "NoteWatcher",
        "JourneyJack", "StreamFlow", "BeatKeeper", "VenueWanderer", "MusicMuse"
    ],
    "hardcore": [
        "JamMaster", "ShowCollector", "TapedTruth", "PeakChaser", "SetList",
        "VenueVeteran", "DeepDiver", "TourFollower", "LegacyHunter", "SonicSeeker",
        "PerfectionPhil", "HistoryKeep", "EchosForever"
    ],
    "god": [
        "OracleOne", "CosmicCarl", "ZenMaster"
    ],
    "rail": [
        "FrontRowFrank", "RailRunner", "StageSide", "CloseCall", "FrontlineFelix",
        "RiseSide", "ViewVince", "PerspectivePete", "CloseCaller", "RailRider"
    ],
    "run": [
        "CrewMate", "SquadLead", "BandBro", "PackRunner", "CrewChief",
        "TribalTone", "FamilyFirst", "GroupGroove", "CrewCalling", "Posse"
    ],
    "expert": [
        "MusicalMind", "AnalysisAlex", "ToneSmith", "HarmonyHank", "ProAcoustic",
        "ComposerClass", "TechnicalTim", "CraftCure"
    ],
    "jam": [
        "JamJourney", "ImprovisedIan", "ExtendedEric", "ExploreEmi", "FlowFinder",
        "BuildUp", "ClimbingCliff", "LongFormLarry", "SectionSeeker", "ZoneZeke"
    ],
    "hater": [
        "CriticalCurt", "ScepticalSal", "DissDeclan", "NaysayerNed", "QuestionMark"
    ]
}


def get_goose_username(persona_type: str, index: int) -> str:
    """Get a Goose-themed username for a persona"""
    names = GOOSE_NAMES.get(persona_type, [f"{persona_type}_{index}"])
    # Cycle through available names, repeat if necessary
    return names[index % len(names)]


def create_users(session: Session) -> dict[str, list[User]]:
    """Create users for each persona type with Goose-themed names"""
    print("Creating user personas with Goose-themed names...")
    users_by_type = {}

    for persona_type, config in USER_PERSONAS.items():
        users = []
        for i in range(config["count"]):
            username = get_goose_username(persona_type, i)
            email = f"{username.lower()}@honkingversion.local"

            user = User(
                username=username,
                email=email,
                hashed_password=hash_password(f"password_{username}"),
                created_at=datetime.utcnow() - timedelta(days=random.randint(90, 180))
            )
            session.add(user)
            users.append(user)

        users_by_type[persona_type] = users
        print(f"  Created {len(users)} {persona_type} users")

    session.commit()
    return users_by_type


def get_persona_for_username(username: str) -> str:
    """Determine persona type from username (handles both old and new naming schemes)"""
    # First check if it's an old-style username (casual_1, hardcore_1, etc.)
    first_part = username.split('_')[0]
    if first_part in USER_PERSONAS:
        return first_part

    # Check if it's a Goose-themed name
    for persona_type, names in GOOSE_NAMES.items():
        if username in names:
            return persona_type

    # Default fallback
    return None


def create_follows(session: Session, users_by_type: dict) -> None:
    """Create follow relationships between users"""
    print("Creating follow relationships...")

    all_users = []
    for users in users_by_type.values():
        all_users.extend(users)

    follow_count = 0
    for user in all_users:
        persona_type = get_persona_for_username(user.username)
        if not persona_type or persona_type not in USER_PERSONAS:
            continue

        follow_ratio = USER_PERSONAS[persona_type]["follow_ratio"]

        # Each user follows some other users
        follow_targets = random.sample(
            [u for u in all_users if u.id != user.id],
            k=int(len(all_users) * follow_ratio)
        )

        for target in follow_targets:
            from models import UserFollow
            follow = UserFollow(follower_id=user.id, followed_id=target.id)
            session.add(follow)
            follow_count += 1

    session.commit()
    print(f"  Created {follow_count} follow relationships")


def create_votes_and_reviews(
    session: Session,
    users_by_type: dict,
    shows: List[Show],
    performances: List[SongPerformance]
) -> None:
    """Create votes and reviews spread across 3 months"""
    print("Creating votes and reviews across 3 months...")

    if not performances:
        print("  No performances found to review")
        return

    vote_count = 0
    now = datetime.utcnow()

    for persona_type, users in users_by_type.items():
        config = USER_PERSONAS[persona_type]
        base_votes = config["base_votes_per_month"]
        rating_func = config["rating_preference"]
        blurbs = config["blurbs"]

        for user in users:
            # Generate random number of votes for this user (varied)
            num_votes = int(base_votes * random.uniform(0.5, 1.5))

            for _ in range(num_votes):
                # Random date in last 3 months
                days_ago = random.randint(0, 89)
                vote_date = now - timedelta(days=days_ago)

                # Pick a random performance
                performance = random.choice(performances)

                # Check if user already voted on this performance
                existing = session.exec(
                    select(Vote).where(
                        (Vote.user_id == user.id) &
                        (Vote.performance_id == performance.id)
                    )
                ).first()

                if existing:
                    continue

                rating = rating_func()
                blurb = random.choice(blurbs)

                vote = Vote(
                    user_id=user.id,
                    performance_id=performance.id,
                    show_id=performance.show_id,
                    rating=rating,
                    blurb=blurb,
                    created_at=vote_date
                )
                session.add(vote)
                vote_count += 1

    session.commit()
    print(f"  Created {vote_count} votes and reviews")


def main():
    """Main seeding function"""
    print("\n" + "="*60)
    print("COMPREHENSIVE DATABASE SEEDING")
    print("="*60 + "\n")

    session: Session = next(get_session())

    try:
        # Check if users already exist
        existing_users = session.exec(select(User)).all()
        if existing_users and len(existing_users) > 0:
            print(f"Users already exist in database ({len(existing_users)} users). Skipping user creation.")
            # Group existing users by persona type
            users_by_type = {persona: [] for persona in USER_PERSONAS.keys()}
            for user in existing_users:
                persona = get_persona_for_username(user.username)
                if persona and persona in users_by_type:
                    users_by_type[persona].append(user)
        else:
            users_by_type = create_users(session)

        # Create follows
        create_follows(session, users_by_type)

        # Get existing shows and performances
        shows = session.exec(select(Show)).all()
        performances = session.exec(select(SongPerformance)).all()

        if not shows or not performances:
            print("\nWARNING: No shows or performances found!")
            print("Please seed shows and performances first using seed_from_elgoose.py")
        else:
            print(f"\nFound {len(shows)} shows and {len(performances)} performances")
            create_votes_and_reviews(session, users_by_type, shows, performances)

        print("\n" + "="*60)
        print("SEEDING COMPLETE!")
        print("="*60 + "\n")

    except Exception as e:
        print(f"\nERROR during seeding: {e}")
        import traceback
        traceback.print_exc()
        session.rollback()
    finally:
        session.close()


if __name__ == "__main__":
    main()
