import { handleColor } from './color';
import { handleDate } from './date';
import { handleNumber } from './number';

export const ROUTES = {
  color: handleColor,
  date: handleDate,
  number: handleNumber,
};
