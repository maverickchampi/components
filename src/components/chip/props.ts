import React from "react";

export type ChipVariant = "primary" | "outline";
export type ChipSize = "small" | "medium" | "large";

interface BaseChipProps {
  className?: string;
  children: React.ReactNode;
  variant?: ChipVariant;
  size?: ChipSize;
}

type ReadonlyChipProps = {
  readonly?: true;
  href?: never;
  onClick?: never;
  disabled?: never;
} & Omit<React.ComponentPropsWithoutRef<"span">, "children">;

type ReadonlyExplicitProps = {
  readonly: true;
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

export type ChipProps = BaseChipProps & (ReadonlyChipProps | LinkChipProps | ButtonChipProps);
