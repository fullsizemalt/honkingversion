'use client';

import React, { useState, useEffect } from 'react';
import { getApiEndpoint } from '@/lib/api';

type FilterOption = {
    label: string;
    value: string;
};

type Filters = {
    venue?: string;
    city?: string;
    state?: string;
    country?: string;
    dow?: string; // day of week 0-6
    dom?: string; // day of month 1-31
    month?: string; // 1-12
    year?: string;
    sort?: string;
    limit?: string;
};

interface FilterBarProps {
    onChange: (filters: Filters) => void;
}

export default function FilterBar({ onChange }: FilterBarProps) {
    const [filters, setFilters] = useState<Filters>({});
    const [venues, setVenues] = useState<FilterOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await fetch(getApiEndpoint('/venues/'));
                if (response.ok) {
                    const data = await response.json();
                    const venueOptions = [
                        { label: 'Any Venue', value: '' },
                        ...data.map((v: { name: string; slug: string }) => ({
                            label: v.name,
                            value: v.slug,
                        })),
                    ];
                    setVenues(venueOptions);
                }
            } catch (err) {
                console.error('Failed to fetch venues:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    const handleSelect = (key: keyof Filters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onChange(newFilters);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-[#1a1a1a]">
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('venue', e.target.value)}
                disabled={loading}
            >
                {loading ? (
                    <option>Loading...</option>
                ) : (
                    venues.map(v => (
                        <option key={v.value} value={v.value}>
                            {v.label}
                        </option>
                    ))
                )}
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('city', e.target.value)}
            >
                <option value="">Any City</option>
                <option value="denver">Denver, CO</option>
                <option value="red-rocks">Red Rocks, CO</option>
                <option value="new-york">New York, NY</option>
                <option value="chicago">Chicago, IL</option>
                <option value="los-angeles">Los Angeles, CA</option>
                <option value="san-francisco">San Francisco, CA</option>
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('state', e.target.value)}
            >
                <option value="">Any State</option>
                <option value="CO">Colorado</option>
                <option value="NY">New York</option>
                <option value="CA">California</option>
                <option value="IL">Illinois</option>
                <option value="TX">Texas</option>
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('country', e.target.value)}
            >
                <option value="">Any Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('dow', e.target.value)}
            >
                <option value="">Day of Week</option>
                <option value="0">Sunday</option>
                <option value="1">Monday</option>
                <option value="2">Tuesday</option>
                <option value="3">Wednesday</option>
                <option value="4">Thursday</option>
                <option value="5">Friday</option>
                <option value="6">Saturday</option>
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('dom', e.target.value)}
            >
                <option value="">Day of Month</option>
                {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                    </option>
                ))}
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('month', e.target.value)}
            >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                        {i + 1}
                    </option>
                ))}
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('year', e.target.value)}
            >
                <option value="">Year</option>
                {[2020, 2021, 2022, 2023, 2024, 2025].map(y => (
                    <option key={y} value={String(y)}>
                        {y}
                    </option>
                ))}
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('sort', e.target.value)}
            >
                <option value="">Sort By</option>
                <option value="plays">Plays</option>
                <option value="rating">Rating</option>
                <option value="date">Date</option>
            </select>
            <select
                className="bg-[#2a2a2a] text-[#f5f5f5] p-2"
                onChange={e => handleSelect('limit', e.target.value)}
            >
                <option value="">Limit</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
        </div>
    );
}
