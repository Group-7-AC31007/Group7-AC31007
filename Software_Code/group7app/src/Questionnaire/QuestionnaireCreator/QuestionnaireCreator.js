import React, { Component } from 'react'
import "./QuestionnaireCreator.css"
import YesNo from './Types/YesNo'
import TextInput from './Types/TextInput'
import PredefinedList from './Types/PredefinedList'

export default class QuestionnaireCreator extends Component {
    constructor(props) {
        super(props) /* Calls the parent constructor */
        this.questions = []
        this.state = { selectValue: "PredefinedList", questions: [] }

    }

    createButtonHandler() {
        let questionsCopy = this.state.questions
        let obj = { type: this.state.selectValue, value: null, display: true, ID: questionsCopy.length }

        questionsCopy.push(obj)
        this.setState({ questions: questionsCopy })
        // This.state is how we hold the information about a component
        // questions:questions changing the object field questions to the value questions 
        console.log(this.state.questions)
        // We are assigning an object in this method 
        console.log(JSON.stringify(this.state.questions));

    }

    submitButtonHandler() {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(this.state.questions)
		}
		console.log(this.state.questions);
		fetch('http://localhost:3001/create_quiz', reqOpts).then(response => {
			response.json().then(json => {
				if (json == "COULD NOT CREATE QUESTIONNAIRE") {
					alert('Could not create questionnaire!');
					console.log("COULD NOT CREATE QUESTIONNAIRE");
				} else {
					alert('Questionnaire successfully created!');
					console.log("QUESTIONNAIRE SUCCESSFULLY CREATED")
				}
			});
		});
    }

    deleteButtonHandler(question) {
        let questionsCopy = this.state.questions
        console.log(question)
        for (let x = 0; x < questionsCopy.length; x++) {
            if (questionsCopy[x].ID === question.ID) {
                questionsCopy.splice(x, 1)
                console.log(questionsCopy)
                break;
            }
        }
        for (let x = 0; x < questionsCopy.length; x++) {
            questionsCopy[x].ID = x
        }
        this.setState({ questions: questionsCopy })
    }
    questionChangeHandler() {
        let questionsCopy = this.state.questions
        this.setState({ questions: questionsCopy })
    }
    render() {

        let questionList = this.state.questions.map((current) =>
        (current.type === "YesNo" ? (<YesNo key={current.ID} handler={(q) => this.questionChangeHandler(q)} deleteHandler={(q) => this.deleteButtonHandler(q)} information={current} ></YesNo>) :
            current.type === "TextInput" ? (<TextInput key={current.ID} handler={(q) => this.questionChangeHandler(q)} deleteHandler={(q) => this.deleteButtonHandler(q)} information={current}></TextInput>) :
                (<PredefinedList key={current.ID} handler={(q) => this.questionChangeHandler(q)} deleteHandler={(q) => this.deleteButtonHandler(q)} information={current}></PredefinedList>)))
        return (
            <div>
                <div className="quest-creator-wrapper">
                    <div className="quest-creator-research-wrapper">
                        <label className="quest-creator-research-label" htmlFor="quest-creator-research-dropdown"> Researches: </label>
                        <select className="quest-creator-research-dropdown" name="quest-creator-research-dropdown">
                            <option value="oneOption"> Research1 </option>
                            <option value="oneOption"> Research2 </option>
                            {/* Link to already existing researches drom db */}
                        </select>
                    </div>
                    <div className="quest-creator-name-wrapper">
                        <label className="quest-creator-name-label" htmlFor="quest-creator-name-value"> Name of questionnaire: </label>
                        <input className="quest-creator-name-value" type="text" name="quest-creator-name-value" />
                    </div>

                    <button onClick={() => this.createButtonHandler()} type="button" className="quest-creator-newQuestion-button"> New Question </button>

                    <label className="quest-creator-type-label" htmlFor="quest-creator-type-dropdown"> </label>
                    <select value={this.state.selectValue} onChange={(e) => { this.setState({ selectValue: e.target.value }); console.log(e.target.value) }} className="quest-creator-type-dropdown" name="quest-creator-type-dropdown">
                        <option value="PredefinedList"> Predefined List </option>
                        <option value="TextInput"> Text Input </option>
                        <option value="YesNo"> Yes/No </option>
                    </select>
                    <div>
                        <button onClick={() => this.submitButtonHandler()} type="button" className="quest-creator-submitQuestionnaire-button"> Submit Questionnaire </button>
                    </div>
                    {questionList}
                </div>
            </div>
        )
    }
}
