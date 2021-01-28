import React, { Component } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import './Questionnaire.css'

import QuestionnaireCreator from './QuestionnaireCreator/QuestionnaireCreator'

export default class Questionnaire extends Component {
    render() {
        return (
            <Router>
                <div className="quest-creator-parent-wrapper">
                    <div className="questionnaireCreator-label">
                        <Link className="questionnaireCreator-label-text" to="/questionnaireCreator"> Questionnaire Creator </Link>
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
                        <QuestionnaireCreator test="fhskftksldjfkls">  </QuestionnaireCreator>
                    </Route>
                    </Switch>
                </div>
            
            </Router>

        )
    }
}
