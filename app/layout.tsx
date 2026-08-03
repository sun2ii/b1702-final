import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Binary1702",
  description:
    "Binary1702 is a studio for business owners who know something is wrong but not yet what it is. We start by finding out.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("theme-dark")}catch(e){}})()`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
