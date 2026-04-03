import { ChargerInfo } from "@/types/charger";

const BASE_URL = "https://www.humaxcharger.com";

export async function getStationChargers(stationId: string): Promise<ChargerInfo[]> {
    const url = `${BASE_URL}/user/find/view/${stationId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "accept": "application/json, text/plain, */*",
            "content-type": "application/json",
            "x-csrf-token": "OIYktMLZSeeCrsHFwn4ZwX0e1QOKU2f3VWAO33yWQKAy9GtEXOQVgfu7fdCvmvej-1Mt8B4o-GHuY1XaY1c27k6uI5cFwF1w",
        },
        next: { revalidate: 60, tags: [`station-${stationId}`] }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch chargers: ${response.statusText}`);
    }

    return response.json() as Promise<ChargerInfo[]>;
}