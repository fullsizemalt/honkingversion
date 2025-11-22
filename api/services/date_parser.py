import re
from datetime import datetime

class DateParser:
    """
    Parses dates from text.
    Supported formats:
    - MM/DD/YYYY (e.g., 12/31/2022)
    - Month Day, Year (e.g., January 1, 2023; Jan 1, 23)
    - YYYY-MM-DD (ISO format)
    """

    # Regex patterns
    PATTERNS = [
        # MM/DD/YYYY or M/D/YYYY
        r'\b(\d{1,2})/(\d{1,2})/(\d{4})\b',
        # YYYY-MM-DD
        r'\b(\d{4})-(\d{1,2})-(\d{1,2})\b',
        # Month Day, Year (Full or Abbreviated Month)
        # Matches: "January 1, 2023", "Jan 1, 2023", "Jan 1, 23"
        r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),?\s+(\d{2,4})\b'
    ]

    MONTH_MAP = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12
    }

    @staticmethod
    def parse_text(text):
        """
        Finds all valid dates in the text and returns a list of datetime objects.
        """
        dates = []
        
        # MM/DD/YYYY
        for match in re.finditer(DateParser.PATTERNS[0], text):
            try:
                month, day, year = map(int, match.groups())
                dates.append(datetime(year, month, day))
            except ValueError:
                continue # Invalid date like 13/32/2023

        # YYYY-MM-DD
        for match in re.finditer(DateParser.PATTERNS[1], text):
            try:
                year, month, day = map(int, match.groups())
                dates.append(datetime(year, month, day))
            except ValueError:
                continue

        # Month Day, Year
        for match in re.finditer(DateParser.PATTERNS[2], text, re.IGNORECASE):
            try:
                month_str, day, year_str = match.groups()
                month = DateParser.MONTH_MAP[month_str[:3].lower()]
                day = int(day)
                year = int(year_str)
                
                # Handle 2-digit year
                if year < 100:
                    year += 2000 # Assume 20xx
                
                dates.append(datetime(year, month, day))
            except ValueError:
                continue

        return sorted(list(set(dates))) # Return unique sorted dates

def parse_date(text):
    """
    Helper function to return the first parsed date from text.
    """
    dates = DateParser.parse_text(text)
    return dates[0] if dates else None
