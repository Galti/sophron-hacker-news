import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "../components/Header";
import HomePage from "../containers/HomePage";
import PageNotFound from "../components/PageNotFound";
import {Container, CssBaseline} from "@material-ui/core";

const AppRouter = () => {
  return (
    <Router>
      <CssBaseline/>
      <Container maxWidth="lg">
        <Header/>
        <Switch>
          <Route path="/" component={HomePage} exact={true}/>
          <Route component={PageNotFound}/>
        </Switch>
      </Container>
    </Router>
  );
};

export default AppRouter;
