import type { ReactNode } from "react";
import { Button, type ButtonProps, type ButtonSize } from "./Button";

/** Omit que se distribuye sobre cada miembro de la unión ButtonProps (LinkProps | NativeButtonProps). */
type DistributiveOmit<T, K extends keyof T> = T extends unknown ? Omit<T, K> : never;

type IconButtonProps = DistributiveOmit<ButtonProps, "variant" | "children" | "aria-label"> & {
  icon: ReactNode;
  /** Obligatorio: un IconButton no tiene texto visible (COMPONENTE-BOTONES-FORMULARIOS.md §2). */
  ariaLabel: string;
  size?: ButtonSize;
};

export function IconButton({ icon, ariaLabel, ...rest }: IconButtonProps) {
  return (
    <Button variant="icon" aria-label={ariaLabel} {...rest}>
      {icon}
    </Button>
  );
}
