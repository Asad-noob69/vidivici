const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getPayPalAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_CLIENT_SECRET!
  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64")

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal auth failed: ${err}`)
  }

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return data.access_token
}

export async function createPayPalOrder(
  amount: number,
  currency: string,
  referenceId: string,
  intent: "AUTHORIZE" | "CAPTURE" = "AUTHORIZE"
) {
  const token = await getPayPalAccessToken()

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent,
      purchase_units: [
        {
          reference_id: referenceId,
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "Vidi Vici Hospitality Group",
      },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal create order failed: ${err}`)
  }

  return res.json()
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken()

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal capture order failed: ${err}`)
  }

  return res.json()
}

export async function authorizePayPalOrder(orderId: string) {
  const token = await getPayPalAccessToken()

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/authorize`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal authorize failed: ${err}`)
  }

  const data = await res.json()
  const authorizationId =
    data.purchase_units?.[0]?.payments?.authorizations?.[0]?.id

  return { order: data, authorizationId }
}

export async function capturePayPalAuthorization(
  authorizationId: string,
  amount?: { currency_code: string; value: string },
  finalCapture: boolean = true
) {
  const token = await getPayPalAccessToken()

  const body: Record<string, unknown> = { final_capture: finalCapture }
  if (amount) body.amount = amount

  const res = await fetch(
    `${PAYPAL_BASE}/v2/payments/authorizations/${authorizationId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal capture failed: ${err}`)
  }

  return res.json()
}

export async function voidPayPalAuthorization(authorizationId: string) {
  const token = await getPayPalAccessToken()

  const res = await fetch(
    `${PAYPAL_BASE}/v2/payments/authorizations/${authorizationId}/void`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal void failed: ${err}`)
  }
}
