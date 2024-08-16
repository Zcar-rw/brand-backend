import Joi from 'joi';

// "model": "4x4",
// "plateNumber": "RAG 408 K",
// "year": "2023",
// "typeId": "",
// "carMakeId": "",
// "amount": 10,
// "baseAmount": 10,
// "photo": ""

const schema = {
  onCarCreate: Joi.object({
    model: Joi.string().required(),
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
    const { error } = schema.onCarCreate.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default carValidations;
