import {IProject} from "../domain/IProject";
import chronoSimplesClient from "../clients/crhono-simples-api/project.client"

async function findAll() : Promise<IProject[] | undefined> {
  return await chronoSimplesClient.findAll();
}

async function remove(projectId: string) : Promise<IProject> {
  return await chronoSimplesClient.remove(projectId);
}

async function save(project: IProject) : Promise<IProject> {
  console.log(project)
  if (!project.id) return await chronoSimplesClient.create(project);
  return await chronoSimplesClient.update(project);
}

export default {findAll, remove, save}
