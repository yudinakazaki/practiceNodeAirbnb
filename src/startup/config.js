require('dotenv').config()

module.exports = () => {
  if(!process.env.JWTSECRETKEY){
    throw new Error('FATAL ERROR: JWT signature key is not defined!')
  }
}