import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
// import './Styles/normalize.css';
import AuxScreen from './Views/AuxScreen';

export default function App() {
  return (
    <div className="App" style={{overflowX:'hidden'}}>
    <Router>
      <Switch>
        <Route path="/">
          <AuxScreen />
        </Route>
      </Switch>
    </Router>
    </div>
  );
}
