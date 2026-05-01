import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "nafha.tn | Gaming E-commerce",
  description: "The ultimate gaming e-commerce platform in Tunisia.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #2a2a2a',
          },
        }} />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
