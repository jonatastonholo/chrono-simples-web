import { CardPanel } from "./CardPanel";
import ProjectTable from "./ProjectTable";
import React from "react";
import {IProject} from "../domain/IProject";
import projectService from "../service/project.service"

type props = {
  projects: IProject[];
};
export function ProjectsContentPanel({ projects }: props) {

  async function handleDelete(projectId: string)  {
    await projectService.remove(projectId);
    window.location.reload();
  }

  async function handleEdit(projectId: string)  {
    console.log(projectId);
  }

  if (!projects || projects.length === 0) {
    return (
      <CardPanel>
        No projects
      </CardPanel>
    );
  }

  return (
    <CardPanel>
      <ProjectTable projects={projects} onDelete={handleDelete} onEdit={handleEdit} />
    </CardPanel>
  );
}
