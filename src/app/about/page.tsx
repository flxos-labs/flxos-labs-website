import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About - FlxOS Labs",
  description:
    "Learn about FlxOS Labs — our mission, the founder, project history, technology philosophy, and roadmap for the future of embedded computing.",
  openGraph: {
    title: "About - FlxOS Labs",
    description:
      "Learn about FlxOS Labs - building the future of embedded desktop experiences. Open source under AGPL-3.0.",
    type: "website",
    url: "https://flxos-labs.vercel.app/about/",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
