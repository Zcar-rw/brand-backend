import { Create } from '../database/queries'
import * as helper from '../helpers'

export default class NotificationsServices {
  // SEND PUSH NOTIFICATIONS, ADMIN CAN USE IT TOO
  static async sendPushNotification(userIds, message, title, data = {}) {
    try {
      // #1. Helper: Pass userId, return playerIds
      await helper.oneSignal.getPlayers(userIds).then((players) => {
        // #2. Helper: Send push notification to playerIds
        players.map((player) => {
          helper.oneSignal.sendNotification(player, message, title, data)
        })
      })
      return { message: 'Push notification was sent notifications!' }
    } catch (error) {
      return {
        error: error.message,
      }
    }
  }
  // SAVE  NOTIFICATIONS, FRO DRIVER AND PASSENGER
  static async saveNotification(receiverId, message, type, rideId = null, accountType) {
    try {
      await Create('Notification', {
        receiverId,
        message,
        type,
      })
      return
    } catch (error) {
      return
    }
  }
}
