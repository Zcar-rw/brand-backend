import Joi from 'joi';

const schema = {
  onCarCreate: Joi.object({
    modelId: Joi.string().required(),
    supplierId: Joi.string().required(),
    amount: Joi.number().required(),
    baseAmount: Joi.number().required(),
    // carMakeId: Joi.string().required(),
    plateNumber: Joi.string()
      .regex(/^R[A-Z]{2}\d{3}[A-Z]$/)
      .required(),
  }),
};

const carValidations = {
  carCreation(req, res, next) {
    const { error } = schema.onCarCreate.validate({
      modelId: req.body.modelId,
      supplierId: req.body.supplierId,
      amount: req.body.amount,
      baseAmount: req.body.baseAmount,
      // carMakeId: req.body.carMakeId,
      plateNumber: req.body.plateNumber,
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
