// password/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordPage() {
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'mytreedata') {
            router.push('/welcome');
        } else {
            alert('Incorrect password, try again!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Password Protected</h2>
                <form onSubmit={handlePasswordSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full mb-4"
                        placeholder="Enter password"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded w-full"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
