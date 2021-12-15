import {Divider, Theme} from "@mui/material";
import * as React from "react";
import {SxProps} from "@mui/system";

type props = {
  variant?: 'fullWidth' | 'inset' | 'middle';
  sx?: SxProps<Theme>;
}
export function DividerLine({sx, variant}: props) {
  return(
    <Divider variant={variant ?? 'middle'} sx={sx ?? {paddingTop: "20px"}} />
  );
}
