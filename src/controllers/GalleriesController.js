/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import { FindAll, Create, Delete } from '../database/queries'

export default class GalleriesController {
  static async getAllGalleries(req, res) {
    try {
      const response = await FindAll('Galleries')
      return res.status(status.OK).send({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Sorry, something went wrong',
      })
    }
  }

  static async getGalleriesByCar(req, res) {
    try {
      const where = {
        carId: req.car.id,
      }
      const response = await FindAll('Galleries', where)
      return res.status(status.OK).send({
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Sorry, something went wrong',
      })
    }
  }

  static async createGallery(req, res) {
    let data = req.body
    data = {
      ...data,
      carId: req.car.id,
    }
    const response = await Create('Galleries', data)
    try {
      return res.status(status.CREATED).send({
        message: 'Gallery created successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Sorry, something went wrong',
      })
    }
  }

  static async deleteGallery(req, res) {
    const { id } = req.params
    try {
      const response = await Delete('Galleries', { id })
      return res.status(status.OK).send({
        message: 'Gallery deleted successfully',
        response,
      })
    } catch (error) {
      return res.status(status.BAD_REQUEST).send({
        error: 'Sorry, something went wrong',
      })
    }
  }
}
