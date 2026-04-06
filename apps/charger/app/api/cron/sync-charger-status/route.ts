import { upsertStations } from '@/app/actions/charger';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const stations = await upsertStations();
    return NextResponse.json(stations);
}