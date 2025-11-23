export interface UserList {
    id: number;
    user_id: number;
    title: string;
    description?: string;
    items: string; // JSON string of items
    list_type: 'performances' | 'shows';
    created_at: string;
}
