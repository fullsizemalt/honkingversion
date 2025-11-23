export interface UserList {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    items: string | any[]; // JSON string of items or array in-memory
    list_type: 'performances' | 'shows' | 'songs' | string;
    share_token?: string | null;
    is_public?: boolean;
    created_at: string;
}
