import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const ROUTE_NAMES = {
  "5":  { name: "Kids Fun Ride",  emoji: "🚲", color: "#EF4444", scenery: "Coffee Plantation & Savannah" },
  "16": { name: "The Explorer",   emoji: "🌍", color: "#0075E1", scenery: "Coffee, Savannah & Greenlands" },
  "25": { name: "The Adventure",  emoji: "🌿", color: "#2E7D32", scenery: "Coffee, Savannah, Greenlands & City Views" },
};

function generateQRDataUrl(text) {
  // Encode data as a simple QR-like URL using a public API
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}&bgcolor=ffffff&color=003A8C&margin=10`;
}

function buildEmailHtml(reg) {
  const route = ROUTE_NAMES[reg.route_km] || { name: reg.route_km + " km", emoji: "🚴", color: "#0075E1", scenery: "" };
  const qrData = `TCR2026|${reg.id}|${reg.name}|${reg.route_km}km|${reg.bib_number || "TBC"}`;
  const qrUrl = generateQRDataUrl(qrData);
  const bib = reg.bib_number || "To be assigned at check-in";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Rider Pass — Tatu City Riders 2026</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.10);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#003A8C 0%,#0075E1 60%,#1A9A5C 100%);padding:36px 32px;text-align:center;">
            <p style="margin:0 0 8px;color:rgba(255,255,255,0.75);font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Global Shapers Mombasa Hub</p>
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;letter-spacing:-0.5px;">TATU CITY RIDERS</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:16px;font-weight:700;">2026 · Pedal for the Planet</p>
            <p style="margin:16px 0 0;color:rgba(255,255,255,0.70);font-size:13px;">Saturday, 26 September 2026 · Tatu City, Kiambu</p>
          </td>
        </tr>

        <!-- Confirmation banner -->
        <tr>
          <td style="background:#1A9A5C;padding:12px 32px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:13px;font-weight:800;letter-spacing:1px;">✅ REGISTRATION CONFIRMED &amp; PAYMENT RECEIVED</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;">
            <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">Dear</p>
            <h2 style="margin:0 0 24px;color:#111827;font-size:22px;font-weight:900;">${reg.name} 👋</h2>
            <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
              You're all set for <strong>Tatu City Riders 2026</strong>! Your registration is confirmed and payment has been received. Below is your official <strong>Rider Pass</strong> — please present it (digital or printed) at check-in on race day.
            </p>

            <!-- Rider Pass Card -->
            <table width="100%" style="border-radius:16px;border:2px solid ${route.color};overflow:hidden;margin-bottom:24px;">
              <tr>
                <td style="background:${route.color};padding:14px 20px;">
                  <p style="margin:0;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:3px;text-transform:uppercase;">Official Rider Pass</p>
                </td>
              </tr>
              <tr>
                <td style="background:#fafafa;padding:20px;">
                  <table width="100%">
                    <tr>
                      <td style="vertical-align:top;padding-right:16px;">
                        <table>
                          <tr>
                            <td style="padding:4px 0;">
                              <p style="margin:0;color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Rider Name</p>
                              <p style="margin:2px 0 0;color:#111827;font-size:16px;font-weight:900;">${reg.name}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0 4px;">
                              <p style="margin:0;color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Route</p>
                              <p style="margin:2px 0 0;color:${route.color};font-size:18px;font-weight:900;">${route.emoji} ${reg.route_km} km — ${route.name}</p>
                              <p style="margin:2px 0 0;color:#6b7280;font-size:11px;">${route.scenery}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0 4px;">
                              <p style="margin:0;color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Package</p>
                              <p style="margin:2px 0 0;color:#111827;font-size:14px;font-weight:700;">${reg.tier}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0 4px;">
                              <p style="margin:0;color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Bib Number</p>
                              <p style="margin:2px 0 0;color:#111827;font-size:22px;font-weight:900;">${bib}</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0 4px;">
                              <p style="margin:0;color:#9ca3af;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Phone</p>
                              <p style="margin:2px 0 0;color:#111827;font-size:13px;font-weight:600;">${reg.phone}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                      <td style="vertical-align:top;text-align:center;width:110px;">
                        <img src="${qrUrl}" alt="Rider QR Code" width="110" height="110" style="border-radius:10px;display:block;" />
                        <p style="margin:6px 0 0;color:#9ca3af;font-size:9px;font-weight:600;text-align:center;">Scan at check-in</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Race day info -->
            <table width="100%" style="background:#eff6ff;border-radius:12px;padding:16px;margin-bottom:24px;">
              <tr>
                <td>
                  <p style="margin:0 0 10px;color:#1d4ed8;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;">📋 Race Day Information</p>
                  <p style="margin:0 0 6px;color:#374151;font-size:13px;">🚪 <strong>Gates open:</strong> 5:30 AM — please arrive early for bike checks</p>
                  <p style="margin:0 0 6px;color:#374151;font-size:13px;">🚲 <strong>5 km start:</strong> 6:30 AM &nbsp;|&nbsp; <strong>16 km start:</strong> 7:00 AM &nbsp;|&nbsp; <strong>25 km start:</strong> 7:30 AM</p>
                  <p style="margin:0 0 6px;color:#374151;font-size:13px;">📍 <strong>Venue:</strong> Tatu City Main Gate, Kiambu County</p>
                  <p style="margin:0;color:#374151;font-size:13px;">⛑️ <strong>Mandatory:</strong> Properly fitted cycling helmet</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 8px;color:#374151;font-size:14px;line-height:1.6;">
              See you on the start line — let's pedal for the planet! 🌍
            </p>
            <p style="margin:0;color:#6b7280;font-size:13px;">
              Questions? Reply to this email or contact us at <a href="mailto:info@globalshapermombasa.org" style="color:#0075E1;">info@globalshapermombasa.org</a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 32px;text-align:center;">
            <p style="margin:0 0 4px;color:#9ca3af;font-size:11px;font-weight:700;">GLOBAL SHAPERS MOMBASA HUB</p>
            <p style="margin:0;color:#d1d5db;font-size:10px;">Tatu City Riders 2026 · Pedal for the Planet · globalshapers.org</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    // Support both direct call (with registration_id) and entity automation payload
    let registration = null;
    if (payload?.data) {
      // Called from entity automation
      registration = payload.data;
    } else if (payload?.registration_id) {
      registration = await base44.asServiceRole.entities.Registration.get(payload.registration_id);
    }

    if (!registration) {
      return Response.json({ error: "No registration data provided" }, { status: 400 });
    }

    if (!registration.email) {
      return Response.json({ error: "Registration has no email" }, { status: 400 });
    }

    const html = buildEmailHtml(registration);

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: registration.email,
      from_name: "Tatu City Riders 2026",
      subject: `🚴 Your Rider Pass — Tatu City Riders 2026 · ${registration.route_km} km`,
      body: html,
    });

    console.log(`Rider pass sent to ${registration.email} (${registration.name})`);
    return Response.json({ success: true, sent_to: registration.email });
  } catch (error) {
    console.error("sendRiderPass error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});