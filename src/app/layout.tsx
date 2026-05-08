import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from 'sonner';

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
};

export const metadata: Metadata = {
  title: {
    default: "LOOM — Free Dynamic QR Code Generator & Manager",
    template: "%s | LOOM",
  },
  description: "Create, customize, and track dynamic QR codes with LOOM. Update destinations in real-time, analyze scan analytics, and deploy across print and digital — no reprinting required.",
  keywords: ["QR code generator", "dynamic QR codes", "free QR code maker", "QR code analytics", "custom QR codes", "QR code manager", "QR code creator", "trackable QR codes"],
  metadataBase: new URL("https://www.loomqr.com"),
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "LOOM", url: "https://www.loomqr.com" }],
  creator: "LOOM",
  publisher: "LOOM",
  category: "technology",
  openGraph: {
    type: "website",
    url: "https://www.loomqr.com",
    title: "LOOM — Free Dynamic QR Code Generator & Manager",
    description: "Create, customize, and track dynamic QR codes with LOOM. Update destinations in real-time, analyze scan analytics, and deploy across print and digital.",
    siteName: "LOOM",
    locale: "en_US",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "LOOM — Free Dynamic QR Code Generator. Create. Customize. Track.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@loomqr",
    creator: "@loomqr",
    title: "LOOM — Free Dynamic QR Code Generator & Manager",
    description: "Create, customize, and track dynamic QR codes with LOOM. Update destinations in real-time without reprinting.",
    images: [{ url: "/images/og-image.png", alt: "LOOM QR code generator — Create. Customize. Track." }],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    // google: "YOUR_GOOGLE_VERIFICATION_CODE", // Add after GSC verification
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" theme="dark" richColors closeButton />
      </body>
    </html>
  );
}
