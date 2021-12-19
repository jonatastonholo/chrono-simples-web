import {IExpense} from "../domain/IExpense";
import client from "../clients/crhono-simples-api/expense.client"

async function findAll() : Promise<IExpense[] | undefined> {
  return await client.findAll();
}

async function remove(expenseId: string) : Promise<IExpense> {
  return await client.remove(expenseId);
}

async function save(expense: IExpense) : Promise<IExpense> {
  console.log(expense)
  if (!expense.id) return await client.create(expense);
  return await client.update(expense);
}

export default {findAll, remove, save}
