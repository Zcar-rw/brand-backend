// Deprecated: Sequelize-specific helper. Kept for backward compatibility but no-op in Mongo setup.
export const dbFindSingle = async () => ({});
export const dbFindAll = async () => ({ response: [], meta: {} });
export const dbCreate = async () => ({});
export const dbDelete = async () => ({ response: 0 });
export const dbUpdate = async () => ({});
