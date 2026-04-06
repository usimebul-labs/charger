import webpush from 'web-push';
import { cookies } from 'next/headers'
import { createClient } from '@/supabase/server';



webpush.setVapidDetails(
    process.env.VAPID_SUBJECT as string,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
);


export async function register(subscription: PushSubscription, typeCode: string) {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
        .from('charger_waitings')
        .insert({
            subscription: subscription as any,
            type_code: typeCode,
        });

    if (error) {
        console.error('Failed to register waiting:', error);
        throw new Error('알림 등록에 실패했습니다.');
    }
}