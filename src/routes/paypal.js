const connection = require('../connection');
const emailTypes = require('../utils/email_types');

/* PAYPAL SANDBOX */

const CLIENT_ID =
  'AUsVdu_ALzBec4O2PpwAdMhbeZpLCAxUsrcl49tDo_D7vTzR3LoYpBFIfUsn986cd6JBXno64uCwYVSy';

const CLIENT_SECRET =
  'ENKIFmXupwnsBRpd2DIFh6a30GyOBP-ymFIpCM537bd1o7ZE0K4wbEmbJb7R24NwBhpqEV23RwnT8BAT';

/* PAYPAL LIVE */

//Primary email: myauqa@gmail.com

/* const CLIENT_ID =
  "AdTUHdeWxmLBjD2Okx5XUjkXdq8YNwmyC3GpLHIy2F1VqAk66_iXf4WivhMsQZXCsDAmJU0HBswA3FAR";

const CLIENT_SECRET =
  "EPobzdv-928DrvG1j1UA1_PtL3nU0pdR6YrID2X8ZhxbeKjm5x-zM02XcNtj0kw9f5nty5vnxCOXS0JO"; */

const express = require('express');

const paypal = require('@paypal/checkout-server-sdk');
const checkoutServerSdk = require('@paypal/checkout-server-sdk');
const sendEmail = require('../utils/mailing');

//SANDBOX ENVIRONMENT
const paylEnv = new paypal.core.SandboxEnvironment(CLIENT_ID, CLIENT_SECRET);

//LIVE ENVIRONMENT
//const paylEnv = new paypal.core.LiveEnvironment(CLIENT_ID, CLIENT_SECRET);

const client = new paypal.core.PayPalHttpClient(paylEnv);

const router = express.Router();

router.post('/createorder', (req, res) => {
  console.log('Creando orden desde el back', req.body);

  const userId = req.session.user.userId;

  /* Secret key:
  
  ENKIFmXupwnsBRpd2DIFh6a30GyOBP-ymFIpCM537bd1o7ZE0K4wbEmbJb7R24NwBhpqEV23RwnT8BAT */

  const request = new paypal.orders.OrdersCreateRequest();

  const { userData, cart } = req.body;

  const totalAmount = cart.reduce((prev, current) => current.price + prev, 0);

  const {
    firstName,
    surname,
    address,
    city,
    county,
    eircode,
    email,
    mobileNumber,
  } = userData;

  console.log(
    'BODY',
    firstName,
    surname,
    address,
    city,
    county,
    eircode,
    email,
    mobileNumber,
    totalAmount
  );

  //Grabo la precompra

  const sqlInsertPurchase = `INSERT INTO purchases( address, city, id_country, name,  postcode, phone, id_user )
                             VALUES (?, ?, ?, ?, ?, ?, ?)
                            `;

  const purchasesValues = [
    address,
    city,
    county,
    firstName + ' ' + surname,
    eircode,
    mobileNumber,
    userId,
  ];

  connection.query(
    sqlInsertPurchase,
    purchasesValues,
    (error, resultInsertPurchase) => {
      if (error) {
        //Devolver mensaje al cliente
        console.log('Error al guardar la compra', error.message);
      } else {
        //Guardar el detalle del carrito
        const idNewPurchase = resultInsertPurchase.insertId;

        let insertCounter = 0;

        for (let item of cart) {
          const sqlInsertPurchaseDetail = `INSERT INTO purchases_detail( id_purchase, id_obra_arte, price_picture )
                                           VALUES ( ?, ?, ? )`;

          const purchaseDetailValues = [
            idNewPurchase,
            item.id_obra_arte,
            item.price,
          ];

          connection.query(
            sqlInsertPurchaseDetail,
            purchaseDetailValues,
            async (error, result) => {
              if (error) {
                console.log('Error al guardar el item del carrito');
              } else {
                insertCounter++;

                if (insertCounter === cart.length) {
                  request.requestBody({
                    intent: 'CAPTURE',
                    purchase_units: [
                      {
                        amount: {
                          currency_code: 'EUR',
                          value: totalAmount.toString(),
                        },
                      },
                    ],
                    application_context: {
                      shipping_preference: 'NO_SHIPPING',
                    },
                  });

                  const response = await client.execute(request);

                  console.log(response.result);

                  const paypalOrderId = response.result.id;

                  const sqlUpdatePurchasePaypalId = `UPDATE purchases
                                                     SET paypal_order_id = ?
                                                     WHERE id = ?
                                                    `;

                  const valuesUpdatePurchasePaypalId = [
                    paypalOrderId,
                    idNewPurchase,
                  ];

                  connection.query(
                    sqlUpdatePurchasePaypalId,
                    valuesUpdatePurchasePaypalId,
                    (error, result) => {
                      if (error) {
                        console.log('Error al guardar el order_id de paypal');
                      } else {
                        res.json(response.result);
                      }
                    }
                  );
                }
              }
            }
          );
        }
      }
    }
  );
});

