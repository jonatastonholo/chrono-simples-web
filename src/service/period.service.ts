import {IPeriod} from "../domain/IPeriod";
import client from "../external/crhono-simples-api/period.client"

async function findAll() : Promise<IPeriod[] | undefined> {
  return await client.findAll();
}

async function remove(periodId: string) : Promise<IPeriod> {
  return await client.remove(periodId);
}

async function save(period: IPeriod) : Promise<IPeriod> {
  console.log(period)
  if (!period.id) return await client.create(period);
  return await client.update(period);
}

export default {findAll, remove, save}
