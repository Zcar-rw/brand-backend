import Joi from 'joi';

const ServiceEnum = Object.freeze({
  CAR_HIRE: 'carHire',
  AIRPORT_SHUTTLE: 'airportShuttle',
  EVENTS: 'events',
});

const BookingStatusEnum = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  CANCELLED: 'cancelled',
});

const schema = {
  onBookingCreate: Joi.object({
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
  onBookingInfoCreate: Joi.object({
    service: Joi.string()
      .valid(...Object.values(ServiceEnum))
      .required(),
    message: Joi.string().required(),
  }),
  onBookingStatusUpdate: Joi.object({
    status: Joi.string()
      .valid(...Object.values(BookingStatusEnum))
      .required(),
  }),
};

const multipleBookingsSchema = Joi.array().items(schema.onBookingCreate);

const bookingValidations = {
  bookingCreation(req, res, next) {
    const { error } = schema.onBookingCreate.validate({
      // customerId: req.body.customerId,
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

  // multipleBookingCreation(req, res, next) {},
  multipleBookingCreation(req, res, next) {
    const { error } = multipleBookingsSchema.validate(req.body.details);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },

  bookingInfoCreation(req, res, next) {
    const { error } = schema.onBookingInfoCreate.validate({
      service: req.body.info.service,
      message: req.body.info.message,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },

  bookingStatusUpdate(req, res, next) {
    const { error } = schema.onBookingStatusUpdate.validate({
      status: req.body.status,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default bookingValidations;
