/* eslint-disable @typescript-eslint/no-explicit-any */
// paste-zips/page.tsx
"use client";

import { useState } from 'react';
import axios from 'axios';

export default function PasteZips() {
    const [zipCodesInput, setZipCodesInput] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const fetchZipData = async () => {
        try {
            const zipCodesArray = zipCodesInput.split(/[\s,;]+/).filter(zip => zip.length > 0);

            const enrichedResults = await Promise.all(
                zipCodesArray.map(async (zip: string) => {
                    const censusResponse = await axios.get(
                        `https://api.census.gov/data/2021/acs/acs5?get=NAME,B01003_001E,B25001_001E,B25077_001E,B25034_001E,B25064_001E,B25003_002E,B19013_001E,B19301_001E&for=zip%20code%20tabulation%20area:${zip}&key=47f8aff22fef90dca9b6c42bf4399443ffff47aa`
                    );

                    const totalHousingUnits = parseFloat(censusResponse.data[1]?.[2] || '0');
                    const ownerOccupiedUnits = parseFloat(censusResponse.data[1]?.[6] || '0');
                    const homeownershipRate = totalHousingUnits > 0 ? ((ownerOccupiedUnits / totalHousingUnits) * 100).toFixed(2) : '0';

                    return {
                        postalCode: zip,
                        population: censusResponse.data[1]?.[1] || 'N/A',
                        housingUnits: censusResponse.data[1]?.[2] || 'N/A',
                        medianHomeValue: censusResponse.data[1]?.[3] || 'N/A',
                        housingUnitAge: censusResponse.data[1]?.[4] || 'N/A',
                        medianGrossRent: censusResponse.data[1]?.[5] || 'N/A',
                        homeownershipRate: `${homeownershipRate}%`,
                        medianHouseholdIncome: censusResponse.data[1]?.[7] || 'N/A',
                        perCapitaIncome: censusResponse.data[1]?.[8] || 'N/A'
                    };
                })
            );

            setResults(enrichedResults);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch data');
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">Paste ZIP Codes to Fetch Data</h1>
            <div className="mb-4">
                <textarea
                    value={zipCodesInput}
                    onChange={(e) => setZipCodesInput(e.target.value)}
                    className="border p-2 w-full mb-4"
                    placeholder="Paste ZIP codes separated by spaces, commas, or line breaks"
                />
                <button onClick={fetchZipData} className="bg-blue-500 text-white p-2">
                    Fetch Data
                </button>
            </div>

            {results.length > 0 && (
                <table className="min-w-full bg-white shadow-md rounded-md">
                    <thead>
                        <tr>
                            <th className="border p-2">Postal Code</th>
                            <th className="border p-2">Population (People)</th>
                            <th className="border p-2">Number of Housing Units (Units)</th>
                            <th className="border p-2">Median Home Value ($)</th>
                            <th className="border p-2">Housing Unit Age (Years)</th>
                            <th className="border p-2">Median Gross Rent ($)</th>
                            <th className="border p-2">Homeownership Rate (%)</th>
                            <th className="border p-2">Median Household Income ($)</th>
                            <th className="border p-2">Per Capita Income ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td className="border p-2">{result.postalCode}</td>
                                <td className="border p-2">{result.population}</td>
                                <td className="border p-2">{result.housingUnits}</td>
                                <td className="border p-2">{result.medianHomeValue}</td>
                                <td className="border p-2">{result.housingUnitAge}</td>
                                <td className="border p-2">{result.medianGrossRent}</td>
                                <td className="border p-2">{result.homeownershipRate}</td>
                                <td className="border p-2">{result.medianHouseholdIncome}</td>
                                <td className="border p-2">{result.perCapitaIncome}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
