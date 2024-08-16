function generateUniqueString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }
  
function generateUnique8CharacterString() {
const generatedStrings = new Set();
let uniqueString = '';

while (uniqueString.length < 8) {
    uniqueString = generateUniqueString(8);
    if (!generatedStrings.has(uniqueString)) {
    generatedStrings.add(uniqueString);
    break;
    }
}

return uniqueString;
}

export {
    generateUnique8CharacterString as generateRideShareId
}
  