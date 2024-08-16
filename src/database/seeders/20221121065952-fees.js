import { v4 as uuidv4 } from 'uuid';
const fees = [
  {
    id: uuidv4(),
    VAT: 18,
    LOCAR_PROFIT_MARGIN: 13,
    WITHHOLDING_TAX: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

];

export default {
  up: (queryInterface) => queryInterface.bulkInsert('Fees', fees, {}),

  down: (queryInterface) => queryInterface.bulkDelete('Fees', null, {}),
};
