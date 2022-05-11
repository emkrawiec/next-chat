// import nodemailer from 'nodemailer';
import mailjet from 'node-mailjet';

// export const mailer = nodemailer.createTransport({
//   host: 'stolarstwo-borecki.thecamels.pl',
//   port: 587,
//   secure: false,
//   tls: {
//     rejectUnauthorized: false,
//   },
//   auth: {
//     user: 'wordpress@stolarstwo-borecki.pl',
//     pass: '&]J!A3D3?Y1G',
//   },
// });

export const mailer = mailjet.connect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_SECRET_KEY!,
  {
    version: 'v3',
  }
);
