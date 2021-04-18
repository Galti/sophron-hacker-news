import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Header from "../components/Header";
import HomePage from "../containers/HomePage";
import PageNotFound from "../components/PageNotFound";

const AppRouter = () => {
  return (
    <Router>
      <div className="container">
        <Header/>
        <Switch>
          <Route path="/" component={HomePage} exact={true}/>
          <Route component={PageNotFound}/>
        </Switch>
      </div>
    </Router>
  );
};

export default AppRouter;
