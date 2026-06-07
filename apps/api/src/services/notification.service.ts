import { Notification } from '../models/notification.model.js';

export class NotificationService {
  static async getByUser(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await Promise.all([
      Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user: userId }),
    ]);
    return { notifications, total, page, limit };
  }

  static async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { $set: { isRead: true, readAt: new Date() } },
      { new: true }
    );
    return notification?.toJSON();
  }

  static async markAllRead(userId: string) {
    await Notification.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );
  }

  static async getUnreadCount(userId: string) {
    return Notification.countDocuments({ user: userId, isRead: false });
  }

  static async create(data: {
    userId: string;
    type: string;
    title: string;
    body: string;
    entityType?: string;
    entityId?: string;
    deepLink?: string;
  }) {
    return Notification.create({
      user: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        deepLink: data.deepLink,
      },
      channels: ['in_app'],
    });
  }
}
