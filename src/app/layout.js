import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Smart Automation Tools",
  description: "A collection of tools to automate your tasks.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="w-4xl mx-auto px-4 mt-2">
          {children}
          
          <hr className="my-4" />
          
          <div className="mt-4">
            <p className="text-red-700"><span className="font-bold">* Note:</span> Use these tools at your own risk. We will not be responsible for any data loss or damage due to these tools. Thank you</p>
          </div>
        </div>
      </body>
    </html>
  );
}