router.post('/capture-order', async (req, res) => {
  try {
    const request = new checkoutServerSdk.orders.OrdersCaptureRequest(
      req.body.orderID
    );

    request.requestBody({});

    const response = await client.execute(request);

    const paypalOrderId = req.body.orderID;

    console.log('REGISTRAR COMO PAGADO ...', paypalOrderId);

    const sqlUpdatePagoPaypal = `UPDATE purchases
                                  SET estado_pago = 'pagado'
                                  WHERE paypal_order_id = ?
                                 `;

    const valuesUpdatePagoPaypal = [paypalOrderId];

    connection.query(
      sqlUpdatePagoPaypal,
      valuesUpdatePagoPaypal,
      (error, result) => {
        if (error) {
          console.log('Error al registrar el pago en la bd');
        } else {
          //Poner las obras como SOLD

          const sqlUpdateSold = `UPDATE cuadros_arte 
                                 SET sold = 1 
                                 WHERE id IN ( 
                                               SELECT id_obra_arte 
                                               FROM purchases_detail
                                               WHERE id_purchase = (
                                                                        SELECT id 
                                                                        FROM purchases 
                                                                        WHERE paypal_order_id = ?
                                                                    )
                                            )`;

          const valuesSqlUpdateSold = [paypalOrderId];

          connection.query(
            sqlUpdateSold,
            valuesSqlUpdateSold,
            (error, result) => {
              if (error) {
                console.log('Error al cambiar a SOLD');
              } else {
                //Vaciar el carrito

                const sqlDeleteCart = `DELETE 
                                       FROM carrito
                                       WHERE id_usuario = (SELECT id_user
                                                           FROM purchases 
                                                           WHERE paypal_order_id = ?)`;

                const valuesDeleteCart = [paypalOrderId];

                connection.query(
                  sqlDeleteCart,
                  valuesDeleteCart,
                  (error, result) => {
                    if (error) {
                      console.log('Error al vaciar el carrito');
                    } else {
                      console.log(response);

                      //Obtengo datos del comprador
                      const sqlUser = `SELECT purchases.*, users.email
                                       FROM purchases
                                       INNER JOIN users
                                         ON users.id = purchases.id_user
                                       WHERE paypal_order_id = ?`;

                      const valuesSqlUser = [paypalOrderId];

                      connection.query(
                        sqlUser,
                        valuesSqlUser,
                        (error, resultUser) => {
                          //Obtengo datos del detalle de la compra

                          const sqlCart = `SELECT ca.id, name, price_picture price
                                            FROM purchases_detail pd 
                                            INNER JOIN cuadros_arte ca
                                              ON ca.id = pd.id_obra_arte
                                            WHERE pd.id_purchase = (
                                                                    SELECT id
                                                                    FROM purchases
                                                                    WHERE paypal_order_id = ? 
                                                                    )
                                            `;

                          const valuesSqlCart = [paypalOrderId];

                          connection.query(
                            sqlCart,
                            valuesSqlCart,
                            (error, resultCart) => {
                              sendEmail(
                                resultCart,
                                resultUser[0],
                                emailTypes.PURCHASE_SUCCESS,
                                'PURCHASE SUCCESS'
                              );

                              res.status(201).json(response);
                            }
                          );
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(403).json(error.message);
  }
});

router.post('/notification', async (req, res) => {
  console.log(req.body);

  req.status(200).json({});
});

module.exports = router;
