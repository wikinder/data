import { handleColor } from './color';
import { handleDate } from './date';
import { handleNumber } from './number';

export const DATA_HANDLERS = {
  color: handleColor,
  date: handleDate,
  number: handleNumber,
};
