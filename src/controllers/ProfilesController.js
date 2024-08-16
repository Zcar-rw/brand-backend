import 'dotenv/config';
import status from '../config/status';
import {
  Create, FindOne, FindAll, Search, Update
} from '../database/queries';

/**
 * A class to handle cars
 */
export default class ProfilesController {
  static async createProfile(req, res) {
    const data = req.body;
    const response = await Create('Profile', data);
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
        error:
            'Sorry, you can not create profile right now, try again later.',
      })
      : res.status(status.CREATED).json({
        response,
      });
  }

  static async getAllProfiles(req, res) {
    const include = [];
    const { response, meta } = await FindAll('Profile', undefined, include);
    if (response && !response.length) {
      return res.status(status.NO_CONTENT).send({
        response: [],
        error: 'Sorry, No Profile found!',
      });
    }
    return response && response.errors
      ? res.status(status.BAD_REQUEST).send({
        error: 'Profiles can not found at this moment, try again later',
      })
      : res.status(status.OK).json({
        meta,
        response,
      });
  }

  static async searchProfiles(req, res) {
    const { key } = req.query;
    const field = 'names';
    const include = [];
    const { response, meta } = await Search('Profile', key, field, include);
    return res.status(status.OK).json({
      response,
    });
  }
  static async getOneProfile(req, res) {
    const { id } = req.params;
    const response = await FindOne('Profile', { id }, undefined);
    return Object.keys(response).length > 0
      ? res.status(status.OK).json({
        response,
      })
      : res.status(status.NOT_FOUND).send({
        error: 'The profile you are looking for can not be found',
      });
  }
  static async updateProfile(req, res) {
    const where = {
      id: req.user.user.id,
    };
    const data = req.body;
    const response = await Update('Profile', data, where);
    try {
      return res.status(status.OK).json({
        message: 'Profile updated successfully',
        response,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      });
    }
  }

  static async getAllProfilesByAdmin(req, res) {
    const include = [
      {
        model: db.User,
        as: 'profile',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      }
    ];

    const { response, meta } = await FindAll('Profile', undefined, include);
    try {
      return res.status(status.OK).json({
        meta,
        message: 'User Profile retrieved successfully',
        response,
      });
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: error.message,
      });
    }
  }
}
