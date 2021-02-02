import React, { useState, withRouter } from "react";
import Cookies from 'js-cookie'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Questionnaire from "./Questionnaire/Questionnaire";
import Registration from "./Registration/Registration";
import UserManagement from './UserManagement/UserManagement'

import "./App.css";
import 'font-awesome/css/font-awesome.min.css';
import logo from './logo.png'


let callApi = async (endpoint = "") => {
  const response = await fetch('http://localhost:3001/' + endpoint);
  const body = await response.json();
  if (response.status !== 200) throw Error(body.message);

  return body;
};
function App() {

  callApi("test").then(res => console.log(res)).catch(err => console.log(err));
  console.log("reloading-app");
  let userStateStart = ""
  let idStateStart = ""
  let positionStateStart = ""
  if (!!Cookies.get('access_token')) {
    userStateStart = Cookies.get('access_token').split("#")[0]
    idStateStart = Cookies.get('access_token').split("#")[1]
    positionStateStart = Cookies.get('access_token').split("#")[2]
  }

  const [user, setUser] = useState({ user: userStateStart, id: idStateStart, position: positionStateStart })
  console.log(user);
  let homeWrapper = (props) => {
    return (
      <Home history={props.history} user={user}></Home>
    )

  }
  let loginWrapper = (props) => {
    return (
      <Login history={props.history} user={user} userCallback={(a) => setUser(a)}></Login>
    )
  }
  let registrationWrapper = (props) => {
    return (
      <Registration history={props.history} user={user} ></Registration>
    )
  }
  let questionnaireWrapper = (props) => {
    return (
      <Questionnaire history={props.history} user={user}></Questionnaire>
    )
  }
  let userManagementWrapper = (props) => {
    return (<UserManagement history={props.history} user={user}>

    </UserManagement>)
  }
  console.log(user);





  let myFunction = () => {
    var x = document.getElementById("header");
    if (x.className === "header") {
      x.className += " responsive";
    } else {
      x.className = "header";
    }
  }

  let dropDown = () => {
    var x = document.getElementById("header");
    if (x.className === "header responsive") {
      x.className = "header";
    }
  }
  return (
    <Router>
      <div className='container'>
        <header id="header" className="header">
          <img className="logo" src={logo} />
          <a href="javascript:void(0);" className="icon" onClick={(e) => { myFunction(e) }}>
            <i class="fa fa-bars"> </i>
          </a>
          <Link to="/" onClick={(e) => { dropDown(e) }}>Home </Link>
          <Link to="/login" onClick={(e) => { dropDown(e) }} >{!(Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") ? "Login" : "Sign Out"} </Link>
          <Link to="/questionnaire" onClick={(e) => { dropDown(e) }}>Questionnaire </Link>
          {!(Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") ? (<Link to="/registration" onClick={(e) => { dropDown(e) }}>Registration</Link>) : null}
          {((Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") && user.position > 1) ? (
            <Link to="user_management" onClick={(e) => { dropDown(e) }}> Manage Users</Link>) : null}
        </header>

        {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
        <Route exact path="/" component={homeWrapper} />
        <Route path="/login" component={loginWrapper} />
        <Route path="/questionnaire" component={questionnaireWrapper} />
        <Route path="/registration" component={registrationWrapper} />

        <Route path="/user_management" component={userManagementWrapper} />
        <footer>
          <div>
            <p> Footer </p>
          </div>

        </footer>

      </div>

    </Router>

  );
}

export default App;
