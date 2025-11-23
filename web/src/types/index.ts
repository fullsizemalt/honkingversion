export interface Show {
    id?: number;
    elgoose_id?: number;
    date: string;
    venue: string;
    location: string;
    setlist_data?: string;
    source?: string;
}

export interface Setlist {
    date: string;
    venue: string;
    location: string;
    sets: { [key: string]: string[] };
}

export interface Song {
    id: number;
    name: string;
    artist: string;
    slug: string;
    debut_date?: string;
    times_played: number;
    avg_rating?: number;
    is_cover: boolean;
    original_artist?: string;
}

export interface SongPerformance {
    id: number;
    song_id: number;
    show_id: number;
    position: number;
    set_number: number;
    notes?: string;
}

export interface Performance {
    id: number;
    position: number;
    set_number: number;
    notes?: string;
    song: {
        id: number;
        name: string;
        slug: string;
        is_cover: boolean;
        original_artist?: string;
    };
    show: {
        id: number;
        date: string;
        venue: string;
        location: string;
    };
    vote_count: number;
    avg_rating?: number;
}

export interface User {
    id: number;
    username: string;
    email?: string;
    created_at: string;
    stats?: {
        shows_attended: number;
        reviews_count: number;
        followers_count: number;
        following_count: number;
    };
}

export interface Review {
    id: number;
    user: User;
    show?: Show;
    performance?: Performance;
    rating: number;
    blurb?: string;
    full_review?: string;
    created_at: string;
}
