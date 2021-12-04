import {ApiError} from "../../error/ApiError";
import chronoSimplesClient from './chronoSimples.client'
import {IStopwatch} from "../../domain/IStopwatch";

const BASE_URI = "/chrono-simples/v1/stopwatches";

function listen() : EventSource {

  return new EventSource(`${chronoSimplesClient.BASE_URL}${BASE_URI}/listen`)
}

async function start(projectId: string) : Promise<IStopwatch | undefined> {

  const response = await chronoSimplesClient.PATCH(`${BASE_URI}/start`, {projectId});

  if (response.status === 201) {
    const { data: stopwatch } : { data: IStopwatch } = response;
    return stopwatch;
  } else {
    throw new ApiError(response.status, "Error on listen stopwatch", response);
  }
}
async function stop() : Promise<IStopwatch | undefined> {

  const response = await chronoSimplesClient.PATCH(`${BASE_URI}/stop`);

  if (response.status === 200) {
    const { data: stopwatch } : { data: IStopwatch } = response;
    return stopwatch;
  } else {
    throw new ApiError(response.status, "Error on listen stopwatch", response);
  }
}

export default {
  listen, start, stop
}
