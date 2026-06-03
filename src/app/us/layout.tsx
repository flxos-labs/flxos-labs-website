import { Playfair_Display, Cormorant_Garamond } from "next/font/google";

const fontSerifDisplay = Playfair_Display({
  variable: "--font-serif-display",
  subsets: ["latin"],
  display: "swap",
});

const fontSerifBody = Cormorant_Garamond({
  variable: "--font-serif-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function UsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${fontSerifDisplay.variable} ${fontSerifBody.variable}`}>
      {children}
    </div>
  );
}
