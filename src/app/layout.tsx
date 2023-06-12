import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "./sidebar";

export const metadata = {
  title: "Terratrack: Track your outdoors activity between devices",
  description:
    "Track your outdoors activity between devices. A web and mobile app for your outdoor activities.",
  icons: {
    icon: "/icon.png",
  },
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          showOptionalFields: true,
        },
      }}
    >
      <html lang="en">
        <head>
          <link
            href="https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css"
            rel="stylesheet"
          />
          <link rel="icon" href="/icon.png" sizes="any" />
        </head>
        <body className={inter.className}>
          <div className="flex bg-[#f2f7fc]">
            <Sidebar />
            <div className="w-full">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
