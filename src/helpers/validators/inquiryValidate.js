import Joi from 'joi';

const schema = {
  onInquiryCreate: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    comment: Joi.string().required(),
    typeId: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    createdBy:  Joi.string().optional(),
    companyId:  Joi.string().optional(),
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
      createdBy: req.body.createdBy,
      companyId: req.body.companyId,
    });
    if (error) {
      console.log('hello')
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
};

export default inquiryValidations;
