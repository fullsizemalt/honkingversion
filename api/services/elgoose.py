import requests
from datetime import datetime

class SetlistClient:
    BASE_URL = "https://elgoose.net/api/v2/setlists/showdate"

    @staticmethod
    def get_setlist(date_obj):
        """
        Fetches the setlist for a given date.
        Args:
            date_obj (datetime): The date to search for.
        Returns:
            str: Formatted setlist string or None if no show found.
        """
        date_str = date_obj.strftime("%Y-%m-%d")
        url = f"{SetlistClient.BASE_URL}/{date_str}.json"
        
        try:
            response = requests.get(url)
            if response.status_code == 200:
                response_data = response.json()
                # Check if it's the wrapper format
                if isinstance(response_data, dict) and 'data' in response_data:
                    if response_data.get('error') and response_data['error'] != 0:
                        return None
                    data = response_data['data']
                else:
                    # Fallback if it returns list directly (unlikely based on debug, but good for safety)
                    data = response_data

                if not data:
                    return None
                return SetlistClient._format_setlist(data)
            else:
                # 204 or 404 means no content/not found
                return None
        except Exception as e:
            print(f"Error fetching setlist: {e}")
            return None

    @staticmethod
    def get_show_links(show_id):
        """
        Fetches links for a given show ID.
        """
        url = f"https://elgoose.net/api/v2/links/show_id/{show_id}.json"
        try:
            response = requests.get(url)
            if response.status_code == 200:
                response_data = response.json()
                if isinstance(response_data, dict) and 'data' in response_data:
                    return response_data['data']
            return []
        except Exception:
            return []

    @staticmethod
    def _format_setlist(data):
        """
        Formats the API response into a Reddit-friendly string.
        """
        if not data:
            return None

        # Extract show info from the first item
        first_item = data[0]
        venue = first_item.get('venuename', 'Unknown Venue')
        city = first_item.get('city', 'Unknown City')
        state = first_item.get('state', '')
        location = f"{city}, {state}" if state else city
        date_display = datetime.strptime(first_item.get('showdate'), "%Y-%m-%d").strftime("%B %d, %Y")
        show_id = first_item.get('show_id') or first_item.get('showid') # API might vary

        # Fetch links if show_id is available
        bandcamp_link = None
        if show_id:
            links = SetlistClient.get_show_links(show_id)
            for link in links:
                if 'bandcamp' in link.get('url', '').lower() or 'bandcamp' in link.get('description', '').lower():
                    bandcamp_link = link['url']
                    break
        
        # Group songs by set
        sets = {}
        for item in data:
            set_name = item.get('setname', 'Set 1')
            song_name = item.get('songname')
            if not song_name:
                continue
            
            if set_name not in sets:
                sets[set_name] = []
            sets[set_name].append(song_name)

        # Build the output string
        lines = []
        lines.append(f"**Goose Setlist: {date_display}**")
        lines.append(f"**Venue:** {venue}")
        lines.append(f"**Location:** {location}")
        lines.append("")
        
        for set_name, songs in sets.items():
            lines.append(f"**{set_name}:**")
            lines.append(", ".join(songs))
            lines.append("")
            
        if bandcamp_link:
            lines.append(f"[Listen on Bandcamp]({bandcamp_link})")
            
        lines.append(f"[More Info](https://elgoose.net/setlists/{first_item.get('showdate')})")
        
        return "\n".join(lines)
