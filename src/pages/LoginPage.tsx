import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import * as React from "react";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { signIn } from "../service/security.service";
import { CardPanel } from "../components/CardPanel";
import { Card, Typography } from "@material-ui/core";
import { theme } from "../Styles";
import { IUser } from "../domain/IUser";

const useStyles = makeStyles({
  root: {
    width: "100%",
    margin: "15% auto",
    textAlign: "center",
    verticalAlign: "center",
  },
  error: {
    color: "rgba(217,43,43,0.76)",
    borderRadius: "4px",
    padding: "16px",
    margin: "16px 0",
  },

  infoBox: {
    background: "linear-gradient(45deg, #3C3F41 30%, #3C3F41 70%)",
    border: 0,
    borderRadius: 5,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    fontWeight: 200,
    padding: "0.25rem",
    margin: "auto 14px auto auto",
    textAlign: "center",
    verticalAlign: "center",
    color: theme.fonts.color,
  },
  infoBoxContent: {
    display: "flex",
    flexDirection: "column",
    padding: "0.50rem",
    textAlign: "center",
    verticalAlign: "center",
    "& h2": {
      background: "linear-gradient(45deg, #3C3F41 30%, #3C3F41 70%)",
      boxShadow: "0 .8px 0 0 rgba(255, 105, 135, .3)",
      fontWeight: 600,
      fontSize: "1.2rem",
      width: "70%",
      textAlign: "center",
      alignItems: "center",
      margin: "18px auto",
    },
    "& p": {
      fontWeight: 350,
      fontSize: ".9rem",
    },
  },
  button: {
    width: "100%",
    margin: "auto",
    color: theme.button.color,
    backgroundColor: theme.button.backgroundColor,
    "&:hover": {
      background: "linear-gradient(45deg, #3C3F41 50%, #3C3F41 50%)",
      boxShadow: ".8px .8px 10.8px .8px rgba(255, 105, 135, .3)",
      backgroundColor: theme.button.hover.backgroundColor,
      color: theme.button.hover.color,
    },
  },
});

interface ILoginScreenProps {
  onSignIn: (user: IUser) => void;
}

export function LoginPage(props: ILoginScreenProps) {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(evt: React.FormEvent) {
    evt.preventDefault();
    const user = await signIn(email, password);
    if (!user) {
      setError("E-mail e/ou senha inválidos");
    } else {
      console.log("signIn");
      props.onSignIn(user);
    }
  }

  return (
    <Container className={classes.root} maxWidth="sm">
      <CardPanel>
        <Card className={classes.infoBox}>
          <Typography component="div">
            <Box className={classes.infoBoxContent}>
              <Box>
                <h2>{"Chrono Simples"}</h2>
              </Box>
              <Box>
                <p>
                  Digite e-mail e senha para entrar no sistema.
                </p>
              </Box>
            </Box>
          </Typography>
        </Card>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            label="E-mail"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
          <TextField
            type="password"
            margin="normal"
            label="Senha"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
          {error && <div className={classes.error}>{error}</div>}

          <Button className={classes.button} type="submit" variant="contained">
            Entrar
          </Button>
        </form>
      </CardPanel>
    </Container>
  );
}
