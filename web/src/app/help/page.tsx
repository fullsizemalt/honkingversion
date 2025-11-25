'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Heart, Users, ListTodo, Zap, Shield } from 'lucide-react';

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        id: 'what-is',
        question: 'What is Honkingversion?',
        answer: 'Honkingversion is a community-driven platform where Goose fans vote on their favorite performances of each song. The version with the most votes becomes "The Honking Version" - the definitive fan-favorite performance.'
    },
    {
        id: 'voting',
        question: 'How do I vote on performances?',
        answer: 'Browse to any song page and you\'ll see different performances listed. Click on a performance to see its details, then click the "This is The One" button to vote for it as your honking version. You can change your vote anytime by selecting a different performance.'
    },
    {
        id: 'honking-version',
        question: 'What does "Honking Version" mean?',
        answer: 'The "Honking Version" is the performance that has received the most community votes for that song. It represents the fan consensus on the best version of that performance. The voting count is displayed so you can see how many people prefer that version.'
    },
    {
        id: 'voting-once',
        question: 'Can I vote on multiple performances?',
        answer: 'You can only vote for one performance per song at a time. However, you can change your vote anytime by selecting a different performance. Your previous vote will be replaced with your new selection.'
    },
    {
        id: 'account',
        question: 'Do I need an account to use Honkingversion?',
        answer: 'You can browse songs and view voting results without an account. However, you\'ll need to sign in to vote, create lists, follow other users, or mark shows as attended.'
    },
    {
        id: 'lists',
        question: 'What can I do with lists?',
        answer: 'Lists let you organize performances and shows. Create custom collections of your favorite performances, shows you want to attend, or any other grouping that makes sense to you. You can make lists public or private, and share them with other users.'
    },
    {
        id: 'follow',
        question: 'What does following a user do?',
        answer: 'When you follow someone, you can see their activity, including their votes and reviews. You can visit their profile to see their voting history and custom lists. This helps you connect with other Goose fans and discover new perspectives.'
    },
    {
        id: 'attendance',
        question: 'How do I mark shows as attended?',
        answer: 'On the shows page, find the show you attended and click the attendance button to mark it. Your attendance history appears on your profile and helps personalize your voting recommendations based on shows you\'ve experienced.'
    },
    {
        id: 'export',
        question: 'Can I export my data?',
        answer: 'Yes! Go to the Export page to download your complete voting history, attended shows, lists, and follows as a CSV file. This lets you back up your data or analyze your voting patterns.'
    },
    {
        id: 'private',
        question: 'Is my voting history private?',
        answer: 'Your voting history visibility depends on your profile settings. By default, your votes are visible to other users on your profile. You can adjust your privacy settings to make your voting history private if you prefer.'
    },
    {
        id: 'tags',
        question: 'What are tags?',
        answer: 'Tags let you label and organize performances and shows with custom categories (like "favorites", "live-debut", "acoustic", etc.). You can create your own tags and filter content by tags to find performances that match your interests.'
    },
    {
        id: 'data-source',
        question: 'Where does the performance data come from?',
        answer: 'Our data is sourced from El Goose (elgoose.net), a comprehensive Goose setlist database. We combine this with community-curated votes and reviews to provide the most complete picture of Goose performances.'
    }
];

export default function HelpPage() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleFAQ = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] py-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] transition-colors mb-4 inline-block">
                        ← Back
                    </Link>
                    <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold mb-4 text-[var(--text-primary)]">
                        Help & FAQ
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)]">
                        Everything you need to know about Honkingversion
                    </p>
                </div>

                {/* Getting Started Section */}
                <section className="mb-12">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 text-[var(--text-primary)]">
                        Getting Started
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Step 1: Browse */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                    1
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-2">Browse Songs & Shows</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Explore our database of Goose songs and performances. No account needed to browse and view voting results.
                                    </p>
                                    <Link href="/songs" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] text-sm mt-3 inline-block">
                                        Explore Songs →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Vote */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                    2
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-2">Sign In & Vote</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Create an account to start voting. Choose your favorite performance of each song to help crown "The Honking Version".
                                    </p>
                                    <Link href="/auth/signin" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] text-sm mt-3 inline-block">
                                        Sign In →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Create Lists */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                    3
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-2">Create Lists</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Organize your favorite performances into custom lists. Share them with the community or keep them private.
                                    </p>
                                    <Link href="/lists" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] text-sm mt-3 inline-block">
                                        Browse Lists →
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Connect */}
                        <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-[var(--accent-primary)] text-[var(--text-inverse)] rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                                    4
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-[var(--text-primary)] mb-2">Follow & Connect</h3>
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        Follow other users to see their votes and reviews. Connect with fellow Goose fans and share your passion.
                                    </p>
                                    <Link href="/profile" className="text-[var(--accent-tertiary)] hover:text-[var(--accent-primary)] text-sm mt-3 inline-block">
                                        View Profile →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="mb-12">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 text-[var(--text-primary)]">
                        Key Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex gap-3 text-[var(--text-secondary)]">
                            <Zap className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Vote & Rate</h3>
                                <p className="text-sm">Vote on your favorite performances to crown "The Honking Version"</p>
                            </div>
                        </div>

                        <div className="flex gap-3 text-[var(--text-secondary)]">
                            <Heart className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Create Lists</h3>
                                <p className="text-sm">Organize performances into custom lists and share them</p>
                            </div>
                        </div>

                        <div className="flex gap-3 text-[var(--text-secondary)]">
                            <Users className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Follow Users</h3>
                                <p className="text-sm">See what other fans are voting for and connect with community</p>
                            </div>
                        </div>

                        <div className="flex gap-3 text-[var(--text-secondary)]">
                            <ListTodo className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Track Attendance</h3>
                                <p className="text-sm">Mark shows you've attended and build your concert history</p>
                            </div>
                        </div>

                        <div className="flex gap-3 text-[var(--text-secondary)]">
                            <Search className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Search & Filter</h3>
                                <p className="text-sm">Find songs, shows, and performances by year, venue, or tags</p>
                            </div>
                        </div>

                        <div className="flex gap-3 text-[var(--text-secondary)]">
                            <Shield className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Privacy Control</h3>
                                <p className="text-sm">Control visibility of your votes and data through settings</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section>
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-6 text-[var(--text-primary)]">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-3">
                        {faqItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(item.id)}
                                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--bg-muted)] transition-colors text-left"
                                >
                                    <h3 className="font-bold text-[var(--text-primary)]">{item.question}</h3>
                                    {expandedId === item.id ? (
                                        <ChevronUp className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" />
                                    )}
                                </button>

                                {expandedId === item.id && (
                                    <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] text-sm leading-relaxed">
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact Section */}
                <section className="mt-12 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-lg p-8 text-center">
                    <h2 className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold mb-4 text-[var(--text-primary)]">
                        Still have questions?
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6">
                        We're here to help! Send us your questions or feedback.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="mailto:hello@runfoo.run"
                            className="px-6 py-2 bg-[var(--accent-primary)] text-[var(--text-inverse)] font-bold rounded hover:opacity-90 transition-opacity"
                        >
                            Email Us
                        </a>
                        <Link
                            href="/updates"
                            className="px-6 py-2 border border-[var(--accent-tertiary)] text-[var(--accent-tertiary)] font-bold rounded hover:bg-[var(--accent-tertiary)] hover:text-[var(--text-inverse)] transition-colors"
                        >
                            View Updates
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
