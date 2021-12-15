import React, {useEffect, useState} from "react";
import ProjectPage from "./pages/ProjectPage";
import PeriodPage from "./pages/PeriodPage";
import {IUser} from "./domain/IUser";
import {LoginPage} from "./pages/LoginPage";
import {authContext} from "./security/authContext";
import {getSession} from "./service/security.service";
import {HashRouter, Redirect, Route, Switch} from "react-router-dom";
import {PageHeader} from "./components/PageHeader";
import {Container} from "@mui/material";
import ReportPage from "./pages/ReportPage";

export default function Main() {
  const [user, setUser] = useState<IUser | null | undefined>(null);

  useEffect(() => {
    (async () => {
      try {
        const usuarioSessao = await getSession();
        setUser(usuarioSessao);
      } catch (e) {
        onSignOut();
      }
    })();
  }, []);

  function onSignOut() {
    setUser(null);
  }

  if (user) {
    return (
        <authContext.Provider value={{ user, onSignOut }}>
          <Container>
            <PageHeader title={"Chrono Simples"} />
            <HashRouter>
              <Switch>
                <Route path="/projects">
                  <ProjectPage />
                </Route>
                <Route path="/periods">
                  <PeriodPage />
                </Route>
                <Route path="/reports">
                  <ReportPage />
                </Route>
                <Redirect to={{ pathname: `/projects` }} />
              </Switch>
            </HashRouter>
          </Container>
        </authContext.Provider>
      );
  }
  return <LoginPage onSignIn={setUser} />;
}
