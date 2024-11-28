import Joi from 'joi';

const schema = {
  onScheduleCreate: Joi.object({
    carId: Joi.string().uuid().required(),
    bookingDetailId: Joi.string().uuid().required(),
    driverId: Joi.string().uuid().required(),
  }),
};

const scheduleValidations = {
  scheduleCreation(req, res, next) {
    const { error } = schema.onScheduleCreate.validate({
      carId: req.body.carId,
      bookingDetailId: req.body.bookingDetailId,
      driverId: req.body.driverId,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default scheduleValidations;
