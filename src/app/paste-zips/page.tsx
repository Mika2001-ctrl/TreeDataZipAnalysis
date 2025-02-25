/* eslint-disable @typescript-eslint/no-explicit-any */
// paste-zips/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";

export default function PasteZips() {
    const [zipCodesInput, setZipCodesInput] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);

    const fetchZipData = async () => {
        try {
            const zipCodesArray = zipCodesInput.split(/[\s,;]+/).filter(zip => zip.length > 0);

            const enrichedResults = await Promise.all(
                zipCodesArray.map(async (zip: string) => {
                    const censusResponse = await axios.get(
                        `https://api.census.gov/data/2021/acs/acs5?get=NAME,B01003_001E,B25001_001E,B25077_001E,B25034_001E,B25064_001E,B25003_002E,B19013_001E,B19301_001E&for=zip%20code%20tabulation%20area:${zip}&key=47f8aff22fef90dca9b6c42bf4399443ffff47aa`
                    );

                    const geoNamesResponse = await axios.get(
                        `http://api.geonames.org/postalCodeLookupJSON?postalcode=${zip}&country=US&username=mika.naidu1`
                    );

                    const geoData = geoNamesResponse.data.postalcodes?.[0] || {};
                    const city = geoData.placeName || "N/A";
                    const state = geoData.adminName1 || "N/A";

                    const totalHousingUnits = parseFloat(censusResponse.data[1]?.[2] || "0");
                    const ownerOccupiedUnits = parseFloat(censusResponse.data[1]?.[6] || "0");
                    const homeownershipRate =
                        totalHousingUnits > 0
                            ? ((ownerOccupiedUnits / totalHousingUnits) * 100).toFixed(2)
                            : "0";

                    return {
                        postalCode: zip,
                        city,
                        state,
                        population: parseInt(censusResponse.data[1]?.[1] || "0"),
                        housingUnits: parseInt(censusResponse.data[1]?.[2] || "0"),
                        medianHomeValue: parseInt(censusResponse.data[1]?.[3] || "0"),
                        housingUnitAge: parseInt(censusResponse.data[1]?.[4] || "0"),
                        medianGrossRent: parseInt(censusResponse.data[1]?.[5] || "0"),
                        homeownershipRate: parseFloat(homeownershipRate),
                        medianHouseholdIncome: parseInt(censusResponse.data[1]?.[7] || "0"),
                        perCapitaIncome: parseInt(censusResponse.data[1]?.[8] || "0"),
                    };
                })
            );

            setResults(enrichedResults);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch data");
        }
    };

    const sortTable = (key: string) => {
        let direction = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...results].sort((a, b) => {
            if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
            if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
            return 0;
        });

        setResults(sortedData);
        setSortConfig({ key, direction });
    };

    return (
        <div className="min-h-screen bg-green-50 p-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold">Fetch ZIP Code Data</h1>
                <p className="mt-2 text-gray-200">Paste ZIP codes below to retrieve census information</p>
            </div>

            {/* Input Section */}
            <div className="flex flex-col items-center mt-6">
                <textarea
                    value={zipCodesInput}
                    onChange={(e) => setZipCodesInput(e.target.value)}
                    className="border p-3 w-3/4 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                    placeholder="Paste ZIP codes separated by spaces, commas, or line breaks"
                    rows={3}
                />
                <button
                    onClick={fetchZipData}
                    className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition"
                >
                    Fetch Data
                </button>
            </div>

            {/* Results Section */}
            {results.length > 0 && (
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-green-900 text-white">
                            <tr>
                                <th className="border p-3">ZIP Code</th>
                                <th className="border p-3">City</th>
                                <th className="border p-3">State</th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("population")}>
                                    Population {sortConfig?.key === "population" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("housingUnits")}>
                                    Housing Units {sortConfig?.key === "housingUnits" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("medianHomeValue")}>
                                    Median Home Value ($) {sortConfig?.key === "medianHomeValue" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("housingUnitAge")}>
                                    Housing Unit Age (Years) {sortConfig?.key === "housingUnitAge" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("medianGrossRent")}>
                                    Median Gross Rent ($) {sortConfig?.key === "medianGrossRent" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("homeownershipRate")}>
                                    Homeownership Rate (%) {sortConfig?.key === "homeownershipRate" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("medianHouseholdIncome")}>
                                    Median Household Income ($) {sortConfig?.key === "medianHouseholdIncome" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                                <th className="border p-3 cursor-pointer" onClick={() => sortTable("perCapitaIncome")}>
                                    Per Capita Income ($) {sortConfig?.key === "perCapitaIncome" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border p-2">{result.postalCode}</td>
                                    <td className="border p-2">{result.city}</td>
                                    <td className="border p-2">{result.state}</td>
                                    <td className="border p-2">{result.population}</td>
                                    <td className="border p-2">{result.housingUnits}</td>
                                    <td className="border p-2">{result.medianHomeValue}</td>
                                    <td className="border p-2">{result.housingUnitAge}</td>
                                    <td className="border p-2">{result.medianGrossRent}</td>
                                    <td className="border p-2">{result.homeownershipRate}%</td>
                                    <td className="border p-2">{result.medianHouseholdIncome}</td>
                                    <td className="border p-2">{result.perCapitaIncome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
