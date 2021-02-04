import React, { useState, withRouter } from "react";
import Cookies from 'js-cookie'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './Home.css'
import Login from "../Login/Login";
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.history = props.history

        this.state = { user: props.user.user, id: props.user.id, position: props.user.position };
    }
    render() {
        return (
            <div className="home-page-wrapper">
                <div className="home-page-square-one"> 
                    <Link to="/login" onClick={(e) => { dropDown(e) }} >{!(Cookies.get('access_token') == user.user + "#" + user.id + "#" + user.position + "#logged-in") ? "Login" : "Sign Out"} </Link>
                </div>
                <Route path="/login" component={loginWrapper} />
                <div className="home-page-square-two"> </div>
            </div>
        )
    }
}
