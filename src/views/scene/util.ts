export interface ISize {
  width: number;
  height: number;
}

export interface IPosition {
  left: number;
  top: number;
}

export type { Position } from '@vueuse/core';

export const defaultSize: Readonly<ISize> = {
  width: 576,
  height: 324,
};
