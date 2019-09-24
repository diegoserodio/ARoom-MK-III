import React from 'react';
import { Button, Nav, Navbar, NavbarBrand, NavItem, NavLink } from 'reactstrap';
import './Styles/sidebar.css'

export default class SideBar extends React.Component {
  render() {
    return(
      <div className="sidebar">
      <Navbar light>
        <Nav navbar vertical>
          <NavbarBrand>ARoom</NavbarBrand>
          <NavLink href="#">Home</NavLink>
          <NavLink href="#">Fita de LED</NavLink>
          <NavLink href="#">Smart Mirror</NavLink>
        </Nav>
      </Navbar>
      </div>
    );
  }
}
