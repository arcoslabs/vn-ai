import "./globals.css";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata = {
  title: "Where creativity regains value",
  description: "VN.AI – An ARCOS Labs Company",
  icons: {
    icon: "/VN-Logo-White.svg",
    shortcut: "/VN-Logo-White.svg",
    apple: "/VN-Logo-White.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={figtree.className}>{children}</body>
    </html>
  );
}
