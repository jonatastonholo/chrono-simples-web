import {IProject} from "../../domain/IProject";
import chronoSimplesClient from './chronoSimples.client'
import {IApiError} from "../../domain/IApiError";
import {ApiError} from "../../error/ApiError";

const BASE_URI = "/chrono-simples/v1/projects";

async function findAll() : Promise<IProject[] | undefined> {

  try {
    const response = await chronoSimplesClient.GET(BASE_URI);
    const { data: projects } : { data: IProject[] } = response;
    return projects;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function remove(projectId: string) : Promise<IProject> {

  try {
    const response = await chronoSimplesClient.DELETE(`${BASE_URI}/${projectId}`);
    const { data: project } : { data: IProject } = response;
    return project;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }
}

async function update(project: IProject) : Promise<IProject> {

  try {
    const response = await chronoSimplesClient.PUT(`${BASE_URI}/${project.id}`, project);
    const { data } : { data: IProject } = response;
    return data;
  } catch (err: any) {
    const { data } : { data: IApiError } = err.response;
    throw new ApiError(data.statusCode, data.message, err);
  }

}

async function create(project: IProject) : Promise<IProject> {

  try {
    const response = await chronoSimplesClient.POST(`${BASE_URI}`, project);
    const { data } : { data: IProject } = response;
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
