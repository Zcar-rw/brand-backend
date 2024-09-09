import bcrypt from 'bcryptjs'

export default (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}
