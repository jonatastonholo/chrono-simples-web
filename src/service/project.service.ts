import {IProject} from "../domain/IProject";
import chronoSimplesClient from "../external/crhono-simples-api/project.client"


async function findAll() : Promise<IProject[] | undefined> {
  return await chronoSimplesClient.findAll();
}

async function remove(projectId: string) : Promise<void> {
  return await chronoSimplesClient.remove(projectId);
}

export default {findAll, remove}
