import {IExpense} from "../../domain/IExpense";
import client from './chronoSimples.client'
import {IApiError} from "../../domain/IApiError";
import {ApiError} from "../../error/ApiError";

const BASE_URI = "/chrono-simples/v1/expenses";

async function findAll() : Promise<IExpense[] | undefined> {

  try {
    const response = await client.GET(BASE_URI);
    const { data: expenses } : { data: IExpense[] } = response;
    return expenses;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function remove(expenseId: string) : Promise<IExpense> {

  try {
    const response = await client.DELETE(`${BASE_URI}/${expenseId}`);
    const { data: expense } : { data: IExpense } = response;
    return expense;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function update(expense: IExpense) : Promise<IExpense> {

  try {
    const response = await client.PUT(`${BASE_URI}/${expense.id}`, {...expense, type: expense.type.value});
    const { data } : { data: IExpense } = response;
    return data;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }

}

async function create(expense: IExpense) : Promise<IExpense> {

  try {
    const response = await client.POST(`${BASE_URI}`, {...expense, type: expense.type.value});
    const { data } : { data: IExpense } = response;
    return data;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

export default {
  findAll,
  remove,
  update,
  create
}
