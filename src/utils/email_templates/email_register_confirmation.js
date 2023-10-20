const getEmailRegisterConfirmationTemplate = (params) => {
  const { activationHash } = params;

  let emailHTML = `
                    <p>Hello,</p>
                    <p>To confirm your password click <a href="${activationHash}">here</a>                    
                  `;

  const emailRegisterConfirmationTemplate = {
    text: "Plain Text to confirm register email!!! TO DO!!!",
    html: emailHTML,
  };

  return emailRegisterConfirmationTemplate;
};

module.exports = getEmailRegisterConfirmationTemplate;
