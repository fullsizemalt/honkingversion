from typing import List, Dict, Optional
from models import UserBadge

class SystemBadge:
    def __init__(self, id: str, name: str, description: str, icon: str, criteria: str):
        self.id = id
        self.name = name
        self.description = description
        self.icon = icon
        self.criteria = criteria

SYSTEM_BADGES = [
    SystemBadge(
        id="first_show",
        name="First Show",
        description="Attended your first Goose show",
        icon="🎫",
        criteria="Attend 1 show"
    ),
    SystemBadge(
        id="tour_veteran",
        name="Tour Veteran",
        description="Attended 10 or more shows",
        icon="🚌",
        criteria="Attend 10 shows"
    ),
    SystemBadge(
        id="road_warrior",
        name="Road Warrior",
        description="Attended 50 or more shows",
        icon="🛣️",
        criteria="Attend 50 shows"
    ),
    SystemBadge(
        id="reviewer",
        name="Reviewer",
        description="Wrote your first show review",
        icon="📝",
        criteria="Write 1 review"
    ),
    SystemBadge(
        id="critic",
        name="Critic",
        description="Wrote 10 or more show reviews",
        icon="🧐",
        criteria="Write 10 reviews"
    ),
    SystemBadge(
        id="list_maker",
        name="List Maker",
        description="Created your first list",
        icon="📋",
        criteria="Create 1 list"
    ),
    SystemBadge(
        id="curator",
        name="Curator",
        description="Created 5 or more lists",
        icon="🏛️",
        criteria="Create 5 lists"
    ),
    SystemBadge(
        id="early_adopter",
        name="Early Adopter",
        description="Joined during the beta phase",
        icon="🚀",
        criteria="Join before 2026"
    )
]

def get_all_system_badges() -> List[Dict]:
    """Return all system badges as a list of dictionaries"""
    return [
        {
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "icon": b.icon,
            "criteria": b.criteria
        }
        for b in SYSTEM_BADGES
    ]

def get_badge_by_id(badge_id: str) -> Optional[SystemBadge]:
    """Get a system badge by its ID"""
    for badge in SYSTEM_BADGES:
        if badge.id == badge_id:
            return badge
    return None
