// password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const router = useRouter();

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "mytreedata") {
            router.push("/welcome");
        } else {
            setError(true);
            setPassword(""); // Clear input after incorrect attempt
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <div className="bg-white p-8 shadow-lg rounded-lg max-w-sm w-full text-center border border-green-900">
                {/* Logo or Icon */}
                <div className="flex justify-center mb-4">
                    <span className="text-4xl">🔒</span>
                </div>

                <h2 className="text-2xl font-bold text-green-900 mb-2">Enter Password</h2>
                <p className="text-gray-600 mb-4">This page is password-protected.</p>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        className="border p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                        placeholder="Enter password"
                    />
                    {error && <p className="text-red-500 text-sm">Incorrect password. Try again!</p>}

                    <button
                        type="submit"
                        className="bg-yellow-500 text-white px-6 py-3 w-full rounded-lg shadow-md hover:bg-yellow-600 transition"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
