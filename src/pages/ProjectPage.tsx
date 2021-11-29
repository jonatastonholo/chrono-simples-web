import React, { useEffect, useState } from "react";

import { Container } from "@material-ui/core";
import {IProject} from "../domain/IProject";
import projectService from "../service/project.service"
import {ProjectsContentPanel} from "../components/ProjectsContentPanel";
import {PageHeader} from "../components/PageHeader";

export default function ProjectPage() {
  const [projects, setProjects] = useState<IProject[] | []>([]);

  useEffect(() => {
    (async () => {
      const projects = (await projectService.findAll()) as Array<IProject>;
      setProjects(projects);
    })();
  }, []);

  return (
    <Container>
      <PageHeader title={"Projetos"} />
      <ProjectsContentPanel projects={projects} />
    </Container>
  );
}
