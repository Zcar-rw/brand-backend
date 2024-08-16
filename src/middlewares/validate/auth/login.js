import Joi from 'joi';

export default (user) => {
  const schema = Joi.object().keys({
    email: Joi.email().min(16).max(85).required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
  });

  return Joi.validate(user, schema, { abortEarly: false });
};
