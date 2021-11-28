import { makeStyles } from "@material-ui/core";

const darkTheme = {
  background: "#3c3f41",
  button: {
    backgroundColor: "#212626",
    color: "#b7bdb7",
    hover: {
      backgroundColor: "#322b38",
      color: "#b7bdb7",
    },
  },
  fonts: {
    color: "#b7bdb7",
  },
};

export const container = {
  textAlign: "center",
  alignItems: "center",
  margin: "auto",
  padding: "1rem",
};

export const center = {
  textAlign: "center",
  alignItems: "center",
  margin: "auto",
};

export const theme = darkTheme;

export const commonStyles = makeStyles({
  theme: {
    background: theme.background,
    color: theme.fonts.color,
  },
  fonts: {
    color: theme.fonts.color,
  },
  center: {
    textAlign: "center",
    alignItems: "center",
    margin: "auto",
  },
  container: {
    textAlign: "center",
    alignItems: "center",
    margin: "auto",
    padding: "1rem",
  },
});
