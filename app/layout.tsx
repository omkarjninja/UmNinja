import "./globals.css";

export const metadata = {
  title: "AI Communication Trainer",
  description: "Practice communication with AI-generated topics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
