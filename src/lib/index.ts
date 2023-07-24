import { enGB } from 'date-fns/locale';
import { localeFromDateFnsLocale } from 'date-picker-svelte/locale';

export const fiveYearsInMilliseconds = 157784630000;
export const browseWithoutSelecting = false;
export const closeOnSelection = true;
export const formatString = 'dd-MM-yyyy';
export const locale = localeFromDateFnsLocale(enGB);
