import {ExpenseType} from "./types/ExpenseType";

export interface IExpense {
  id: string;
  description: string;
  value: number;
  type: ExpenseType;
  periodBegin: Date;
  periodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
