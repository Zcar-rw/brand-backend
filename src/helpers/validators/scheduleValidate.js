import Joi from 'joi';

const schema = {
  onScheduleCreate: Joi.object({
    bookingId: Joi.string().uuid().required(),
    carId: Joi.string().uuid().required(),
    priceListId: Joi.string().uuid().required(),
    amount: Joi.number().min(10).max(1000000).required(),
  }),
};

const scheduleValidations = {
  scheduleCreation(req, res, next) {
    const { error } = schema.onScheduleCreate.validate({
      bookingId: req.body.bookingId,
      carId: req.body.carId,
      priceListId: req.body.priceListId,
      amount: req.body.amount,
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
