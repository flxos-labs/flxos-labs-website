import type { Metadata } from "next";
import DevicesContent from "./DevicesContent";

export const metadata: Metadata = {
  title: "Devices - FlxOS Labs",
  description:
    "Explore FlxOS hardware compatibility status, supported display panels, touch controllers, storage buses, and board-specific configuration profiles.",
  openGraph: {
    title: "Devices - FlxOS Labs",
    description:
      "Explore FlxOS hardware compatibility status across 49 supported developer boards and modules.",
    type: "website",
    url: "https://flxos-labs.vercel.app/devices/",
  },
};

export default function DevicesPage() {
  return <DevicesContent />;
}
