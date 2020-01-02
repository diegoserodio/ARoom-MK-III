import React, { Component } from 'react';
import { Button, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import logo from './logo.svg';
import './App.css';
import './Styles/normalize.css';
import Home from './home';
import AuxScreen from './AuxScreen';

// Making the App component
class App extends Component {
  constructor() {
    super();
    this.state = {
      screen: 0,
    };
  }

  // render method that renders in code if the state is updated
  render() {
    if(this.state.screen == 0){
    return (
        <div>
        <div className="sidebar">
        <Navbar light>
          <Nav navbar vertical>
            <NavbarBrand>ARoom</NavbarBrand>
            <NavLink href="#">Home</NavLink>
            <NavLink href="#" onClick={() => this.setState({screen: 1})}>AUX Screen</NavLink>
          </Nav>
        </Navbar>
        </div>

        <Home />
        </div>
    )}

    else if(this.state.screen == 1){
      return (
        <AuxScreen />
      )
    }
  }
}

export default App;
