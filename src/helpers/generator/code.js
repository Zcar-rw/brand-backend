import uniqid from 'uniqid';

export default (type) => {
  let codeType;
  switch (type) {
    case 'BUSINESS':
        codeType =  uniqid('BI').toUpperCase()
        break;
    case 'PAYMENT':
        codeType =  uniqid('PA').toUpperCase()
        break;
    case 'BOOKING':
        codeType =  uniqid('BO').toUpperCase()
        break;
    default:
        break;
}
  return codeType;
};
