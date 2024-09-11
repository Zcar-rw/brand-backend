import Joi from 'joi';

const schema = {
  onInquiryCreate: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    comment: Joi.string().required(),
    typeId: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
  }),
};

const inquiryValidations = {
  inquiryCreation(req, res, next) {
    const { error } = schema.onInquiryCreate.validate({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      comment: req.body.comment,
      typeId: req.body.typeId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default inquiryValidations;
