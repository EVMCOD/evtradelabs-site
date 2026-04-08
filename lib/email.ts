import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const FROM_EMAIL = "EV Trading Labs <contacto@evtradelabs.com>";

export interface LicenseEmailData {
  to: string;
  customerName: string;
  productName: string;
  licenseKey: string;
  orderId: string;
}

export async function sendLicenseEmail({ to, customerName, productName, licenseKey, orderId }: LicenseEmailData) {
  const isDemoMode = !process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder";

  if (isDemoMode) {
    console.log("=== EMAIL (demo mode) ===");
    console.log("To:", to);
    console.log("Subject: Tu licencia de", productName);
    console.log("License Key:", licenseKey);
    console.log("Order ID:", orderId);
    console.log("============================");
    return { success: true, demo: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Tu licencia de ${productName} — ${orderId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">EV Trading Labs</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">¡Gracias por tu compra, ${customerName}!</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Has adquirido <strong>${productName}</strong>. Aquí tienes tu licencia:
            </p>
            
            <div style="background: #1f2937; color: #10b981; padding: 20px; border-radius: 12px; text-align: center; font-family: monospace; font-size: 18px; margin: 20px 0;">
              ${licenseKey}
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              Order ID: ${orderId}<br/>
              Producto: ${productName}
            </p>
            
            <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-radius: 8px;">
              <h3 style="color: #1e40af; font-size: 16px; margin: 0 0 10px;">¿Cómo instalar?</h3>
              <ol style="color: #4b5563; line-height: 1.8; padding-left: 20px;">
                <li>Abre MetaTrader 5</li>
                <li>Ve a File → Open Data Folder</li>
                <li>Copia el archivo .ex5 en MQL5/Experts</li>
                <li>Reinicia MT5 y activa con tu licencia</li>
              </ol>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>© ${new Date().getFullYear()} EV Trading Labs · contact@evtradelabs.com</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: err };
  }
}
