import "./globals.css";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Where creativity regains value",
  description: "VN.AI – An ARCOS Labs Company",
  icons: {
    icon: [
      { url: "/VN-Logo-Dark.svg", media: "(prefers-color-scheme: light)" },
      { url: "/VN-Logo-White.svg", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: [
      { url: "/VN-Logo-Dark.svg", media: "(prefers-color-scheme: light)" },
      { url: "/VN-Logo-White.svg", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/VN-Logo-Dark.svg", // Default to dark for Apple devices
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={figtree.className}>{children}</body>
    </html>
  );
}
