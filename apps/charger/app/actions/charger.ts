"use server";

import { getChargers } from '@/services/chargerService';
import { createClient } from '@/supabase/server';
import { cookies } from 'next/headers'


function getFloor(searchKey: number) {
    if (searchKey === 11012303 || searchKey === 11012304 || searchKey === 11012301) return "B3";
    if (searchKey === 11012305 || searchKey === 11012306 || searchKey === 11012302) return "B4";
    return "B5";
}

export async function upsertChargers() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const chargers = await getChargers("2355");

    for (const charger of chargers) {
        11
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

        if (error) {
            console.error('DB 업데이트 실패:', error);
            return { success: false, error };
        }
    }


    return chargers;
}
