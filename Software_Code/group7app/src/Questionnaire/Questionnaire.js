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
        this.state = { user: props.user.user, id: props.user.id, position: props.user.position }
    }
    render() {
        console.log(Cookies.get('access_token'));
        if (this.state.user + "#" + this.state.id + "#" + this.state.position + "#logged-in" == Cookies.get('access_token')) {


            return (
                <div className="quest-wrapper">
                    <Router>
                        <div className="quest-parent-wrapper">
                            <div className="questionnaireCreator-label">
                                {(this.state.position != undefined && this.state.position > 0) ?
                                    <Link className="questionnaireCreator-label-text quest-nav-item" to="/questionnaireCreator"> Questionnaire Creator </Link> : null
                                }
                                <Link className="questionnaireTaker-label-text quest-nav-item" to="/questionnaireTaker"> Questionnaire Taker </Link>
                            </div>


                            {/*
                    A <Switch> looks through all its children <Route>
                    elements and renders the first one whose path
                    matches the current URL. Use a <Switch> any time
                    you have multiple routes, but you want only one
                    of them to render at a time
                    */}
                            <Switch>
                                {(this.state.position != undefined && this.state.position > 0) ?
                                    (<Route path="/questionnaireCreator">
                                        <QuestionnaireCreator user={{ user: this.state.user, id: this.state.id, position: this.state.position }}>  </QuestionnaireCreator>
                                    </Route>) : null}
                                <Route path="/questionnaireTaker">
                                    <QuestionnaireTaker user={{ user: this.state.user, id: this.state.id, position: this.state.position }} history={this.history}>  </QuestionnaireTaker>
                                </Route>
                            </Switch>
                        </div>
                    </Router>
                </div>
            )
        } else {

            this.history.push("/login")

            return (
                <div className="redirecting_to_login_wrapper">
                    <div className="redirecting_to_login">
                        <p>Redirecting to login</p>
                    </div>
                </div>
            )
        }
    }
}

