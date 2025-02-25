/* eslint-disable @typescript-eslint/no-explicit-any */
// address-radius/page.tsx
"use client";

import { useState } from 'react';
import axios from 'axios';

export default function AddressRadius() {
    const [address, setAddress] = useState('');
    const [radius, setRadius] = useState(5);
    const [results, setResults] = useState<any[]>([]);

    const fetchLocationData = async () => {
        try {
            // Fetch latitude and longitude via OpenStreetMap API (Nominatim)
            const nominatimResponse = await axios.get(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`
            );
            const location = nominatimResponse.data[0];

            if (!location) {
                alert('Address not found');
                return;
            }

            const { lat, lon } = location;

            // Fetch nearby postal codes using GeoNames API
            const geoNamesResponse = await axios.get(
                `http://api.geonames.org/findNearbyPostalCodesJSON?lat=${lat}&lng=${lon}&radius=${radius}&username=mika.naidu1`
            );

            const nearbyPostalCodes = geoNamesResponse.data.postalCodes;

            if (!nearbyPostalCodes) {
                alert('No postal codes found nearby');
                return;
            }

            // Enrich data with Census API
            const enrichedResults = await Promise.all(
                nearbyPostalCodes.map(async (postal: any) => {
                    const censusResponse = await axios.get(
                        `https://api.census.gov/data/2021/acs/acs5?get=NAME,B01003_001E,B25001_001E,B25077_001E,B25034_001E,B25064_001E,B25003_001E,B19013_001E,B19301_001E&for=zip%20code%20tabulation%20area:${postal.postalCode}&key=47f8aff22fef90dca9b6c42bf4399443ffff47aa`
                    );

                    return {
                        postalCode: postal.postalCode,
                        placeName: postal.placeName,
                        lat: postal.lat,
                        lng: postal.lng,
                        population: censusResponse.data[1]?.[1] || 'N/A',
                        housingUnits: censusResponse.data[1]?.[2] || 'N/A',
                        medianHomeValue: censusResponse.data[1]?.[3] || 'N/A',
                        housingUnitAge: censusResponse.data[1]?.[4] || 'N/A',
                        medianGrossRent: censusResponse.data[1]?.[5] || 'N/A',
                        homeownershipRate: censusResponse.data[1]?.[6] || 'N/A',
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
            <h1 className="text-3xl font-bold mb-6">Address and Radius Search</h1>
            <div className="mb-4">
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border p-2 mr-2"
                    placeholder="Enter address"
                />
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="mr-2"
                />
                <span>{radius} miles</span>
                <button onClick={fetchLocationData} className="bg-blue-500 text-white p-2 ml-4">
                    Search
                </button>
            </div>

            {results.length > 0 && (
                <table className="min-w-full bg-white shadow-md rounded-md">
                    <thead>
                        <tr>
                            <th className="border p-2">Postal Code</th>
                            <th className="border p-2">Place Name</th>

                            <th className="border p-2">Population</th>
                            <th className="border p-2">Number of residential units</th>
                            <th className="border p-2">Median Home Value ($)</th>
                            <th className="border p-2">Housing Unit Age (years)</th>
                            <th className="border p-2">Median Gross Rent ($)</th>
                            <th className="border p-2">Homeownership Rate (%)</th>
                            <th className="border p-2">Median Household Income ($)</th>
                            <th className="border p-2">Median Personal Income ($)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td className="border p-2">{result.postalCode}</td>
                                <td className="border p-2">{result.placeName}</td>

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
