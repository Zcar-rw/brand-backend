import Joi from 'joi';

const schema = {
  onCarMakeCreate: Joi.object({
    name: Joi.string().min(2).max(60).required(),
    slug: Joi.string().min(2).max(80).optional(),
    photo: Joi.string().allow('').optional(),
    popular: Joi.boolean().optional(),
  }),
};

const carMakeValidations = {
  carMakeCreation(req, res, next) {
    const { error } = schema.onCarMakeCreate.validate({
      name: req.body.name,
      slug: req.body.slug,
      photo: req.body.photo,
      popular: req.body.popular,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default carMakeValidations;
