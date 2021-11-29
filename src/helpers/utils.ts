//prettier-ignore
export function toReal(value: number): string {
  return new Intl.NumberFormat("pt-BR",
    { style: "currency", currency: "BRL" })
    .format(value);
}

//prettier-ignore
export function toCurrency(value: number): string {
  return toReal(value).replaceAll("R$", '').trim();
}
