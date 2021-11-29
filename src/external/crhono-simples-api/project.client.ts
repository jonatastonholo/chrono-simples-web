import {IProject} from "../../domain/IProject";
import {ApiError} from "../../error/ApiError";
import chronoSimplesClient from './chronoSimples.client'
const BASE_URI = "/chrono-simples/v1/projects";

async function findAll() : Promise<IProject[] | undefined> {

  const response = await chronoSimplesClient.GET(BASE_URI);

  if (response.status === 200) {
    const { data: projects } : { data: IProject[] } = response;
    return projects;
  } else {
    throw new ApiError(response.status, "Error on find all projects", response);
  }
}

async function remove(projectId: string) : Promise<void> {

  const response = await chronoSimplesClient.DELETE(`${BASE_URI}/${projectId}`);

  if (response.status !== 200) {
    throw new ApiError(response.status, "Error on delete project", response);
  }
}

export default {
  findAll,
  remove
}
