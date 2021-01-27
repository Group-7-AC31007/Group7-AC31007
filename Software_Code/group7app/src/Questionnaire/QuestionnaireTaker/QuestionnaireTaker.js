import React, { Component } from 'react'
import YesNoTaker from './Types/YesNoTaker'
import TextInputTaker from './Types/TextInputTaker';


export default class QuestionnaireTaker extends Component {
    render() {
        let YesNoTest = {"type":"YesNo","value":"this is a test question answer it please","display":true,"ID":6}
        let TextTest = {"type":"TextTest","value":"this is a test question answer it please","display":true,"ID":7}
        return (
            <div>
                <YesNoTaker question = {YesNoTest}>

                </YesNoTaker>
                <TextInputTaker question = {TextTest}>

                </TextInputTaker>

            </div>
        )
    }
}
