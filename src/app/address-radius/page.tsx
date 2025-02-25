/* eslint-disable @typescript-eslint/no-explicit-any */
// address-radius/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";

export default function AddressRadius() {
    const [address, setAddress] = useState("");
    const [radius, setRadius] = useState(5);
    const [results, setResults] = useState<any[]>([]);

    const fetchLocationData = async () => {
        try {
            // Fetch latitude and longitude via OpenStreetMap API
            const nominatimResponse = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
            );
            const location = nominatimResponse.data[0];

            if (!location) {
                alert("Address not found");
                return;
            }

            const { lat, lon } = location;

            // Fetch nearby postal codes using GeoNames API
            const geoNamesResponse = await axios.get(
                `http://api.geonames.org/findNearbyPostalCodesJSON?lat=${lat}&lng=${lon}&radius=${radius}&username=mika.naidu1`
            );

            const nearbyPostalCodes = geoNamesResponse.data.postalCodes;

            if (!nearbyPostalCodes) {
                alert("No postal codes found nearby");
                return;
            }

            // Enrich data with Census API
            const enrichedResults = await Promise.all(
                nearbyPostalCodes.map(async (postal: any) => {
                    const censusResponse = await axios.get(
                        `https://api.census.gov/data/2021/acs/acs5?get=NAME,B01003_001E,B25001_001E,B25077_001E,B25034_001E,B25064_001E,B25003_002E,B19013_001E,B19301_001E&for=zip%20code%20tabulation%20area:${postal.postalCode}&key=47f8aff22fef90dca9b6c42bf4399443ffff47aa`
                    );

                    // Calculate homeownership rate correctly
                    const totalHousingUnits = parseFloat(censusResponse.data[1]?.[2] || "0");
                    const ownerOccupiedUnits = parseFloat(censusResponse.data[1]?.[6] || "0");
                    const homeownershipRate =
                        totalHousingUnits > 0
                            ? ((ownerOccupiedUnits / totalHousingUnits) * 100).toFixed(2)
                            : "0";

                    return {
                        postalCode: postal.postalCode,
                        placeName: postal.placeName,
                        population: censusResponse.data[1]?.[1] || "N/A",
                        housingUnits: censusResponse.data[1]?.[2] || "N/A",
                        medianHomeValue: censusResponse.data[1]?.[3] || "N/A",
                        housingUnitAge: censusResponse.data[1]?.[4] || "N/A",
                        medianGrossRent: censusResponse.data[1]?.[5] || "N/A",
                        homeownershipRate: `${homeownershipRate}%`,
                        medianHouseholdIncome: censusResponse.data[1]?.[7] || "N/A",
                        perCapitaIncome: censusResponse.data[1]?.[8] || "N/A",
                    };
                })
            );

            setResults(enrichedResults);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch data");
        }
    };

    return (
        <div className="min-h-screen bg-green-50 p-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold">Find ZIP Codes Near You</h1>
                <p className="mt-2 text-gray-200">Enter an address and select a radius</p>
            </div>

            {/* Search Input & Slider */}
            <div className="flex flex-col items-center mt-6">
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border p-3 w-3/4 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
                    placeholder="Enter address"
                />
                <div className="flex items-center mt-4">
                    <span className="text-green-900 font-semibold">Radius:</span>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={radius}
                        onChange={(e) => setRadius(parseInt(e.target.value))}
                        className="mx-3"
                    />
                    <span className="text-green-900">{radius} miles</span>
                </div>
                <button
                    onClick={fetchLocationData}
                    className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition"
                >
                    Search
                </button>
            </div>

            {/* Results Table */}
            {results.length > 0 && (
                <div className="overflow-x-auto mt-8">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-green-900 text-white">
                            <tr>
                                <th className="p-3">ZIP Code</th>
                                <th className="p-3">Place</th>
                                <th className="p-3">Population</th>
                                <th className="p-3">Housing Units</th>
                                <th className="p-3">Median Home Value ($)</th>
                                <th className="p-3">Median Gross Rent ($)</th>
                                <th className="p-3">Homeownership Rate (%)</th>
                                <th className="p-3">Median Household Income ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, index) => (
                                <tr key={index} className="border-b hover:bg-gray-100">
                                    <td className="p-3 text-center">{result.postalCode}</td>
                                    <td className="p-3 text-center">{result.placeName}</td>
                                    <td className="p-3 text-center">{result.population}</td>
                                    <td className="p-3 text-center">{result.housingUnits}</td>
                                    <td className="p-3 text-center">{result.medianHomeValue}</td>
                                    <td className="p-3 text-center">{result.medianGrossRent}</td>
                                    <td className="p-3 text-center">{result.homeownershipRate}</td>
                                    <td className="p-3 text-center">{result.medianHouseholdIncome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
