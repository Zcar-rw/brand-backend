/* eslint-disable require-jsdoc */
import 'dotenv/config'
import status from '../config/status'
import { FindAll, Create, FindOne, Update } from '../database/queries'
import db from '../database/models'
import { RideService } from '../services'
import { condition } from 'sequelize'

export default class RideStationControllers{
    static async getAllRidePickupStations(req, res){
        const {rideId} = req.params
        const condition = {rideId}
        const include = [
          {
            model: db.Station,
            as: 'station',
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ]
        try {
          const response = await FindAll('RidePickupStation', condition, include)
          return res.status(status.OK).send({
            response,
          })
        } catch (error) {
          return res.status(status.BAD_REQUEST).send({
            error: 'Sorry, something went wrong',
          })
        }
    
      }

    static async createPickIn (req, res){
      const data = req.body
      const rideId = req.params.rideId
      const resp = await RideService.isStationOnRidePickupStation(rideId, data.stationId, req.user.id)
      return res.status(200).json({
        resp
      })
    }


    static async createRidePickupStation(req, res) {
      let data = req.body
      data.rideId = req.params.rideId
      data = {
        ...data,
        userId: req.user.id,
        type: 'starting',
      }
      const condition ={
          rideId: data.rideId,
          type: 'starting'
      }
      const onePickUp = await FindOne('RidePickupStation', condition)

      if (Object.keys(onePickUp).length === 0) {
        try {
            //1. check station on dropoff
          const isExist = await RideService.isStationOnRideDropffStation(data.rideId, data.stationId, data.userId)
          if(isExist){
            return res.status(status.EXIST).json({
              message: 'Provided station is already a dropoff'
            })
          }
          // 2. Create RidePickupStation
          const response = await Create('RidePickupStation', data)
          
          // 3. Update covering areas of a Ride
          if(response.id){
            await RideService.updateCoveringAreas(data.rideId, data.stationId)
          }

          // 4. Update dateOfRide attribute of a Ride
          if(response.id){
           await RideService.setDateOfRide(response.rideId, response.departureTime)
          }
          
          return res.status(status.CREATED).send({
              message: 'Starting PickUp station created successfully',
              response
          })
          } catch (error) {
          return res.status(status.BAD_REQUEST).send({
              error: 'Sorry, something went wrong',
          })
          }
      }
      return res.status(status.EXIST).send({
        message: 'Starting station already exists on this Ride',
      })
    }

    static async createRidePickInStation(req, res) {
      let data = req.body
      data.rideId = req.params.rideId
      data = {
        ...data,
        userId: req.user.id,
        type: 'pickIn'
      }
      try {
        //1. check station on dropoff
        const isDropoffExist = await RideService.isStationOnRideDropffStation(data.rideId, data.stationId, data.userId)
        const isPickupExist = await RideService.isStationOnRidePickupStation(data.rideId, data.stationId, data.userId)
        if(isDropoffExist || isPickupExist){
          return res.status(status.EXIST).json({
            message: 'Provided station is already as dropoff or pickup'
          })
        }
        // 2. Create PickIn station
        const response = await Create('RidePickupStation', data)

        // 3. Update covering areas of a Ride
        if(response.id){
          await RideService.updateCoveringAreas(data.rideId, data.stationId)
        }

        return res.status(status.CREATED).send({
          message: 'PickIn station created successfully',
          response,
        
        })
      } catch (error) {
        return res.status(status.BAD_REQUEST).send({
          error: 'Sorry, something went wrong',
        })
      }
    }

      // Dropoff 

    static async getRideDropOffStation(req, res) {
      const {rideId} = req.params
      const condition = {rideId}
      const include = [
        {
          model: db.Station,
          as: 'station',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
        },
      ]
      try {
        const response = await FindOne('RideDropoffStation', condition, include)
        return res.status(status.OK).send({
          response,
        })
      } catch (error) {
        return res.status(status.BAD_REQUEST).send({
          error: 'Sorry, something went wrong',
        })
      }
    }
    
    static async createRideDropOffStation(req, res) {
      let data = req.body
      data.rideId = req.params.rideId
      data = {
        ...data,
        userId: req.user.id,
      }

      const condition = {
        rideId: req.params.rideId
      }
      
      // CHECK IF DROPOFF EXISTS ON THIS RIDE
      const oneDroppoff = await FindOne('RideDropoffStation', condition)
      if (Object.keys(oneDroppoff).length === 0) {
        try {
          // 1. Create dropoff station
            const response = await Create('RideDropoffStation', data)
          
          // 2. Update covering areas of a Ride
            if(response.id){
              await RideService.updateCoveringAreas(data.rideId, data.stationId)
            }
            
            return res.status(status.CREATED).send({
              message: 'Dropoff station created successfully',
              response,
            })
          } catch (error) {
            return res.status(status.BAD_REQUEST).send({
              error: 'Sorry, something went wrong',
            })
          }
      }
      return res.status(status.EXIST).send({
        message: 'Dropoff station on this ride already Exists',
      })
    }
}
