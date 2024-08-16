
export default () => {
    const code = Date.now().toString();
    return code.substring(code.length - 6, code.length); // take 5 chars
    
  };
  