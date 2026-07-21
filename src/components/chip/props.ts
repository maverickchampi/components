import React from "react";

export type ChipVariant = "primary" | "outline";

interface BaseChipProps {
  ariaLabel?: string;
  className?: string;
  children: React.ReactNode;
  variant?: ChipVariant;
}

type ReadonlyExplicitProps = {
  readonly: true;
  href?: never;
  onClick?: never;
  disabled?: never;
} & Omit<React.ComponentPropsWithoutRef<"span">, "children">;

type ReadonlyDefaultProps = {
  readonly?: never;
  href?: never;
  onClick?: never;
  disabled?: never;
} & Omit<React.ComponentPropsWithoutRef<"span">, "children">;

type LinkChipProps = {
  readonly: false;
  href: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  disabled?: never;
} & Omit<React.ComponentPropsWithoutRef<"a">, "onClick" | "children">;

type ButtonChipProps = {
  readonly: false;
  href?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"button">, "onClick" | "disabled" | "children">;

export type ChipProps = BaseChipProps & 
  (ReadonlyExplicitProps | ReadonlyDefaultProps | LinkChipProps | ButtonChipProps);
