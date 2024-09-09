const { Sequelize } = require('sequelize');

export default function generateErrorResponse(error, res) {
  if (error instanceof Sequelize.ValidationError) {
    const validationMessages = error.errors.map(
      (err) => `${err.path}: ${err.message}`,
    );
    return `Validation error(s): ${validationMessages.join('; ')}`;
  } else if (error instanceof Sequelize.UniqueConstraintError) {
    const message = `A record with that ${error.fields[0]} already exists.`;
    return message;
  } else if (error instanceof Sequelize.ForeignKeyConstraintError) {
    const message = `A record with that ${error.fields[0]} does not exist.`;
    return message;
  } else {
    const message = 'An error occurred.';
    return message;
  }
}
