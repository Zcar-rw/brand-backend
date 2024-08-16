import Joi from 'joi';

const schema = {
  onSupplierCreate: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.string().required(),
    tin: Joi.number().required(),
  }),
};

const carValidations = {
  supplierCreation(req, res, next) {
    const { error } = schema.onSupplierCreate.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default carValidations;
