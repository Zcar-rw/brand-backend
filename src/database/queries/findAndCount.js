import db from '../models';

export default async (
  Model,
  condition = {},
  include = null,
  limit,
  offset,
  order
) => {
  order = order || [['createdAt', 'DESC']];
  try {
    const response = await db[Model].findAndCountAll(
      {
        where: condition,
        include,
        order,
        limit,
        offset,
      },
      { logging: false, raw: true }
    );
    return { response: response.rows, meta: { count: response.count || null } };
  } catch (error) {
    return error;
  }
};
