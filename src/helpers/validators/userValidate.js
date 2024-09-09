import Joi from 'joi';

const userFields = {
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().length(10).required(),
};

const internalUserSchema = Joi.object({
  ...userFields,
  roleId: Joi.string().required(),
});
const companyUserSchema = Joi.object({
  ...userFields,
  roleId: Joi.string().required(),
  companyId: Joi.string().required(),
});

const clientIndividualUserSchema = Joi.object({
  ...userFields,
  password: Joi.string().required(),
});

const clientBusinessUserSchema = Joi.object({
  ...userFields,
  password: Joi.string().required(),
  businessName: Joi.string().required(),
  TIN: Joi.string().required(),
  address: Joi.string().required(),
});

const userValidations = {
  registerInternalUser(req, res, next) {
    const { error } = internalUserSchema.validate({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      roleId: req.body.roleId,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },
  registerCompanyUser(req, res, next) {
    const { error } = companyUserSchema.validate({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      roleId: req.body.roleId,
      companyId: req.body.companyId,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ''),
      });
    }
    return next();
  },

  registerClientUser(req, res, next) {
    try {
      const { type, ...rest } = req.body;
      const schema =
        type === 'individual'
          ? clientIndividualUserSchema
          : clientBusinessUserSchema;
      const { error } = schema.validate(rest);

      if (error) {
        return res.status(400).json({
          error: error.details[0].message.replace(/["'`]+/g, ''),
        });
      }
      return next();
    } catch (error) {}
  },
};

export default userValidations;
