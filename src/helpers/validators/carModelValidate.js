import Joi from 'joi';

const schema = {
  onCarModelCreate: Joi.object({
    name: Joi.string().required(),
    photo: Joi.string().optional(),
    typeId: Joi.string().required(),
    carMakeId: Joi.string().required(),
    year: Joi.number()
      .integer()
      .min(1990)
      .max(new Date().getFullYear())
      .required(),
  }),
};

const registerCarModel = {
  carModelCreation(req, res, next) {
    const { error } = schema.onCarModelCreate.validate({
      name: req.body.name,
      year: req.body.year,
      typeId: req.body.typeId,
      carMakeId: req.body.carMakeId,
      photo: req.body.photo,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default registerCarModel;
