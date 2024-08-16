import db from '../../database/models'

/**
 * @param {object} where
 * @returns {boolean} return true if the user exists or false if not
 */
export default async (ids) => {
  let where = { userId: ids }
  let players = []
  try {
    const response = await db['OneSignalDevice'].findAll(
      {
        where,
        raw: true,
      },
      { logging: false }
    )
    response.map((player) => {
      players.push(player.playerId)
    })
    return players
  } catch (error) {
    return false
  }
}
