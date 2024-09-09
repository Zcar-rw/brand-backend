import Joi from 'joi';

const schema = {
  onCarCreate: Joi.object({
    model: Joi.string().required(),
    supplierId: Joi.string().required(),
    amount: Joi.number().required(),
    baseAmount: Joi.number().required(),
    photo: Joi.string().optional(),
    typeId: Joi.string().required(),
    carMakeId: Joi.string().required(),
    plateNumber: Joi.string()
      .regex(/^R[A-Z]{2}\d{3}[A-Z]$/)
      .required(),
    year: Joi.number()
      .integer()
      .min(1998)
      .max(new Date().getFullYear())
      .required(),
  }),
};

const carValidations = {
  carCreation(req, res, next) {
    const { error } = schema.onCarCreate.validate({
      model: req.body.model,
      supplierId: req.body.supplierId,
      amount: req.body.amount,
      baseAmount: req.body.baseAmount,
      photo: req.body.photo,
      typeId: req.body.typeId,
      carMakeId: req.body.carMakeId,
      plateNumber: req.body.plateNumber,
      year: req.body.year,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default carValidations;
