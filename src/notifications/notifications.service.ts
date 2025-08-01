import * as admin from 'firebase-admin';
import { Injectable, OnModuleInit } from '@nestjs/common';
import serviceAccount from '@/configs/sic-project-10820-firebase-adminsdk-fbsvc-75915ac535.json';

@Injectable()
export class NotificationsService implements OnModuleInit {
  onModuleInit() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }

  async sendNotificationToDevice(
    fcmToken: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ) {
    const message = {
      notification: {
        title,
        body,
      },
      data, // custom payload để Flutter xử lý
      token: fcmToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log('✅ FCM sent:', response);
      return response;
    } catch (error) {
      console.error('❌ FCM send error:', error);
      throw error;
    }
  }
}
