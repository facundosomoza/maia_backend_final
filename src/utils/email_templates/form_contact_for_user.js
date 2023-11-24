const getFormContactForUserTemplate = (params) => {
  let emailHTML = `CONTACT CONFIRMATION
                   <h2>Hi, ${params.firstName} ${params.lastName}</h2> 
                   <h3>You message</h3>                     
                   <p>${params.message}</p>                    
                  `;

  const emailFormContactForUserTemplate = {
    text: "CONTACT CONFIRMATION!!!!! TO DO!!!",
    html: emailHTML,
  };

  return emailFormContactForUserTemplate;
};

module.exports = getFormContactForUserTemplate;
