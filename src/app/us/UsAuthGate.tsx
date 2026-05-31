"use client";

import React, { useState, useEffect, useRef } from "react";
import StarfieldCanvas from "./StarfieldCanvas";

const AUTH_STORAGE_KEY = "us_page_auth_v1";

interface UsAuthGateProps {
  children: React.ReactNode;
}

function spawnParticles(x: number, y: number, count = 12) {
  const emojis = ["💖", "✨", "🌹", "💫", "❤️", "🌸"];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
    el.className = "us-heart-particle";
    el.style.left = `${x + (Math.random() - 0.5) * 80}px`;
    el.style.top = `${y + (Math.random() - 0.5) * 80}px`;
    const rot = (Math.random() - 0.5) * 200;
    el.style.setProperty("--rot", `${rot}deg`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }
}

export default function UsAuthGate({ children }: UsAuthGateProps) {
  const [authState, setAuthState] = useState<"loading" | "locked" | "unlocking" | "unlocked">("loading");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Check localStorage and verify token on mount
  useEffect(() => {
    const verifyStoredToken = async () => {
      const storedToken = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedToken) {
        setAuthState("locked");
        setTimeout(() => inputRef.current?.focus(), 400);
        return;
      }

      try {
        const res = await fetch(`/api/us/auth?token=${encodeURIComponent(storedToken)}`);
        const data = await res.json();
        if (data.success) {
          setAuthState("unlocked");
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
          setAuthState("locked");
          setTimeout(() => inputRef.current?.focus(), 400);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState("locked");
        setTimeout(() => inputRef.current?.focus(), 400);
      }
    };

    verifyStoredToken();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/us/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        // Store auth token in localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, data.token);

        // Spawn celebration particles from center of card
        const card = cardRef.current;
        if (card) {
          const rect = card.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          spawnParticles(cx, cy, 20);
          // Additional wave after 200ms
          setTimeout(() => spawnParticles(cx, cy, 16), 200);
          setTimeout(() => spawnParticles(cx, cy, 12), 400);
        }

        // Transition to unlocked state
        setAuthState("unlocking");
        setTimeout(() => {
          setAuthState("unlocked");
        }, 900);
      } else {
        // Shake + error
        setError(data.error ?? "Incorrect passcode. Try again! 💔");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 600);
        setPasscode("");
        inputRef.current?.focus();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state — prevent flash
  if (authState === "loading") {
    return (
      <div className="us-auth-loading">
        <StarfieldCanvas />
        <div className="us-auth-loading-spinner" />
      </div>
    );
  }

  // Unlocked — render children with fade-in
  if (authState === "unlocked") {
    return <>{children}</>;
  }

  // Lock screen (locked + unlocking)
  return (
    <div className={`us-auth-screen ${authState === "unlocking" ? "us-auth-screen--unlocking" : ""}`}>
      <StarfieldCanvas />

      <div className="us-auth-inner">
        {/* Ambient glow orbs */}
        <div className="us-auth-orb us-auth-orb--rose" />
        <div className="us-auth-orb us-auth-orb--gold" />

        {/* Lock Card */}
        <div
          ref={cardRef}
          className={`us-auth-card ${isShaking ? "us-auth-card--shake" : ""} ${authState === "unlocking" ? "us-auth-card--fade-out" : ""}`}
        >
          {/* Top Gradient Line */}
          <div className="us-auth-card-line" />

          {/* Lock icon + title */}
          <div className="us-auth-header">
            <div className="us-auth-lock-ring">
              <span className="us-auth-lock-icon">
                {authState === "unlocking" ? "💖" : "🔒"}
              </span>
            </div>
            <p className="us-auth-eyebrow">Private Access</p>
            <h1 className="us-auth-title">
              {authState === "unlocking"
                ? "Welcome, my love ❤️"
                : "For You, Rekha"}
            </h1>
            <p className="us-auth-subtitle">
              {authState === "unlocking"
                ? "Opening our universe just for you…"
                : "This page is a small corner of the universe made just for you. Enter the secret to unlock it."}
            </p>
          </div>

          {/* Form */}
          {authState !== "unlocking" && (
            <form onSubmit={handleSubmit} className="us-auth-form">
              <div className={`us-auth-input-wrapper ${error ? "us-auth-input-wrapper--error" : ""}`}>
                <input
                  ref={inputRef}
                  id="us-passcode-input"
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your secret…"
                  className="us-auth-input"
                  autoComplete="off"
                  disabled={isSubmitting}
                  maxLength={50}
                />
                <div className="us-auth-input-glow" />
              </div>

              {/* Error message */}
              <div className={`us-auth-error ${error ? "us-auth-error--visible" : ""}`}>
                {error && <span>{error}</span>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !passcode.trim()}
                className="us-auth-btn"
                id="us-auth-submit-btn"
              >
                {isSubmitting ? (
                  <span className="us-auth-btn-spinner" />
                ) : (
                  <>
                    <span>Unlock Our Universe</span>
                    <span className="us-auth-btn-arrow">→</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Decorative bottom hint */}
          {authState !== "unlocking" && (
            <p className="us-auth-hint">
              💌 Only one person in the world knows this
            </p>
          )}
        </div>

        {/* Floating star decorations */}
        <div className="us-auth-star us-auth-star--1">✦</div>
        <div className="us-auth-star us-auth-star--2">✦</div>
        <div className="us-auth-star us-auth-star--3">✦</div>
      </div>
    </div>
  );
}
