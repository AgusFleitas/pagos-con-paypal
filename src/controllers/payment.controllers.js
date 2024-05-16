import {
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET,
  PAYPAL_API,
  HOST,
} from "../config.js";
import axios from "axios";

export const createPayment = async (req, res) => {
  const { items, shipping } = req.body;

  const shippingValue = shipping.toFixed(2);

  const itemList = items.map((item) => {
    return {
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      unit_amount: {
        currency_code: item.currency,
        value: item.price,
      },
    };
  });


  const itemsTotal = items.reduce((acc, item) => {
    const itemPrice = parseFloat(item.price);
    const quantity = parseInt(item.quantity);

    return acc + itemPrice * quantity;
  }, 0);

  const totalValue = itemsTotal + shipping;

  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        items: itemList,
        amount: {
          currency_code: "USD",
          value: totalValue.toFixed(2), // Subtotal (productos + envío )
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: itemsTotal.toFixed(2), // Subtotal de los productos (por cada producto => [precio del producto * cantidad])
            },
            shipping: {
              currency_code: "USD",
              value: shippingValue,
            },
          },
        },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "AgusFleitas Dev",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${HOST}/payment-success`,
          cancel_url: `${HOST}/payment-cancel`,
        },
      },
    },
  };

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const {
    data: { access_token },
  } = await axios.post(`${PAYPAL_API}/v1/oauth2/token`, params, {
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET,
    },
  });

  const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return res.json(response.data);
};

// Función para autorizar el pago.
export const capturePayment = async (req, res) => {
  // Extraemos el token mediante query que se nos genera luego de crear el pago.
  const { token } = req.query

  // Realizamos la solicitud de tipo POST a la API de PayPal para autorizar el pago enviando las credenciales como autorización. El segundo parámetro está vacío puesto que no vamos a enviarle nada como cuerpo de la solicitud, el 'auth' forma parte de la cabecera.
  const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`, {}, {
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_SECRET
    }
  })

  return res.json(response.data)
}

export const cancelPayment = (req, res) => res.redirect('/');
