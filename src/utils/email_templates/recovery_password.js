const getRecoveryPasswordEmailTemplate = (params) => {
  const { resetPasswordLink } = params;

  let emailHTML = `
                    <p>Hello,</p>
                    <p>We have received a request to reset your password.</p>
                    <p>Please click on the following link to reset your password:</p>
                    <a href="${resetPasswordLink}">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email.</p>
                 `;

  const recoveryPasswordEmailTemplate = {
    text: "Plain Text RECOVERY!!! TO DO",
    html: emailHTML,
  };

  return recoveryPasswordEmailTemplate;
};

module.exports = getRecoveryPasswordEmailTemplate;
