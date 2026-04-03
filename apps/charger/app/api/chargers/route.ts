import { NextRequest, NextResponse } from "next/server";
import { getChargers } from "@/services/chargerService";

export async function GET(request: NextRequest) {
    const chargers = await getChargers("2355");
    return NextResponse.json(chargers);
}