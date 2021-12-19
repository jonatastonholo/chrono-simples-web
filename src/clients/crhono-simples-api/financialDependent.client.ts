import {IFinancialDependent} from "../../domain/IFinancialDependent";
import client from './chronoSimples.client'
import {IApiError} from "../../domain/IApiError";
import {ApiError} from "../../error/ApiError";

const BASE_URI = "/chrono-simples/v1/financial-dependents";

async function findAll() : Promise<IFinancialDependent[] | undefined> {

  try {
    const response = await client.GET(BASE_URI);
    const { data: financialDependents } : { data: IFinancialDependent[] } = response;
    return financialDependents;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function remove(financialDependentId: string) : Promise<IFinancialDependent> {

  try {
    const response = await client.DELETE(`${BASE_URI}/${financialDependentId}`);
    const { data: financialDependent } : { data: IFinancialDependent } = response;
    return financialDependent;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function update(financialDependent: IFinancialDependent) : Promise<IFinancialDependent> {

  try {
    const response = await client.PUT(`${BASE_URI}/${financialDependent.id}`, financialDependent);
    const { data } : { data: IFinancialDependent } = response;
    return data;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }

}

async function create(financialDependent: IFinancialDependent) : Promise<IFinancialDependent> {

  try {
    const response = await client.POST(`${BASE_URI}`, financialDependent);
    const { data } : { data: IFinancialDependent } = response;
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
