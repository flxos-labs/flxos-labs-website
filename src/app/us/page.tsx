import type { Metadata } from "next";
import UsContent from "./UsContent";
import UsAuthGate from "./UsAuthGate";

export const viewport = {
  themeColor: "#0a0a0c",
};

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
  twitter: {
    card: "summary_large_image",
    title: "For You, Rekha ❤️",
    description: "A cinematic space dedicated to the love story of Akash and Rekha.",
  },
};

export default function UsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "For You, Rekha",
    "author": {
      "@type": "Person",
      "name": "Akash"
    },
    "description": "A cinematic romantic dedication page made for Rekha.",
    "genre": "Interactive Romance Dedication",
    "url": "https://flxos-labs.github.io/us/"
  };

  return (
    <UsAuthGate>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <UsContent />
    </UsAuthGate>
  );
}
