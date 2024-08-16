import axios from 'axios'
import 'dotenv/config'

const { ONESIGNAL_URL, ONESIGNAL_APP_ID } = process.env

export default async (player, message, title, data = {}) => {
  axios
    .post(`${ONESIGNAL_URL}/notifications`, {
      include_player_ids: [player],
      app_id: ONESIGNAL_APP_ID,
      contents: {
        en: message,
      },
      headings: {
        en: title,
      },
      data,
      url: '',
      chrome_web_image: '',
    })
    .then((response) => {
    }).catch(error => {
      console.log(error)
    })
  return true
}
