const nodemailer = require("nodemailer");

const emailTypes = require("./email_types");

const getPurchaseSuccessEmailTemplate = require("./email_templates/purchase_success");
const getRecoveryPasswordEmailTemplate = require("./email_templates/recovery_password");
const getEmailRegisterConfirmationTemplate = require("./email_templates/email_register_confirmation");

const send = (type, onSendFinish, data) => {
  const { mailTo, bcc, subject, text, html } = data;

  console.log("SUBJECT", subject);

  const emailConfig = {
    SMTP: {
      host: "mail.privateemail.com",
      port: 465,
    },
  };

  const transporter = nodemailer.createTransport({
    host: emailConfig.SMTP.host,
    port: emailConfig.SMTP.port,
    secure: true,
    auth: {
      user: "admin@maiatsadzeart.com",
      pass: "niNuca1010",
    },
    tls: { rejectUnauthorized: false },
  });

  let mailOptions = {
    from: "Maia Tsintsadze <admin@maiatsadzeart.com>",
    to: mailTo, //"fsomoza@gmail.com",
    bcc: bcc, //"",
  };

  mailOptions = {
    ...mailOptions,
    subject, //"Testing",
    text, //"Testing plain text",
    html, //"<h1>Testing HTML</h1>",
  };

  transporter.sendMail(mailOptions, onSendFinish);
};

const handleSendEmail = (error, info) => {
  if (error) {
    console.log("Error al enviar el email");
  } else {
    console.log("Enviado!");
  }
};

const sendEmail = (params, user, emailType, subject) => {
  const emailData = {
    mailTo: params.email,
    subject,
  };

  let template = "";

  if (emailType === emailTypes.PURCHASE_SUCCESS) {
    template = getPurchaseSuccessEmailTemplate(params, user);
  } else if (emailType === emailTypes.PASSWORD_RECOVERY_LINK) {
    template = getRecoveryPasswordEmailTemplate(params);
  } else if (emailType === emailTypes.EMAIL_REGISTER_CONFIRMATION) {
    template = getEmailRegisterConfirmationTemplate(params);
  }

  let { text, html } = template;

  send(emailType, handleSendEmail, {
    ...emailData,
    text,
    html,
  });
};

module.exports = sendEmail;
