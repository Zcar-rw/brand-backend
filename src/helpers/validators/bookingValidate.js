import Joi from 'joi';

const ServiceEnum = Object.freeze({
  CAR_HIRE: 'carHire',
  AIRPORT_SHUTTLE: 'airportShuttle',
  EVENTS: 'events',
});

const schema = {
  onBookingCreate: Joi.object({
    customerId: Joi.string().uuid().required(),
    service: Joi.string()
      .valid(...Object.values(ServiceEnum))
      .required(),
    message: Joi.string().required(),
    carType: Joi.string().uuid().required(),
    date: Joi.date().required(),
    quantity: Joi.number().optional(),
    pickupLocation: Joi.string().required(),
    dropoffLocation: Joi.string().required(),
    pickupTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
    dropoffTime: Joi.string()
      .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
      .required(),
  }),
};

const bookingValidations = {
  bookingCreation(req, res, next) {
    const { error } = schema.onBookingCreate.validate({
      customerId: req.body.customerId,
      service: req.body.service,
      message: req.body.message,
      carType: req.body.carType,
      date: req.body.date,
      quantity: req.body.quantity,
      pickupLocation: req.body.pickupLocation,
      dropoffLocation: req.body.dropoffLocation,
      pickupTime: req.body.pickupTime,
      dropoffTime: req.body.dropoffTime,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
  multipleBookingCreation(req, res, next) {
    const { error } = Joi.object({
      bookings: Joi.array().items(schema.onBookingCreate).required(),
    }).validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default bookingValidations;
