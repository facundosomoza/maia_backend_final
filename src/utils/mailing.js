const nodemailer = require("nodemailer");

const emailTypes = require("./email_types");

const getPurchaseSuccessEmailTemplate = require("./email_templates/purchase_success");
const getRecoveryPasswordEmailTemplate = require("./email_templates/recovery_password");
const getEmailRegisterConfirmationTemplate = require("./email_templates/email_register_confirmation");
const getFormContactTemplate = require("./email_templates/form_contact");
const getFormContactForUserTemplate = require("./email_templates/form_contact_for_user");

const send = (type, onSendFinish, data) => {
  const { mailTo, bcc, subject, text, html } = data;

  console.log("SUBJECT", subject, bcc);

  const emailConfig = {
    SMTP: {
      host: "c1471734.ferozo.com",
      port: 465,
    },
  };

  const transporter = nodemailer.createTransport({
    host: emailConfig.SMTP.host,
    port: emailConfig.SMTP.port,
    secure: true,
    auth: {
      user: "info@maiatsintsadzeart.com",
      pass: "Maiko1010@",
    },
    tls: { rejectUnauthorized: false },
  });

  let mailOptions = {
    from: "Maia Tsintsadze <info@maiatsintsadzeart.com>",
    to: mailTo,
    bcc: bcc,
  };

  mailOptions = {
    ...mailOptions,
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, onSendFinish);
};

const handleSendEmail = (error, info) => {
  if (error) {
    console.log("Error al enviar el email", error);
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

    //TEST!!!!!! (Cuando alguien compra, mandar email a Maia)
    emailData.bcc = "fsomoza@gmail.com";
  } else if (emailType === emailTypes.PASSWORD_RECOVERY_LINK) {
    template = getRecoveryPasswordEmailTemplate(params);
  } else if (emailType === emailTypes.EMAIL_REGISTER_CONFIRMATION) {
    template = getEmailRegisterConfirmationTemplate(params);
  } else if (emailType === emailTypes.FORM_CONTACT) {
    template = getFormContactTemplate(params);
  } else if (emailType === emailTypes.FORM_CONTACT_FOR_USER) {
    template = getFormContactForUserTemplate(params);
  }

  let { text, html } = template;

  send(emailType, handleSendEmail, {
    ...emailData,
    text,
    html,
  });
};

module.exports = sendEmail;
