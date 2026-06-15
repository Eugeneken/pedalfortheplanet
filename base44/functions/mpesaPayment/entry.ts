import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE_URL = "https://pay.pesapal.com/v3";

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { phone, amount, description, registrationId, email, name, callbackUrl } = await req.json();

    // 1. Get Pesapal access token
    const authRes = await fetch(`${BASE_URL}/api/Auth/RequestToken`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        consumer_key: Deno.env.get("PESAPAL_CONSUMER_KEY"),
        consumer_secret: Deno.env.get("PESAPAL_CONSUMER_SECRET"),
      }),
    });
    const authData = await authRes.json();
    if (authData.status !== "200" || !authData.token) {
      return Response.json({ success: false, message: "Pesapal auth failed: " + (authData.message || JSON.stringify(authData)) }, { status: 400 });
    }
    const token = authData.token;

    // 2. Register IPN URL (idempotent — Pesapal deduplicates by URL)
    const ipnUrl = "https://tatucityriders.base44.app/api/pesapalIpn";
    const ipnRes = await fetch(`${BASE_URL}/api/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ url: ipnUrl, ipn_notification_type: "GET" }),
    });
    const ipnData = await ipnRes.json();
    const notificationId = ipnData.ipn_id;

    if (!notificationId) {
      return Response.json({ success: false, message: "IPN registration failed: " + JSON.stringify(ipnData) }, { status: 400 });
    }

    // 3. Normalize phone
    let normalizedPhone = phone.replace(/\s+/g, "").replace(/^\+/, "");
    if (normalizedPhone.startsWith("0")) normalizedPhone = "254" + normalizedPhone.slice(1);

    // 4. Split name into first/last
    const nameParts = (name || "").trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    // 5. Submit order request
    const merchantRef = registrationId || `TCR-${Date.now()}`;
    const orderRes = await fetch(`${BASE_URL}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: merchantRef,
        currency: "KES",
        amount: amount,
        description: (description || "Tatu City Riders 2026").substring(0, 100),
        callback_url: callbackUrl || "https://tatucityriders.base44.app/?payment=success",
        notification_id: notificationId,
        billing_address: {
          email_address: email || "",
          phone_number: normalizedPhone,
          country_code: "KE",
          first_name: firstName,
          last_name: lastName,
        },
      }),
    });
    const orderData = await orderRes.json();

    if (orderData.status !== "200" || !orderData.redirect_url) {
      return Response.json({ success: false, message: orderData.message || "Order submission failed: " + JSON.stringify(orderData) }, { status: 400 });
    }

    // 6. Store order_tracking_id on registration
    if (registrationId) {
      await base44.asServiceRole.entities.Registration.update(registrationId, {
        checkout_request_id: orderData.order_tracking_id,
      });
    }

    return Response.json({
      success: true,
      redirect_url: orderData.redirect_url,
      order_tracking_id: orderData.order_tracking_id,
      merchant_reference: orderData.merchant_reference,
    });

  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
});