import React, { Component } from 'react'
import YesNoTaker from './Types/YesNoTaker'

export default class QuestionnaireTaker extends Component {
    render() {
        let YesNoTest = {"type":"YesNo","value":"this is a test question answer it please","display":true,"ID":6}
        return (
            <div>
                <YesNoTaker question = {YesNoTest}>

                </YesNoTaker>
            </div>
        )
    }
}
