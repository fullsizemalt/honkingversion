import { Tag } from './tag';

export interface Song {
    id?: number;
    name: string;
    slug: string;
    artist?: string;
    is_cover?: boolean;
    original_artist?: string;
    tags?: Tag[];
    times_played?: number;
    avg_rating?: number | null | undefined;
    debut_date?: string;
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
    avg_rating?: number | null | undefined;
    honking_vote_count?: number; // Number of users who voted this as "the honking version"
    is_honking_version?: boolean; // Whether this is the current honking version (most votes)
    tags?: Tag[];
}

export interface HonkingVersionData {
    song_id: number;
    honking_version?: {
        id: number;
        performance_id: number;
        song_id: number;
        show_id: number;
        position?: number;
        set_number?: number;
        notes?: string;
        honking_votes: number;
    };
    honking_votes: Array<{
        performance_id: number;
        vote_count: number;
    }>;
    user_honking_vote?: {
        performance_id: number;
        created_at: string;
        updated_at: string;
    };
}

export interface User {
    id: number;
    username: string;
    email?: string;
    created_at: string;
    display_name?: string;
    bio?: string;
    profile_picture_url?: string;
    role?: string;
    social_links?: {
        bluesky?: string;
        instagram?: string;
        custom_url?: string;
    };
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
        avg_rating?: number | null | undefined;
    }[];
    leaderboards: {
        votes_cast: { username: string; votes: number }[];
        followers: { username: string; followers: number }[];
    };
    recent_comments?: {
        blurb: string;
        username: string;
        song_name: string;
        show_date: string;
        venue: string;
        created_at?: string;
    }[];
    new_submissions?: {
        performance_id: number;
        song_name: string;
        date: string;
        venue: string;
        vote_count: number;
        avg_rating?: number | null | undefined;
    }[];
}
