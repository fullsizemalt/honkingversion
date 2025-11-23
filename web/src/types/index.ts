import { Tag } from './tag';

export interface Song {
    id?: number;
    name: string;
    slug: string;
    artist?: string;
    is_cover?: boolean;
    original_artist?: string;
    tags?: Tag[];
}

export interface Show {
    id?: number;
    elgoose_id?: number;
    date: string;
    venue: string;
    location: string;
    setlist_data?: string;
    source?: string;
    tags?: Tag[];
}

// ... (Setlist, Song, SongPerformance interfaces remain unchanged)

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
    tags?: Tag[];
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
    is_following?: boolean;
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

export interface Comment {
    id: number;
    vote_id: number;
    user_id: number;
    username: string;
    body: string;
    upvotes: number;
    parent_id?: number | null;
    created_at: string;
    replies?: Comment[];
}

export interface Notification {
    id: number;
    type: string;
    actor_username?: string | null;
    object_type: string;
    object_id: number;
    read_at?: string | null;
    created_at: string;
}

export interface StatsResponse {
    top_songs: { name: string; slug: string; plays: number }[];
    top_venues: { venue: string; show_count: number }[];
    trending_performances: {
        performance_id: number;
        song_name: string;
        date: string;
        venue: string;
        votes_last_30d: number;
        avg_rating?: number | null;
    }[];
    leaderboards: {
        votes_cast: { username: string; votes: number }[];
        followers: { username: string; followers: number }[];
    };
}
