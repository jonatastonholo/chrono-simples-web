import React from "react";

import {Container} from "@material-ui/core";
import {ProjectsContentPanel} from "../components/ProjectsContentPanel";
import {PageHeader} from "../components/PageHeader";

export default function ProjectPage() {
  return (
    <Container>
      <PageHeader title={"Chrono Simples"} />
      <ProjectsContentPanel />
    </Container>
  );
}
