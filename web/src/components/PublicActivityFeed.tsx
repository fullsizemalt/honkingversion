'use client';

import { useState } from 'react';
import ActivityFeed from './ActivityFeed';
import { getApiEndpoint } from '@/lib/api';

interface PublicActivityFeedProps {
    initialActivities: any[];
    username: string;
    title: string;
}

export default function PublicActivityFeed({ initialActivities, username, title }: PublicActivityFeedProps) {
    const [activities, setActivities] = useState(initialActivities);
    const [filter, setFilter] = useState('all');

    const handleFilterChange = async (newFilter: string) => {
        setFilter(newFilter);
        try {
            const res = await fetch(getApiEndpoint(`/profile/${username}/activity?filter=${newFilter}`));
            if (res.ok) {
                const data = await res.json();
                setActivities(data);
            }
        } catch (error) {
            console.error('Failed to fetch activity:', error);
        }
    };

    return (
        <ActivityFeed
            activities={activities}
            title={title}
            currentFilter={filter}
            onFilterChange={handleFilterChange}
        />
    );
}
