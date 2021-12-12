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
