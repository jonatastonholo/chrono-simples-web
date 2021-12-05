import React from "react";
import {Box, Stack} from "@mui/material";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import {lightBlue, red} from "@mui/material/colors";

type props = {
  running?: boolean;
  disabled: boolean;
  onClick: (running: boolean) => void
}
export function StopwatchButton({running = false, disabled = true, onClick} : props) {
  const stopwatchColor = running
    ? red[500].toString()
    : lightBlue["800"].toString();

  const icon = running
    ? <StopIcon style={{color: stopwatchColor}}/>
    : <PlayIcon style={{color: stopwatchColor}}/>;

  const handleClick = () => {
    onClick(running);
  }

  return (
    <Box>
      <Stack direction="row" spacing={1}>
        <IconButton disabled={disabled} style={{color: stopwatchColor}} aria-label="start stopwatch" onClick={handleClick}>
          {icon}
        </IconButton>
      </Stack>
    </Box>
  );
}
