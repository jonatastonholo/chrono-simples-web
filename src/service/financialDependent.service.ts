import {IFinancialDependent} from "../domain/IFinancialDependent";
import client from "../clients/crhono-simples-api/financialDependent.client"

async function findAll() : Promise<IFinancialDependent[] | undefined> {
  return await client.findAll();
}

async function remove(financialDependentId: string) : Promise<IFinancialDependent> {
  return await client.remove(financialDependentId);
}

async function save(financialDependent: IFinancialDependent) : Promise<IFinancialDependent> {
  if (!financialDependent.id) return await client.create(financialDependent);
  return await client.update(financialDependent);
}

export default {findAll, remove, save}
