import type { Metadata } from "next";
import UsContent from "./UsContent";

export const metadata: Metadata = {
  metadataBase: new URL("https://flxos-labs.github.io"),
  title: "For You, Rekha ❤️",
  description: "A cinematic space dedicated to the love story of Akash and Rekha.",
  openGraph: {
    title: "To the One Who Stole My Heart - Rekha",
    description: "Yours forever, Akash. A walk down memory lane and reasons I love you.",
    type: "website",
    url: "https://flxos-labs.github.io/us/",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "To Rekha, with love",
      },
    ],
  },
};

export default function UsPage() {
  return <UsContent />;
}
