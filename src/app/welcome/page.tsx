// welcome/page.tsx
"use client";

import Link from "next/link";

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md w-full max-w-3xl">
                <h1 className="text-4xl font-bold">Census Data Dashboard</h1>
                <p className="mt-2 text-gray-200">Select a method to fetch ZIP code statistics</p>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 w-full max-w-3xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link href="/dashboard" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-green-900 font-semibold text-lg border border-green-900">
                        <span className="text-xl">📍</span>
                        Get Single ZIP Stats
                    </Link>

                    <Link href="/address-radius" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-green-900 font-semibold text-lg border border-green-900">
                        <span className="text-xl">🏡</span>
                        Get Stats by Address & Radius
                    </Link>

                    <Link href="/paste-zips" className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition flex flex-col items-center text-green-900 font-semibold text-lg border border-green-900">
                        <span className="text-xl">📋</span>
                        Get Pasted ZIP Stats
                    </Link>
                </div>
            </div>
        </div>
    );
}
