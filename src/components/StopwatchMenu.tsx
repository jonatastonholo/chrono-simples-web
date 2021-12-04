import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {IProject} from "../domain/IProject";
import ComboBox from "./ComboBox";
import projectService from "../service/project.service";
import {IComboBoxValue} from "../domain/IComboBoxValue";
import {StopwatchButton} from "./StopwatchButton";
import {Box} from "@mui/material";
import stopwatchService from "../service/stopwatch.service";
import {IStopwatch} from "../domain/IStopwatch";
import {lightBlue, red} from "@mui/material/colors";


const useStyles = makeStyles({
  userDetails: {
    borderBottom: "1px solid rgb(224, 224, 224)",
    padding: "16px",
    marginBottom: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      marginBottom: "8px",
    },
  },
});

export function StopwatchMenu() {
  const classes = useStyles();
  let eventSource = useRef<EventSource | undefined>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [projects, setProjects] = useState<IProject[] | []>([]);
  const [projectsComboboxValues, setProjectsComboboxValues] = useState<IComboBoxValue[] | []>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | undefined>(undefined);
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [stopwatch, setStopwatch] = useState<IStopwatch | undefined>();
  const [stopwatchFormated, setStopwatchFormated] = useState<string | undefined>();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    (async () => {
      const comboBoxValues =
        projects
        .map(project => {
          return  {objectId: project.id, objectValue: project.name} as IComboBoxValue;
        });
      setProjectsComboboxValues(comboBoxValues);
    })();
  }, [projects]);

  // let eventSource: EventSource | undefined;
  // eventSource = undefined;
  useEffect(() => {
    listenStopWatch();
    return () => {
        eventSource.current?.close();
        console.log("event closed")
    }
  }, [])

  useEffect(() => {
    setSelectedProject(projects?.find(project => project.id === selectedProjectId))
  }, [selectedProjectId])

  useEffect(() => {
    setSelectedProjectId(stopwatch?.projectId)
  }, [stopwatch])

  useEffect(() => {
    setStopwatchFormated(formatStopwatch())
  }, [stopwatch])

  const listenStopWatch = () => {
    if (!listening) {
      eventSource.current = stopwatchService.listen();
      eventSource.current.onmessage = (event) => {
        const stopwatch = JSON.parse(event.data) as IStopwatch;
        setStopwatch(stopwatch);

      }
      eventSource.current.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.current?.close();
        setListening(false);
      }
      setListening(true);
    }
  }

  const formatStopwatch = () : string => {
    if(!stopwatch) return "";
    return `${stopwatch.days.toString().padStart(2,'0')}:${stopwatch.hours.toString().padStart(2,'0')}:${stopwatch.minutes.toString().padStart(2,'0')}:${stopwatch.seconds.toString().padStart(2,'0')}`;
  }

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    const projectsFound = (await projectService.findAll()) as Array<IProject>;
    setProjects(projectsFound);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleProjectSelect(projectId: string) {
    const project = projects.find(project => project.id === projectId);
    setSelectedProject(project)
  }

  async function handleButtonClick(running: boolean) {
    if (running) {
      await stopwatchService.stop();
      setListening(false);
      setStopwatch(undefined);
      eventSource.current?.close();
    } else {
      if(!!selectedProject && !listening) {
        await stopwatchService.start(selectedProject.id);
        listenStopWatch();
      }
    }
  }

  const stopwatchColor = !listening ? lightBlue["800"].toString() : red[500].toString();

  return (
    <div>
      <IconButton aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        <Avatar>
          <Icon style={{color: stopwatchColor}}>timer</Icon>
        </Avatar>
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className={classes.userDetails}>
          <Avatar>
            <Icon style={{color: stopwatchColor}}>timer</Icon>
          </Avatar>

          <StopwatchButton running={listening} onClick={handleButtonClick}/>
          {listening ? <Box>{stopwatchFormated}</Box> : <></>}
          {
            anchorEl
              ? <ComboBox disabled={listening} label={"Projeto"} values={projectsComboboxValues} selectedId={selectedProjectId} onSelect={handleProjectSelect}/>
              : <></>
          }
        </div>
      </Menu>
    </div>
  );
}
