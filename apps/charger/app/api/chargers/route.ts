import { NextRequest, NextResponse } from "next/server";
import { getHumaxChargers } from "@/services/humaxService";

export async function GET(request: NextRequest) {
    const chargers = await getHumaxChargers("2355");
    return NextResponse.json(chargers);
}