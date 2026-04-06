"use server";

import { getHumaxChargers } from '@/services/humaxService';
import { createClient } from '@/supabase/server';
import { ChargerInfo } from '@/types/charger';
import { cookies } from 'next/headers'


function getFloor(searchKey: number) {
    if (searchKey === 11012303 || searchKey === 11012304 || searchKey === 11012301) return "B3";
    if (searchKey === 11012305 || searchKey === 11012306 || searchKey === 11012302) return "B4";
    return "B5";
}

export async function upsertStations() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const chargers = await getHumaxChargers("2355");

    for (const charger of chargers) {
        const params = {
            p_id: charger.id,
            p_search_key: charger.searchKey,
            p_status_code: charger.status.code,
            p_status_value: charger.status.value,
            p_type_code: charger.type.code,
            p_type_value: charger.type.value,
            p_capacity: charger.capacity,
            p_floor: getFloor(charger.searchKey)
        }

        const { error } = await supabase.rpc('upsert_charger_info', params);
        if (error) throw error;
    }

    return chargers;
}

export async function getStations() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
        .from('charger_infos')
        .select(`id, search_key, capacity, floor, charger_statuses (code, value), charger_types (code, value)`)
        .order('id', { ascending: true }); // ID 순 정렬

    if (error) {
        console.error('조회 실패:', error);
        return [];
    }

    const mapedData: ChargerInfo[] = data.map((item: any) => ({
        id: item.id,
        searchKey: item.search_key,
        capacity: item.capacity,
        floor: item.floor,
        status: item.charger_statuses,
        type: item.charger_types,
    }));


    return mapedData;
}


export async function registerWaitings(subscription: PushSubscription) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);


}