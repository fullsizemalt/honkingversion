import { Tag } from './tag';

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
