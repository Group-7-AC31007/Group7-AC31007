import React, { Component } from 'react'
import "./QuestionnaireCreator.css"

export default class QuestionnaireCreator extends Component {
    constructor(props) {
        super(props) /* Calls the parent constructor */
        console.log(props.test)
        this.test = props.test
        this.questions = []
        this.setState({selectValue:"PredefinedList",questions:[]})

    }

    createButtonHandler() {

    }

    handleChange(e) {
        this.setState({selectValue:e.target.value});
        console.log(this.state.selectValue)
    }

    render() {
        return (
            <div>
                <div className="quest-creator-wrapper">
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

                    <button type="button" className="quest-creator-newQuestion-button"> New Question </button>

                    <label className="quest-creator-type-label" htmlFor="quest-creator-type-dropdown"> </label>
                    <select value={this.state.selectValue} onChange={this.handleChange} className="quest-creator-type-dropdown" name="quest-creator-type-dropdown">
                        <option value="PredefinedList"> Predefined List </option>
                        <option value="TextInput"> Text Input </option>
                        <option value="YesNo"> Yes/No </option>
                    </select>
                </div>
            </div>
        )
    }
}
