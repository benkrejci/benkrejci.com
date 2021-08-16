require('dotenv').config({ path: '../.env' })

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', process.env.BACK_PORT),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', process.env.SECRET),
    },
  },
});
