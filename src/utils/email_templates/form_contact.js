const getFormContactTemplate = (params) => {
  let emailHTML = `
                    <h2>${params.firstName} ${params.lastName}</h2> 
                    <h3>${params.subject}</h3> 
                    <h2>${params.userEmail}</h2> 
                    <p>${params.message}</p>                    
                  `;

  const emailFormContactTemplate = {
    text: "Contacto!!!!! TO DO!!!",
    html: emailHTML,
  };

  return emailFormContactTemplate;
};

module.exports = getFormContactTemplate;
