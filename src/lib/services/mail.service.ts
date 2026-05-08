import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export const mailService = {
  async sendWelcomeEmail(email: string, name?: string) {
    return await resend.emails.send({
      from: 'LOOM <onboarding@loomqr.com>',
      to: email,
      subject: 'Welcome to LOOM Professional',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #000; font-weight: 800; letter-spacing: -1px;">WELCOME, ${name || 'CREATOR'}.</h1>
          <p style="color: #666; line-height: 1.6;">You've just unlocked a new standard in QR management. Your dynamic codes are ready to be deployed.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">ACCESS YOUR DASHBOARD</a>
          </div>
          <p style="font-size: 12px; color: #999;">If you didn't create this account, please ignore this email.</p>
        </div>
      `,
    });
  },

  async sendSubscriptionSuccess(email: string) {
    return await resend.emails.send({
      from: 'LOOM <billing@loomqr.com>',
      to: email,
      subject: 'PRO Activated: Advanced Features Unlocked',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #000; font-weight: 800; letter-spacing: -1px;">PRO ACTIVATED.</h1>
          <p style="color: #666; line-height: 1.6;">Your upgrade to PRO is complete. You now have unlimited access to:</p>
          <ul style="color: #666; line-height: 2;">
            <li>Dynamic QR Redirects</li>
            <li>Real-time Scan Analytics</li>
            <li>Threat Detection & Security Shield</li>
            <li>Premium Branding Options</li>
          </ul>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">EXPLORE PRO FEATURES</a>
          </div>
        </div>
      `,
    });
  },

  async sendPaymentFailed(email: string) {
    return await resend.emails.send({
      from: 'LOOM <billing@loomqr.com>',
      to: email,
      subject: 'Action Required: Payment Failed',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #ff3b30; font-weight: 800; letter-spacing: -1px;">PAYMENT FAILED.</h1>
          <p style="color: #666; line-height: 1.6;">We were unable to process your subscription payment. To avoid service interruption, please update your billing information.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?tab=ACCOUNT" style="background: #ff3b30; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">UPDATE PAYMENT METHOD</a>
          </div>
        </div>
      `,
    });
  },

  async sendReengagementEmail(email: string) {
    return await resend.emails.send({
      from: 'LOOM <hello@loomqr.com>',
      to: email,
      subject: 'We miss your activity',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #000; font-weight: 800; letter-spacing: -1px;">STILL DEPLOYING?</h1>
          <p style="color: #666; line-height: 1.6;">We noticed you haven't generated any codes recently. New features have been added to the dashboard to help you reach your audience faster.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">GENERATE NEW QR CODE</a>
          </div>
        </div>
      `,
    });
  },

  async sendCancellationConfirmation(email: string) {
    return await resend.emails.send({
      from: 'LOOM <billing@loomqr.com>',
      to: email,
      subject: 'Subscription Canceled',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #666; font-weight: 800; letter-spacing: -1px;">SUBSCRIPTION CANCELED.</h1>
          <p style="color: #666; line-height: 1.6;">Your subscription has been canceled. You will still have access to PRO features until the end of your current billing period.</p>
          <p style="color: #666; line-height: 1.6;">We'd love to have you back. Your data and codes will remain safe under our security shield for the next 12 months.</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/?tab=ACCOUNT" style="background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 14px;">RE-ACTIVATE PRO</a>
          </div>
        </div>
      `,
    });
  }
};
