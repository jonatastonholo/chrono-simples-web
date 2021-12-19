import {format,} from 'date-fns-tz';

//prettier-ignore
export function toReal(value: number): string {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL" })
    .format(value);
}
//prettier-ignore
export function toDolar(value: number): string {
  return new Intl.NumberFormat("en-US",
    { style: "currency", currency: "USD" })
    .format(value);
}

//prettier-ignore
export function toCurrency(value: number): string {
  return toReal(value).replaceAll("R$", '').trim();
}

//prettier-ignore
export function formattedCurrency(currency: string, value: number) {
  switch (currency) {
    case "BRL": return toReal(value);
    case "USD": return toDolar(value);
    default: return "ERROR";
  }
}

export function formattedDate(date: Date) : string {
  return format(getDateWithCorrectTimezone(date), 'dd/MM/yyyy', {
    timeZone: 'America/Sao_Paulo',
  });
}

export function formattedDateTime(date: Date) : string {
  return format(getDateWithCorrectTimezone(date), 'dd/MM/yyyy HH:mm:ss', {
    timeZone: 'America/Sao_Paulo',
  });
}

export function serverFormattedDateTime(date: Date) : string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSSSS", {
    timeZone: 'America/Sao_Paulo',
  });
}

export function getDateWithCorrectTimezone(date: Date) : Date {
  const dt = new Date(date);
  return  new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
}

//prettier-ignore
export function formattedPercentage(value: number) {
  if (value) return (value*100).toFixed(2).toString().padStart(2, '0').padEnd(2, '0') + "%";
}
