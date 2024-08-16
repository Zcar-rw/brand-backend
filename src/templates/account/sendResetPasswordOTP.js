export default (code) => {
    const message = `<h3>Reset Password Code</h3><br /><div>To reset password for your account, use this code:</div><div style='margin:10px 0;font-size: 32px'>${code}</div>Reset Password codes expire after 48 hours.`;
    const subject = `${code} is your Reset Password code`
    return { message, subject };
  };
  