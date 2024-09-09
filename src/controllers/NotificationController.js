/* eslint-disable require-jsdoc */
import 'dotenv/config';
import status from '../config/status';
import * as helper from '../helpers';
import { FindAll, FindAndCount } from '../database/queries';

export default class NotificationController {
  static async getUserNotifications(req, res) {
    const { page, limit } = req.query;
    if (!page) {
      return res.status(status.BAD_REQUEST).send({
        response: [],
        error: 'Sorry, pagination parameters are required[page, limit]',
      });
    }
    const count = limit || 9;
    const offset = page === 1 ? 0 : (parseInt(page, 10) - 1) * count;

    const condition = {
      receiverId: req.user.id,
    };
    const include = [];
    const { response, meta } = await FindAndCount(
      'Notification',
      condition,
      include,
      limit,
      offset,
    );
    return response && response
      ? res.status(status.OK).json({
          meta: helper.generator.meta(
            meta.count,
            limit,
            parseInt(page, 10) || 1,
          ),
          response,
        })
      : res.status(status.NO_CONTENT).json({
          message: 'No notifications at this moment',
        });
  }

  // SEND PUSH NOTIFICATIONS, ADMIN CAN USE IT TOO
  static async sendPushNotification(req, res) {
    const { userIds, message, title } = req.body;
    try {
      // #1. Helper: Pass userId, return playerIds
      await helper.oneSignal.getPlayers(userIds).then((players) => {
        // #2. Helper: Send push notification to playerIds
        players.map((player) => {
          helper.oneSignal.sendNotification(player, message, title);
        });
      });
      return res
        .status(status.CREATED)
        .send({ message: 'Push notification was sent notifications!' });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      });
    }
  }
}
