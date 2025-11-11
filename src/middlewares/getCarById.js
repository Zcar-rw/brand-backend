import status from '../config/status';
import { FindOne } from '../database/queries';
import db from '../database/models';

export default async (req, res, next) => {
  try {
    const { carId } = req.params;

    // Include relations similar to public list and details needs
    const include = [
      {
        model: db.CarModel,
        as: 'carModel',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          { model: db.CarMake, as: 'carMake', attributes: { exclude: ['createdAt', 'updatedAt'] } },
          { model: db.CarType, as: 'carType', attributes: { exclude: ['createdAt', 'updatedAt'] } },
        ],
      },
      { model: db.Supplier, as: 'supplier', attributes: { exclude: ['createdAt', 'updatedAt', 'createdBy', 'tin'] } },
    ];

    const car = await FindOne('Car', { _id: carId }, include);

    if (!car || car.errors || Object.keys(car).length === 0) {
      return res.status(status.NOT_FOUND).json({
        error: 'The car you are looking for can not be found at this moment.',
      });
    }

    req.car = car;
    req.body.carId = car.id;
    next();
  } catch (e) {
    return res.status(status.BAD_REQUEST).json({
      error: 'Failed to retrieve car details',
    });
  }
};
