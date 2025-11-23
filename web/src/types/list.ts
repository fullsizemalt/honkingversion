export interface UserList {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    items: string; // JSON string of items
    list_type: 'performances' | 'shows';
    share_token?: string | null;
    is_public?: boolean;
    created_at: string;
}
