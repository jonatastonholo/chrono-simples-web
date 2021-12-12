import {IWorkedHours} from "./IWorkedHours";
import {IExpense} from "./IExpense";

export interface IReport {
  periodBegin: Date;
  periodEnd: Date;
  last12MonthEarnings: number;
  periodEarnings: number;
  baseProLabor: number;
  liquidProLabor: number;
  proLaborToWithdrawal: number;
  profitToWithdrawal: number;
  amountToWithdrawal: number;
  amountToKeep: number;
  rFactor: number;
  financialDependents: number;
  financialDependentsDeduction: number;
  inssAmount: number;
  irrfAmount: number;
  dasAmount: number;
  workedHours: IWorkedHours;
  expenses?: IExpense[];
}
