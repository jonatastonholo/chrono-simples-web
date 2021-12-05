import {CardPanel} from "./CardPanel";
import ProjectTable from "./ProjectTable";
import EditProjectDialog from "./EditProjectDialog";
import React, {useEffect, useState} from "react";
import {IProject} from "../domain/IProject";
import projectService from "../service/project.service"
import {ContentHeader} from "./ContentHeader";
import {Container} from "@mui/material";
import {makeStyles} from "@material-ui/core";
import {theme} from "../Styles";
import {useSnackbar} from "notistack";
import {ApiError} from "../error/ApiError";

const useStyles = makeStyles({
  rootContent: {
    border: 0,
    padding: "0.0rem",
    marginTop: "0.02rem",
    marginBottom: "25px",
    textAlign: "center",
    color: theme.fonts.color,
    display: "flex",
    flexDirection: "row",
  },
  content: {

    padding: "0.50rem",
    textAlign: "center",
  },
});

export function ProjectsContentPanel() {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [projectSelected, setProjectSelected] = React.useState<IProject | undefined>();
  const [projects, setProjects] = useState<IProject[] | []>([]);

  useEffect(() => {
    (async () => {
      await loadProjects();
    })();
  }, []);

  useEffect(() => {
    if(projectSelected) {
      setOpenEditDialog(true);
    }
  }, [projectSelected]);

  const loadProjects = async() => {
    const projects = (await projectService.findAll()) as Array<IProject>;
    setProjects(projects);
  }

  const handleAddNewClick = () => {
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    setProjectSelected(undefined);
  };

  const handleSave = async (project: IProject) => {
    try {
      await projectService.save(project);
      setOpenEditDialog(false);
      setProjectSelected(undefined);
      enqueueSnackbar("Projeto salvo com sucesso", { variant: 'success' });
      await loadProjects();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleDelete(projectId: string)  {
    try {
      await projectService.remove(projectId);
      enqueueSnackbar("Projeto removido com sucesso", { variant: 'success' });
      await loadProjects();
    } catch (apiError: ApiError | any) {
      enqueueSnackbar(apiError.message, { variant: 'error' });
    }
  }

  async function handleEdit(projectId: string)  {
    setProjectSelected(projects.find(p => p.id === projectId));
  }

  return (
    <CardPanel>
      <Container className={classes.rootContent}>
          <ContentHeader title={"Projetos"} onAddNewClick={handleAddNewClick}/>
          <ProjectTable projects={projects} onDelete={handleDelete} onEdit={handleEdit} />
          <EditProjectDialog
            project={projectSelected}
            open={openEditDialog}
            onClose={handleClose}
            onSave={handleSave}
          />
      </Container>
    </CardPanel>
  );
}
