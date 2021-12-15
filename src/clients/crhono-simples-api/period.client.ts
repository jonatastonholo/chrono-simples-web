import {IPeriod} from "../../domain/IPeriod";
import client from './chronoSimples.client'
import {IApiError} from "../../domain/IApiError";
import {ApiError} from "../../error/ApiError";

const BASE_URI = "/chrono-simples/v1/periods";

async function findAll() : Promise<IPeriod[] | undefined> {

  try {
    const response = await client.GET(BASE_URI);
    const { data: periods } : { data: IPeriod[] } = response;
    return periods;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function remove(periodId: string) : Promise<IPeriod> {

  try {
    const response = await client.DELETE(`${BASE_URI}/${periodId}`);
    const { data: period } : { data: IPeriod } = response;
    return period;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function update(period: IPeriod) : Promise<IPeriod> {

  try {
    const response = await client.PUT(`${BASE_URI}/${period.id}`, {...period, projectId: period.project.id});
    const { data } : { data: IPeriod } = response;
    return data;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }

}

async function create(period: IPeriod) : Promise<IPeriod> {

  try {
    const response = await client.POST(`${BASE_URI}`, {...period, projectId: period.project.id});
    const { data } : { data: IPeriod } = response;
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
