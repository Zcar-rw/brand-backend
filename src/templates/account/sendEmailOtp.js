export default (code) => {
  const message = `<h3>Verification Code</h3><br /><div>To verify your account, enter this code in Reach:</div><div style='margin:10px 0;font-size: 32px'>${code}</div>Verification codes expire after 48 hours.`;
  const subject = `${code} is your verification code`;
  return { message, subject };
};
