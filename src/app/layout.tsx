import type { Metadata } from "next";
import { Open_Sans } from "next/font/google"; // 👈 change here
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"], // same weights
});

export const metadata: Metadata = {
  title: "Falcon Car Rental | Exotic & Luxury Car Rental Los Angeles",
  description:
    "Premium luxury and exotic car rental in Los Angeles and Miami. Rent Lamborghini, Ferrari, Rolls-Royce, Bentley, Porsche and more. Free delivery available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}