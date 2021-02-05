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
import UserTasks from "./UserTasks/UserTasks";
import TaskCreator from "./UserTasks/TaskCreator/TaskCreator";
import UserManagement from './UserManagement/UserManagement'
import Visualization from "./Visualization/Visualization";

import "./App.css";
import 'font-awesome/css/font-awesome.min.css';
import logo from './logo.png'
import Refresh from "./Refresh/Refresh";
import Share from "./Share/Share";


let callApi = async (endpoint = "") => {
  const response = await fetch('/api/' + endpoint);
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
  let refreshWrapper = (props) => {
    return (<Refresh history={props.history} user={user}>

    </Refresh>)
  }

  let tasksWrapper = (props) => {
    return (<UserTasks history={props.history} user={user}>

		</UserTasks>)
	}
	let taskCreatorWrapper = (props) => {
		return (<TaskCreator history={props.history} user={user}>

		</TaskCreator>)
	}
  let visualizationWrapper = (props) =>{
    return(
      <Visualization history = {props.history} user={user}></Visualization>
    )
  }
  let shareWrapper = (props) => {
    return (<Share history={props.history} user={user}></Share>)
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
          <Link to="/login" onClick={(e) => { dropDown(e) }} >{!(Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") ? "Login" : "Sign Out"} </Link>

          {((Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") && user.position > 1) ? (
            <Link to="user_management" onClick={(e) => { dropDown(e) }}> Manage Users</Link>) : null}

          {((Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in")) ? (
          <Link to="/tasks" onClick={(e) => { dropDown(e) }}>Tasks</Link>) : null}
		  {((Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") && user.position >= 1) ? (
          <Link to="/task_creator" onClick={(e) => { dropDown(e) }}>Task Creator</Link>) : null}
          {!(Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") ? (<Link to="/registration" onClick={(e) => { dropDown(e) }}>Registration</Link>) : null}
          {(Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") ?
            (<Link to="/questionnaire" onClick={(e) => { dropDown(e) }}>Questionnaire </Link>) : null}

          {(Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") ? (
            <Link to="/visualisation" onClick={(e) => { dropDown(e) }}>visualisation</Link>) : null}
          <Link className="Home" to="/" onClick={(e) => { dropDown(e) }}>Home </Link>
        </header>
        <div className="main">


          {/*
         A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
		<Route path="/task_creator" component={taskCreatorWrapper}/>

          <Route exact path="/" component={homeWrapper} />
          <Route path="/login" component={loginWrapper} />
          <Route path="/questionnaire" component={questionnaireWrapper} />
          <Route path="/registration" component={registrationWrapper} />
          <Route path="/refresh" component={refreshWrapper} />
          <Route path="/tasks" component={tasksWrapper} />
          <Route path="/visualisation" component={visualizationWrapper}></Route>
          <Route path="/user_management" component={userManagementWrapper} />
          <Route path="/share" component={shareWrapper} />

        </div>

        <footer className="site-footer">
          <div className="col col-1">
            University of Dundee <br/>
            Nethergate <br/>
            Dundee <br/>
            Scotland, UK <br/>
            DD1 4HN <br/>
          </div>
          <hr />
          <div className="col col-2">
            <a href="https://www.dundee.ac.uk/corporate-information/disclaimer-copyright-privacy-cookies">Disclaimer</a> <br/>
            <a href="https://www.dundee.ac.uk/corporate-information/accessibility-statement">Accessibility Statement</a> <br/>
            <a href="https://www.dundee.ac.uk/corporate-information/modern-slavery-statement">Modern Slavery Statement</a> <br/> 
          </div>
          <hr />
          <div className="col col-3">
            <div>
              <a href="https://www.dundee.ac.uk/about">About</a>
              <a href="https://www.dundee.ac.uk/hr/uodrecruitment/jobvacancies/">Jobs</a>
              <a href="https://www.dundee.ac.uk/events">Events</a>
              <a href="https://www.dundee.ac.uk/stories">Stories</a>
            </div>
            <div className="social-media">
              <a href="https://www.facebook.com/UniversityofDundee"><i class="fa fa-facebook" aria-hidden="true"></i></a>
              <a href="https://twitter.com/dundeeuni"><i class="fa fa-twitter" aria-hidden="true"></i></a>
              <a href="https://www.youtube.com/universityofdundee"><i class="fa fa-youtube-play" aria-hidden="true"></i></a>
              <a href="https://www.instagram.com/dundeeuni/"><i class="fa fa-instagram" aria-hidden="true"></i></a>
            </div> 
          </div>
          

        </footer>
      </div>


    </Router>

  );
}

export default App;
