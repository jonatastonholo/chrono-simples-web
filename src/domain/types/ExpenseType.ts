import {IExpenseType} from "./IExpenseType";

export enum ExpenseType {
  PERSONAL = "Gastos dedutíveis no IRRF",
  COMPANY = "Gastos da empresa"
}

export const expensesType = [
  {value: "COMPANY", description: ExpenseType.COMPANY} as IExpenseType,
  {value: "PERSONAL", description: ExpenseType.PERSONAL} as IExpenseType,
];
