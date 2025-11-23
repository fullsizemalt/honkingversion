import { Tag } from '@/types/tag';

interface TagBadgeProps {
    tag: Tag;
    onRemove?: () => void;
}

export default function TagBadge({ tag, onRemove }: TagBadgeProps) {
    const bgColor = tag.color || '#333';

    return (
        <span
            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white mr-2 mb-1"
            style={{ backgroundColor: bgColor }}
        >
            {tag.name}
            {onRemove && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onRemove();
                    }}
                    className="ml-1 text-white hover:text-gray-200 focus:outline-none"
                >
                    ×
                </button>
            )}
        </span>
    );
}
