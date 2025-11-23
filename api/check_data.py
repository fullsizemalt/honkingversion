from sqlmodel import Session, select, col
from database import engine
from models import Song, Show

def check_data():
    with Session(engine) as session:
        songs = session.exec(select(Song)).all()
        print(f"Total Songs: {len(songs)}")
        for song in songs[:5]:
            print(f"Song: {song.name}")

        shows = session.exec(select(Show)).all()
        print(f"Total Shows: {len(shows)}")
        for show in shows[:5]:
            print(f"Show: {show.date} - {show.venue}")

        # Test Search
        print("\nTesting Search Logic:")
        query_str = "%Arcadia%"
        search_songs = session.exec(select(Song).where(col(Song.name).like(query_str))).all()
        print(f"Search 'Arcadia': Found {len(search_songs)} songs")
        for s in search_songs:
            print(f" - {s.name}")

        query_str_2 = "%2023%"
        search_shows = session.exec(select(Show).where(col(Show.venue).like(query_str_2) | col(Show.location).like(query_str_2))).all() # Wait, 2023 is date, not venue/location
        # My search logic for shows was venue or location.
        # But I searched for 2023.
        # Ah, I need to search date too? Or just accept that 2023 won't match venue/location.
        
        print(f"Search '2023' in Venue/Location: Found {len(search_shows)} shows")


if __name__ == "__main__":
    check_data()
