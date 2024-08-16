import bcrypt from 'bcryptjs'

export default (password, hashedPassword) => {
  console.log('--->password, hashedPassword', password, hashedPassword)
  return bcrypt.compareSync(password, hashedPassword)
}
