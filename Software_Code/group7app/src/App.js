import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./Home/Home";
import Login from "./Login/Login";
import Questionnaire from "./Questionnaire/Questionnaire";

let callApi = async (endpoint = "") => {
    const response = await fetch('http://localhost:3001/' + endpoint);
	const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    
    return body;
};

function App() {
	callApi("test").then(res => console.log(res)).catch(err => console.log(err));
  return (
    <Router>
      <div>
        <header>
          <ul id="listHeader">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/questionnaire">Questionnaire</Link>
            </li>
          </ul>
        </header>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route exact path="/">
            <Home></Home>
          </Route>
          <Route path="/login">
            <Login></Login>
          </Route>
          <Route path="/questionnaire">
           <Questionnaire></Questionnaire>
          </Route>
        </Switch>
      </div>
      <div> Footer </div>
    </Router>
    
  );
}

export default App;
