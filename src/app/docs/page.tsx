import type { Metadata } from "next";
import DocsContent from "./DocsContent";

export const metadata: Metadata = {
  title: "Documentation - FlxOS",
  description:
    "Complete documentation for FlxOS - installation, configuration, API reference, and troubleshooting guides.",
  openGraph: {
    title: "Documentation - FlxOS",
    description:
      "Complete documentation for FlxOS - installation, configuration, API reference, and troubleshooting guides.",
    type: "website",
    url: "https://flxos-labs.vercel.app/docs/",
  },
};

export default function DocsPage() {
  return <DocsContent />;
}
