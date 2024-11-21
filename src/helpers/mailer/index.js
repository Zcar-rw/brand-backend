import dotenv from 'dotenv';
import mailjet from 'node-mailjet';
import template from './template';
import db from '../../database/models';

dotenv.config();

const { MAILJET_KEY, MAILJET_SECRETKEY, MAILJET_EMAIL_SENDER } = process.env;
const mailjetClient = mailjet.connect(MAILJET_KEY, MAILJET_SECRETKEY);

export default async (message, subject, email, notification = {}) => {
  const request = mailjetClient.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: MAILJET_EMAIL_SENDER,
          Name: 'Kale',
        },
        To: [
          {
            Email: email,
            Name: '',
          },
        ],
        Subject: subject,
        TextPart: subject,
        HTMLPart: template(message),
        CustomID: 'KaleMail',
      },
    ],
  });
  request
    .then(() => {
      // if (notification.receiverId) {
      //   const mail = {
      //     receiverId: notification.receiverId || null,
      //     email,
      //     message: notification.message,
      //     type: notification.type || null,
      //     isForUser: notification.isForUser || true,
      //     itemId: notification.itemId,
      //   };
      //   db['Notification'].create(mail);
      // }
      return;
    })
    .catch((err) => {
      console.log(err)
      throw new Error(err.statusCode);
    });
};
