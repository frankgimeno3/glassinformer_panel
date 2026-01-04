import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Topnav from "./logged_components/Topnav";
import Leftnav from "./logged_components/Leftnav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glassinformer Pannel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <div className="flex flex-col ">
          <Topnav />
          <div className="flex flex-row bg-gray-100 min-h-screen text-gray-600 w-full">
            <Leftnav />
              {children}
           </div>
        </div>
  );
}
