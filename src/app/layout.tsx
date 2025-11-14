import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "My App",
  description: "Next.js + Emotion + React Query",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko">
      <body style={{ backgroundColor: "#FAFAFA", margin: 0, padding: 0 }}>
        <div
          style={{
            maxWidth: 475,
            width: "100%",
            margin: "0 auto",
            minHeight: "100dvh",
            backgroundColor: "#FFFFFF",
            paddingBottom: "calc(64px + env(safe-area-inset-bottom))",
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;