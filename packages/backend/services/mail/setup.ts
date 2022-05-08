import nodemailer from 'nodemailer';

// export const mailer = nodemailer.createTransport({
//   host: process.env.MAIL_HOST,
//   port: process.env.SMTP_MAIL_PORT,
//   secure: false,
//   tls: {
//     rejectUnauthorized: false, 
//   },
//   auth: {
//     user: process.env.SMTP_MAIL_USER,
//     pass: process.env.SMTP_MAIL_PASS
//   },
// });
export const mailer = nodemailer.createTransport({
  host: "stolarstwo-borecki.thecamels.pl",
  port: 587,
  secure: false,
  tls: {
    rejectUnauthorized: false, 
  },
  auth: {
    user: "wordpress@stolarstwo-borecki.pl",
    pass: '&]J!A3D3?Y1G'
  },
});

