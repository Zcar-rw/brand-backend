
export default (type) => {
  let code;
  switch (type) {
    case 'topup':
        code =  'TU' + Date.now().toString(36).toUpperCase()
        break;
    case 'cashout':
        code =  'CO' + Date.now().toString(36).toUpperCase()
        break;
    case 'ride':
        code =  'RD' + Date.now().toString(36).toUpperCase()
        break;
    case 'fundTransfer':
      code =  'FT' + Date.now().toString(36).toUpperCase()
      break;
    case 'refund':
      code =  'RF' + Date.now().toString(36).toUpperCase()
      break;
    default:
        break;
}
  return code;
};
