import {IExpenseType} from "./types/IExpenseType";

export interface IExpense {
  id: string;
  description: string;
  value: number;
  type: IExpenseType;
  periodBegin: Date;
  periodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}
