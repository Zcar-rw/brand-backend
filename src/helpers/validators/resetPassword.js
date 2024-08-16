import Joi from 'joi'

const schema = {
  onResetPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  onVerifyResetCode: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().required()
  }),

  onUpdatePassword: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
    password: Joi.string()
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$/)
    .required()
    .messages({
        'string.pattern.base': 'Password must contain at least one capital letter, one special character, one number, and be at least 8 characters long',
        'any.required': 'Password is required',
      })
  })
}

const resetPasswordValidations = {
  resetPassword (req, res, next){
    const { error } = schema.onResetPassword.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ""),
      });
    }
    return next()
  },

  verifyResetCode (req, res, next){
    const { error } = schema.onVerifyResetCode.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ""),
      });
    }
    return next()
  },

  updatePassword (req, res, next){
    const { error } = schema.onUpdatePassword.validate(req.body)
    if (error) {
      return res.status(400).json({
        error: error.details[0].message.replace(/["'`]+/g, ""),
      });
    }
    return next()
  }
};

export default resetPasswordValidations
