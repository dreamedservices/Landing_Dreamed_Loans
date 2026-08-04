"use client";

import { Component, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics/track";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

/**
 * Si el Canvas falla en tiempo de ejecución (contexto WebGL perdido, error de
 * R3F, etc.), no renderiza nada: el póster estático que ya vive en el HTML
 * sigue visible detrás.
 */
export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[HeroLogoCanvas] error de render, usando póster:", error);
    trackEvent("three_fallback_used");
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
