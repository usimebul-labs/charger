import { PushMessage } from '@/app/(home)/_components/types';
import webpush from 'web-push';

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT as string,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
    process.env.VAPID_PRIVATE_KEY as string
);

export async function push(subscription: PushSubscriptionJSON, message: PushMessage) {
    try {
        await webpush.sendNotification(subscription as webpush.PushSubscription, JSON.stringify(message));
        console.log("푸시 전송 성공!");
    } catch (error) {
        console.error("푸시 전송 실패:", error);
    }
}