export interface Tag {
    id: number;
    name: string;
    category?: string;
    color?: string;
    description?: string;
    is_private?: boolean;
    owner_user_id?: number | null;
    created_at?: string;
}
