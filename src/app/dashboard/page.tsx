/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [zipCode, setZipCode] = useState('');
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                `https://api.census.gov/data/2021/acs/acs5?get=NAME,B01003_001E,B25001_001E,B25077_001E,B25034_001E,B25064_001E,B25003_002E,B19013_001E,B19301_001E&for=zip%20code%20tabulation%20area:${zipCode}&key=47f8aff22fef90dca9b6c42bf4399443ffff47aa`
            );
            setData(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch data');
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Single Zip Stats</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="border p-2 mr-2"
                    placeholder="Enter ZIP Code"
                />
                <button onClick={fetchData} className="bg-blue-500 text-white p-2">
                    Search
                </button>
            </div>
            {data && (
                <table className="min-w-full bg-white shadow-md rounded-md">
                    <thead>
                        <tr>
                            <th className="border p-2">Attribute</th>
                            <th className="border p-2">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border p-2">Population</td>
                            <td className="border p-2">{data[1][1]}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">Number of Housing Units</td>
                            <td className="border p-2">{data[1][2]}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">Median Home Value ($)</td>
                            <td className="border p-2">{data[1][3]}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">Housing Unit Age (years)</td>
                            <td className="border p-2">{data[1][4]}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">Median Gross Rent ($)</td>
                            <td className="border p-2">{data[1][5]}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">Homeownership Rate (%)</td>
                            <td className="border p-2">{data[1][6]}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">Median Household Income ($)</td>
                            <td className="border p-2">{data[1][7]}</td>
                        </tr>
                        <tr>
                            <td className="border p-2">Median Personal Income ($)</td>
                            <td className="border p-2">{data[1][8]}</td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
}
