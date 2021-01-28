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
  if(!!Cookies.get('access_token')){
    userStateStart = Cookies.get('access_token').split("#")[0]
  }
  const [user, setUser] = useState(userStateStart)
  
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/questionnaire">Questionnaire</Link>
          </li>
          <li>
            <Link to="/registration">Registration</Link>
          </li>
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        
          <Route exact path="/">
            <Home></Home>
          </Route>
          <Route path="/login">
            <Login user={user} userCallback={(a) => setUser(a)}></Login>
          </Route>
          <Route path="/questionnaire">
            <Questionnaire user={user}></Questionnaire>
          </Route>
          <Route path="/registration">
           <Registration></Registration>
          </Route>
      </div>
    </Router>
  );
}

export default App;
