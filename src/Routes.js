import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./Core/Home";
import "./Core/styles.css";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route to="/" exact component={Home} />
      </Switch>
    </Router>
  );
}
