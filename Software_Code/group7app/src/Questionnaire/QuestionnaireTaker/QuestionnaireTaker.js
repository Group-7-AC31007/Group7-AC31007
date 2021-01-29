import React, { Component } from 'react'
import YesNoTaker from './Types/YesNoTaker'
import TextInputTaker from './Types/TextInputTaker';
import PredefinedListTaker from './Types/PredefinedListTaker';

import "./QuestionnaireTaker.css";


export default class QuestionnaireTaker extends Component {
    constructor(props) {
        super(props)
        let questions = [{ "type": "PredefinedList", "value": { "question": "list of responses", "responses": [{ "ID": 0, "value": "num1" }, { "ID": 1, "value": "num2" }, { "ID": 2, "value": "num3" }] }, "display": true, "ID": 0 }, { "type": "TextInput", "value": "enter some text", "display": true, "ID": 1 }, { "type": "TextInput", "value": "enter more text", "display": true, "ID": 2 }, { "type": "YesNo", "value": "Pick yes/no", "display": true, "ID": 3 }, { "type": "YesNo", "value": "pick more yes/no", "display": true, "ID": 4 }, { "type": "PredefinedList", "value": { "question": "more lists", "responses": [{ "ID": 0, "value": "num1" }, { "ID": 1, "value": "num2" }, { "ID": 2, "value": "num3" }] }, "display": true, "ID": 5 }]
        this.state = { questions: questions }
    }
      // projectListHandler() {


    //     const reqOpts = {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(/{userID}/)
    //     }

    //     fetch('http://localhost:3001/create_quiz', reqOpts).then(response => {
    //         response.json().then(json => {
    //             if (json == "COULD NOT CREATE QUESTIONNAIRE") {
    //                 alert('Could not create questionnaire!');
    //                 console.log(json);
    //             } else {
    //                 alert('Questionnaire successfully created!');
    //                 console.log(json)
    //             }
    //         });
    //     });
    // }
    questionnaireListHandler() {


        const reqOpts = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify(/{ projectID }/)
        }
        fetch('http://localhost:3001/get_quiz_list', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF QUESTIONNAIRES") {
                    alert('Could not get list of questionnaires!');
                    console.log(json);
                } else {
                    console.log(json)
                    let questionnaireList = json;
                    console.log(questionnaireList);
                }
            });
        });
    }
    // questionListHandler() {
    //     const reqOpts = {
    //         method: 'GET',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(/{ QuestionnaireID }*/)
    //     }
    // }
    answerHandler() {
        let questionsCopy = this.state.questions
        this.setState({questions:questionsCopy})
    }
    render() {
        let questionList = this.state.questions.map((current,key) => 
        (current.type === "YesNo" ? (<YesNoTaker key = {key} handler = {()=>this.answerHandler()} question={current}></YesNoTaker>) : 
        current.type === "TextInput" ? (<TextInputTaker key = {key} handler = {()=>this.answerHandler()} question={current}></TextInputTaker>) : 
        (<PredefinedListTaker key = {key} handler = {()=>this.answerHandler()} question ={current}></PredefinedListTaker>)))
        return (
            <div className="quest-taker-main-wrapper">
                {questionList}
                {/* <button className="submit-answer-button" onClick={() => console.log(JSON.stringify(this.state.questions))}>Submit</button> */}
                <button className="submit-answer-button" onClick={() => /*console.log(JSON.stringify(this.state.questions)) + */this.questionnaireListHandler()}>Submit</button>

            </div>
        )
    }
}
