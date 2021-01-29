import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import './Questionnaire.css'

import Cookies from 'js-cookie'
import { Redirect } from 'react-router-dom'
import QuestionnaireCreator from './QuestionnaireCreator/QuestionnaireCreator'
import QuestionnaireTaker from './QuestionnaireTaker/QuestionnaireTaker';
export default class Questionnaire extends Component {
    constructor(props) {
        super(props)
        this.history = props.history
        this.state = { user: props.user }
    }
    render() {
        console.log(Cookies.get('access_token') );
        console.log(this.state.user+"#logged-in" == Cookies.get('access_token'));
        if (Cookies.get('access_token') == this.state.user + "#logged-in") {
            return (
                <div>
                   <Router>
                <div className="quest-parent-wrapper">
                    <div className="questionnaireCreator-label">
                        <Link className="questionnaireCreator-label-text quest-nav-item" to="/questionnaireCreator"> Questionnaire Creator </Link>
                        <Link className= "questionnaireTaker-label-text quest-nav-item" to="/questionnaireTaker"> Questionnaire Taker </Link>
                    </div>
                        

                    {/*
                    A <Switch> looks through all its children <Route>
                    elements and renders the first one whose path
                    matches the current URL. Use a <Switch> any time
                    you have multiple routes, but you want only one
                    of them to render at a time
                    */}
                    <Switch>
                        <Route path="/questionnaireCreator">
                            <QuestionnaireCreator>  </QuestionnaireCreator>
                        </Route>
                        <Route path="/questionnaireTaker">
                            <QuestionnaireTaker>  </QuestionnaireTaker>
                        </Route>
                    </Switch>
                </div>
            </Router>
                </div>
            )
        } else {
            setTimeout(() => {
                this.history.push("/login")
            }, 1000)
            return (
              <div>
                  Redirecting to login
                  
              </div>
            )
        }
        
    }
}
