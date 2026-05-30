"use client";

import { useState } from "react";

interface Props {
  command: string;
  label?: string;
}

export default function CopyCommand({ command, label = "Copy command" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // no-op: clipboard could be unavailable in some environments
    }
  };

  return (
    <div className="copy-command flex items-center gap-3 mt-3">
      <pre className="rounded-md bg-[rgba(var(--surface-rgb),0.9)] px-3 py-2 text-xs overflow-auto">{command}</pre>
      <button
        type="button"
        className="btn-ghost"
        onClick={handleCopy}
        aria-label={label}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
