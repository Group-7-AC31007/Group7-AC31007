import React, { Component } from 'react'
import "./QuestionnaireCreator.css"
import YesNo from './Types/YesNo'
import TextInput from './Types/TextInput'
import PredefinedList from './Types/PredefinedList'

export default class QuestionnaireCreator extends Component {
    constructor(props) {
        super(props) /* Calls the parent constructor */
        console.log(props.test)
        this.test = props.test
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

    }
    questionChangeHandler(question) {
        let questionsCopy = this.state.questions
        for (let x = 0; x < questionsCopy.length; x++) {
            if (questionsCopy[x].ID === question.id) {
                questionsCopy[x] = question
                break;
            }
        }
        this.setState({questions:questionsCopy})
    }
    render() {

        let questionList = this.state.questions.map((current) => (current.type === "YesNo" ? (<YesNo key={current.ID} handler= {(q)=> this.questionChangeHandler(q)} information={current} ></YesNo>) : current.type === "TextInput" ? (<TextInput key={current.ID} handler= {(q)=> this.questionChangeHandler(q)} information={current}></TextInput>) : (<PredefinedList key={current.ID} handler= {(q)=> this.questionChangeHandler(q)} information={current}></PredefinedList>)))
        return (
                <div className="quest-creator-wrapper">
                    <i className="fa fa-address-book" style={{fontSize:"60px"}}></i>
                    <div className="quest-creator-research-wrapper">
                        <label className="quest-creator-research-label" htmlFor="quest-creator-research-dropdown"> Researches: </label>
                        <select className="quest-creator-research-dropdown" name="quest-creator-research-dropdown">
                            <option value="oneOption"> {this.test} </option>
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
                    {questionList}
                </div>
        )
    }
}
