import {ApiError} from "../../error/ApiError";
import chronoSimplesClient from './chronoSimples.client'
import {IStopwatch} from "../../domain/IStopwatch";
import {IApiError} from "../../domain/IApiError";

const BASE_URI = "/chrono-simples/v1/stopwatches";

function listen() : EventSource {
  try {
    return new EventSource(`${chronoSimplesClient.BASE_URL}${BASE_URI}/listen`)
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function start(projectId: string) : Promise<IStopwatch | undefined> {

  const response = await chronoSimplesClient.PATCH(`${BASE_URI}/start`, {projectId});

  try {
    const { data: stopwatch } : { data: IStopwatch } = response;
    return stopwatch;

  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}
async function stop() : Promise<IStopwatch | undefined> {

  const response = await chronoSimplesClient.PATCH(`${BASE_URI}/stop`);

  try {
    const { data: stopwatch } : { data: IStopwatch } = response;
    return stopwatch;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

export default {
  listen, start, stop
}
