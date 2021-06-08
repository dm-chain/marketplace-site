export default {
  to: process.env.MAIL_TO ?? 'contact@grandbazar.io',
  subject: process.env.MAIL_SUBJECT ?? 'Never miss a drop',
  apiUrl: 'https://api-v0.hst11.itglobal.com/form',
  successMsg: 'Thank you for subscribing!'
};
