const nodemailer = require("nodemailer");

const emailTypes = require("./email_types");

const getPurchaseSuccessEmailTemplate = require("./email_templates/purchase_success");

const send = (type, onSendFinish, data) => {
  const { mailTo, bcc, subject, text, html } = data;

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

  switch (type) {
    case emailTypes.PURCHASE_SUCCESS:
      mailOptions = {
        ...mailOptions,
        subject, //"Testing",
        text, //"Testing plain text",
        html, //"<h1>Testing HTML</h1>",
      };

      break;
  }

  transporter.sendMail(mailOptions, onSendFinish);
};

const handleSendEmail = (error, info) => {
  if (error) {
    console.log("Error al enviar el email");
  } else {
    console.log("Enviado!");
  }
};

const sendEmail = (purchaseDetail, user) => {
  const emailData = {
    mailTo: "fsomoza@gmail.com",
    subject: "Purchase success",
  };

  const { text, html } = getPurchaseSuccessEmailTemplate(purchaseDetail, user);

  send(emailTypes.PURCHASE_SUCCESS, handleSendEmail, {
    ...emailData,
    text,
    html,
  });
};

module.exports = sendEmail;
