import db from '../models';

export default async (
  Model,
  condition = {},
  include = null,
  limit,
  offset,
  order,
) => {
  order = order || [['createdAt', 'DESC']];
  try {
    const count = await db[Model].count({
      where: condition,
    });

    const rows = await db[Model].findAll({
      where: condition,
      include,
      order,
      limit,
      offset,
    });

    return { response: rows, meta: { count } };
  } catch (error) {
    return error;
  }
};
