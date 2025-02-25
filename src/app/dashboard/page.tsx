/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [zipCode, setZipCode] = useState("");
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        try {
            // Fetch Census demographic data
            const censusResponse = await axios.get(
                `https://api.census.gov/data/2021/acs/acs5?get=B01003_001E,B25001_001E,B25077_001E,B25034_001E,B25064_001E,B25003_002E,B19013_001E,B19301_001E&for=zip%20code%20tabulation%20area:${zipCode}&key=47f8aff22fef90dca9b6c42bf4399443ffff47aa`
            );

            // Fetch city, state, latitude, and longitude using the GeoNames API
            const geoNamesResponse = await axios.get(
                `http://api.geonames.org/postalCodeSearchJSON?postalcode=${zipCode}&maxRows=1&username=mika.naidu1`
            );

            let placeName = "N/A";
            let state = "N/A";
            let lat = "N/A";
            let lng = "N/A";
            if (geoNamesResponse.data?.postalCodes?.length > 0) {
                placeName = geoNamesResponse.data.postalCodes[0].placeName || "N/A";
                state = geoNamesResponse.data.postalCodes[0].adminName1 || "N/A";
                lat = geoNamesResponse.data.postalCodes[0].lat || "N/A";
                lng = geoNamesResponse.data.postalCodes[0].lng || "N/A";
            }

            // Calculate homeownership rate
            const totalHousingUnits = parseFloat(censusResponse.data[1]?.[1] || "0");
            const ownerOccupiedUnits = parseFloat(censusResponse.data[1]?.[5] || "0");
            const homeownershipRate =
                totalHousingUnits > 0
                    ? ((ownerOccupiedUnits / totalHousingUnits) * 100).toFixed(2)
                    : "0";

            // Store data in state
            setData({
                zipCode,
                placeName,
                state,
                lat,
                lng,
                population: censusResponse.data[1]?.[0] || "N/A",
                housingUnits: censusResponse.data[1]?.[1] || "N/A",
                medianHomeValue: censusResponse.data[1]?.[2] || "N/A",
                housingUnitAge: censusResponse.data[1]?.[3] || "N/A",
                medianGrossRent: censusResponse.data[1]?.[4] || "N/A",
                homeownershipRate: `${homeownershipRate}%`,
                medianHouseholdIncome: censusResponse.data[1]?.[6] || "N/A",
                perCapitaIncome: censusResponse.data[1]?.[7] || "N/A",
            });
        } catch (error) {
            console.error(error);
            alert("Failed to fetch data");
        }
    };

    return (
        <div className="min-h-screen bg-green-50 p-8">
            {/* Hero Section */}
            <div className="text-center py-12 bg-green-900 text-white rounded-lg shadow-md">
                <h1 className="text-4xl font-bold">Single ZIP Code Lookup</h1>
                <p className="mt-2 text-gray-200">Enter a ZIP code to retrieve detailed statistics</p>
            </div>

            {/* Input Section */}
            <div className="flex flex-col items-center mt-6">
                <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="border p-3 w-1/2 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400 text-center"
                    placeholder="Enter ZIP Code"
                />
                <button
                    onClick={fetchData}
                    className="mt-4 bg-yellow-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-yellow-600 transition"
                >
                    Search
                </button>
            </div>

            {/* Results Table */}
            {data && (
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-green-900 text-white">
                            <tr>
                                <th className="border p-3">Attribute</th>
                                <th className="border p-3">Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border p-2 font-semibold">City</td>
                                <td className="border p-2">{data.placeName}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">State</td>
                                <td className="border p-2">{data.state}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Latitude</td>
                                <td className="border p-2">{data.lat}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Longitude</td>
                                <td className="border p-2">{data.lng}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Population</td>
                                <td className="border p-2">{data.population}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Housing Units</td>
                                <td className="border p-2">{data.housingUnits}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Median Home Value ($)</td>
                                <td className="border p-2">{data.medianHomeValue}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Housing Unit Age (Years)</td>
                                <td className="border p-2">{data.housingUnitAge}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Median Gross Rent ($)</td>
                                <td className="border p-2">{data.medianGrossRent}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Homeownership Rate (%)</td>
                                <td className="border p-2">{data.homeownershipRate}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Median Household Income ($)</td>
                                <td className="border p-2">{data.medianHouseholdIncome}</td>
                            </tr>
                            <tr>
                                <td className="border p-2 font-semibold">Median Personal Income ($)</td>
                                <td className="border p-2">{data.perCapitaIncome}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
