import 'dotenv/config';
import status from '../config/status';
import { FindAll, Create } from '../database/queries';
import generateErrorResponse from '../helpers/generateErrorResponse';

/**
 * A class to handle cars
 */
export default class CarMakesController {
  static async getAllMakes(req, res) {
    const include = [];
    const order = [['name', 'ASC']];
    const { response, meta } = await FindAll(
      'CarMake',
      undefined,
      include,
      order
    );
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No car bands found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
          error: 'Car brands not found at this moment, try again later',
        })
      : res.status(status.OK).json({
          meta,
          response,
        });
  }

  static async createMake(req, res) {
    try {
      const { name, slug, photo, popular } = req.body
      // derive slug if not provided (simple slugifier without uniqid)
      const derivedSlug = slug
        ? String(slug).toLowerCase()
        : String(name)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

      const payload = {
        name,
        slug: derivedSlug,
        photo,
        popular: Boolean(popular),
      }

      const response = await Create('CarMake', payload)
      if (response && response.errors) {
        return res.status(status.BAD_REQUEST).send({
          error: 'Sorry, you cannot create a car make right now. Try again later',
        })
      }
      return res.status(status.CREATED).json({ response })
    } catch (error) {
      // handle duplicate slug/email, etc.
      const errMsg = generateErrorResponse(error, res)
      return res.status(status.BAD_REQUEST).send({ error: errMsg })
    }
  }
}
