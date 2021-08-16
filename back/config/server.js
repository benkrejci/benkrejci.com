require('dotenv').config({ path: '../.env' })

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', process.env.BACK_PORT),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '76f798895bad1d2d3ad7cc99fa729fd0'),
    },
  },
});
