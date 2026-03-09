import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PBS Database API",
  description: "Interactive API Documentation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <a href="/" className="nav-brand">PBS Database API</a>
            <a href="/employees">Employees</a>
            <a href="/projectinfo">Project Info</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
