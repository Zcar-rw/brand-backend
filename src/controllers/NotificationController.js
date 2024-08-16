/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import * as helper from '../helpers'
import { FindAll, FindOrCreate } from '../database/queries'
import admin from 'firebase-admin'

export default class NotificationController {
  static async getUserNotifications(req, res) {
    const where = {
      receiverId: req.user.id,
    }
    const response = await FindAll('Notification', where)
    return response && response
      ? res.status(status.CREATED).json({
          response,
        })
      : res.status(status.NO_CONTENT).json({
          message: 'No notifications at this moment',
        })
  }

  // REGISTER FIREBASE NOTIFICATION TOKEN
  static async registerOneSignalPlayerId(req, res) {
    const data = {
      playerId: req.body.playerId,
      userId: req.user.id,
    }
    try {
      // CHECK FIND PLAYER OR RECORD
      const { created } = await FindOrCreate(
        'OneSignalDevice',
        {
          playerId: req.body.playerId,
          userId: req.user.id,
        },
        data
      )
      return created
        ? res.status(status.CREATED).json({
            message: 'PlayerId has been saved successfully',
          })
        : res.status(status.CREATED).json({
            message: 'PlayerId of the user is already exist',
          })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
  // SEND PUSH NOTIFICATIONS, ADMIN CAN USE IT TOO
  static async sendPushNotification(req, res) {
    const { userIds, message, title } = req.body
    try {
      // #1. Helper: Pass userId, return playerIds
      await helper.oneSignal.getPlayers(userIds).then((players) => {
        // #2. Helper: Send push notification to playerIds
        players.map((player) => {
          helper.oneSignal.sendNotification(player, message, title)
        })
      })
      return res
        .status(status.CREATED)
        .send({ message: 'Push notification was sent notifications!' })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      })
    }
  }
}
