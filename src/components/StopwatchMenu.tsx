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
  const [projectsComboboxValue, setProjectsComboboxValue] = useState<IComboBoxValue[] | []>([]);
  const [selectedProject, setSelectedProject] = useState<IProject | undefined>(undefined);
  const [stopWatchValue, setStopWatchValue] = useState<string | undefined>();
  const [listening, setListening] = useState(false);

  useEffect(() => {
    (async () => {
      const projectsFound = (await projectService.findAll()) as Array<IProject>;
      const comboboxValue = projectsFound
        .map(project => {
          return  {objectId: project.id, objectValue: project.name} as IComboBoxValue;
        })
      setProjectsComboboxValue(comboboxValue);
      setProjects(projectsFound);
    })();
  }, []);

  // let eventSource: EventSource | undefined;
  // eventSource = undefined;
  useEffect(() => {
    listenStopWatch();
    return () => {
        eventSource.current?.close();
        console.log("event closed")
    }

  }, [])

  const listenStopWatch = () => {
    if (!listening) {
      eventSource.current = stopwatchService.listen();
      eventSource.current.onmessage = (event) => {
        const stopwatch = JSON.parse(event.data) as IStopwatch;
        setStopWatchValue(formatStopwatch(stopwatch));
      }
      eventSource.current.onerror = (err) => {
        console.error("EventSource failed:", err);
        eventSource.current?.close();
        setListening(false);
      }
      setListening(true);
    }
  }

  function formatStopwatch(stopwatch: IStopwatch) {
    return `${stopwatch.days.toString().padStart(2,'0')}:${stopwatch.hours.toString().padStart(2,'0')}:${stopwatch.minutes.toString().padStart(2,'0')}:${stopwatch.seconds.toString().padStart(2,'0')}`;
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleProjectSelect(projectId: string) {
    console.log(projectId);
    const project = projects.find(project => project.id === projectId);
    console.log(project);
    setSelectedProject(project)
    // onStop(projectId);
  }

  async function handleButtonClick(running: boolean) {
    if (running) {
      console.log("Stopping stopwatch");
      await stopwatchService.stop();
      setListening(false);
      setStopWatchValue(undefined);
      eventSource.current?.close();
    } else {
      if(!!selectedProject && !listening) {
        console.log("Starting stopwatch");
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
          {listening ? <Box>{stopWatchValue}</Box> : <></>}

          <ComboBox label={"Projeto"} values={projectsComboboxValue} defaultValue={projectsComboboxValue[0]} onSelect={handleProjectSelect}/>
        </div>
      </Menu>
    </div>
  );
}
