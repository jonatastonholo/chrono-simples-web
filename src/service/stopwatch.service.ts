import client from "../external/crhono-simples-api/stopwatch.client"
import {IStopwatch} from "../domain/IStopwatch";


function listen() : EventSource {
  return client.listen();
}

export async function start (projectId: string) : Promise<IStopwatch | undefined> {
  return await client.start(projectId);
}

export async function stop () : Promise<IStopwatch | undefined> {
  return await client.stop();
}


export default {listen, start, stop}
