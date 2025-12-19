import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UFO Burgers | A Cosmic Burger Experience",
  description: "A cosmic burger experience landing in Wallsend, UK. 8 planet-themed burgers from another world.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}


