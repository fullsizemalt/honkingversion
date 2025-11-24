'use client';

import { useState, useEffect } from 'react';
import { Tag } from '@/types/tag';
import { getApiEndpoint } from '@/lib/api';
import TagBadge from './TagBadge';
import TagManager from './TagManager';

interface TagSelectorProps {
    selectedTags: Tag[];
    onAddTag: (tag: Tag) => void;
    onRemoveTag: (tagId: number) => void;
}

export default function TagSelector({ selectedTags, onAddTag, onRemoveTag }: TagSelectorProps) {
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showTagManager, setShowTagManager] = useState(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await fetch(getApiEndpoint('/tags'));
                if (res.ok) {
                    const data = await res.json();
                    setAvailableTags(data);
                }
            } catch (error) {
                console.error('Failed to fetch tags', error);
            }
        };

        fetchTags();
    }, []);

    const handleTagCreated = (newTag: Tag) => {
        setAvailableTags([...availableTags, newTag]);
        onAddTag(newTag);
    };

    const filteredTags = availableTags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTags.find(t => t.id === tag.id)
    );

    return (
        <div className="relative">
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedTags.map(tag => (
                    <TagBadge key={tag.id} tag={tag} onRemove={() => onRemoveTag(tag.id)} />
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Add a tag..."
                    className="flex-1 bg-[var(--bg-muted)] border border-[var(--border)] text-[var(--text-primary)] px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-[var(--accent-primary)] placeholder:text-[var(--text-tertiary)]"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                />
                <button
                    type="button"
                    onClick={() => setShowTagManager(true)}
                    className="bg-[var(--accent-primary)] text-[var(--text-inverse)] px-3 py-2 font-[family-name:var(--font-ibm-plex-mono)] text-xs font-bold uppercase rounded-full hover:bg-[var(--accent-secondary)] whitespace-nowrap"
                >
                    + New Tag
                </button>
            </div>

            {showDropdown && searchTerm && (
                <div className="absolute z-10 w-full bg-[var(--bg-secondary)] border border-[var(--border)] mt-1 max-h-40 overflow-y-auto shadow-lg rounded-2xl">
                    {filteredTags.length > 0 ? (
                        filteredTags.map(tag => (
                            <button
                                key={tag.id}
                                className="w-full text-left px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-muted)] flex items-center"
                                onClick={() => {
                                    onAddTag(tag);
                                    setSearchTerm('');
                                }}
                            >
                                <span
                                    className="w-3 h-3 rounded-full mr-2"
                                    style={{ backgroundColor: tag.color || '#333' }}
                                />
                                {tag.name}
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-sm text-[var(--text-tertiary)]">No matching tags found</div>
                    )}
                </div>
            )}

            <TagManager
                isOpen={showTagManager}
                onClose={() => setShowTagManager(false)}
                onTagCreated={handleTagCreated}
            />
        </div>
    );
}
