import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = {
  as?: ElementType<{ className?: string; children?: ReactNode }>;
  className?: string;
  children: ReactNode;
};

/** Ancho de lectura máximo (~1440px, THEME.md §6) con padding horizontal responsive. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[1440px] px-6 sm:px-8 lg:px-12", className)}>
      {children}
    </Tag>
  );
}
