// welcome/page.tsx
"use client";

import Link from 'next/link';

export default function WelcomePage() {
    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Welcome to the Census Data Dashboard</h1>
            <ul className="space-y-4">
                <li>
                    <Link href="/dashboard" className="text-blue-500 underline">Get Single Zip Stats</Link>
                </li>
                <li>
                    <Link href="/address-radius" className="text-blue-500 underline">Get Stats by Address and Radius</Link>
                </li>
                <li>
                    <Link href="/paste-zips" className="text-blue-500 underline">Get Pasted ZIP Stats</Link>
                </li>
            </ul>
        </div>
    );
}
