const getPurchaseSuccessEmailTemplate = (purchaseDetail, user) => {
  const {
    address,
    city,
    id_country,
    name,
    phone,
    postcode,
    fecha_compra,
    paypal_order_id,
    email,
  } = user;

  const totalAmount = purchaseDetail.reduce(
    (prev, current) => prev + current.price,
    0
  );

  let emailHTML = `
    <h1>Purchase</h1>
    
    <h2>User</h2>
    
    <ul>
        <li>Name: ${name}</li>
        <li>${email}</li>
        <li>Address: ${address}</li>
        <li>City: ${city}</li>
        <li>Country: ${id_country}</li>
        <li>Phone: ${phone}</li>
        <li>Postcode: ${postcode}</li>
        <li>Date: ${fecha_compra}</li>
        <li>Paypal Order Id: ${paypal_order_id}</li>
    </ul>

    <h2>Detail</h2>
    
    <ul>
  `;

  purchaseDetail.forEach(
    ({ name, price }) =>
      (emailHTML += `<li>
                        ${name}: € ${price}
                    </li>`)
  );

  emailHTML += `</ul>`;

  emailHTML += `<h2>Total: € ${totalAmount}</h2>`;

  const purchaseSuccessEmailTemplate = {
    text: 'Plain Text SUCCESS, TO DO!!!',
    html: emailHTML,
  };

  return purchaseSuccessEmailTemplate;
};

module.exports = getPurchaseSuccessEmailTemplate;
