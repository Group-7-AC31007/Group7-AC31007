import React, { Component } from 'react'
// let obj = { type: this.state.selectValue, value: null, display: true, ID: questionsCopy.length }

export default class PredefinedList extends Component {
    constructor(props) {
        super(props)
        if (props.information.value !== null && props.information.value.responses == null) {
            props.information.value.responses = []
        }
        this.state = props.information
        this.questionHandler = props.handler        
        this.deleteHandler = props.deleteHandler
        // type,value,display,ID passed from the list of questions
    }
    handler(value) {
        let info = this.state
        info.value = { question: value, responses: info.value == null ? [] : info.value.responses }
        this.questionHandler(info)
    }
    deleteButtonHandler() {
        let info = this.state
        this.deleteHandler(info)
    }
    responseButtonHandler() {
        let info = this.state
        if (info.value === null) {
            info.value = { question: "", responses: [] }
        } else if (info.value.responses == null) {
            info.value = { question: info.value.question, responses: [] }
        }
        let obj = { id: info.value.responses.length, value: "" }
        info.value.responses.push(obj)
        this.questionHandler(info)
    }
    responsesHandler(e, current) {
        current.value = e.target.value
        let info = this.state
        for (let x = 0; x < info.value.responses.length; x++) {
            if (info.value.responses[x].id == current.id) {
                info.value.responses[x] = current
                break;
            }
        }
        this.questionHandler(info)
    }
    render() {
        let responses = (this.state.value != null && this.state.value.responses != null) ? this.state.value.responses.map((current) => (<li key={current.id} ><input onChange={(e) => this.responsesHandler(e, current)} className="quest-creator-predefinedList-response-textField" type="text" value={current.value} /> </li>)) : []
        return (
            <div className="quest-creator-predefinedList-wrapper questions">
                <hr/>
                
                <div className="quest-creator-predefinedList-question-wrapper">
                    <label className="quest-creator-predefinedList-question-label" htmlFor="quest-creator-predefinedList-question-textField"> Multiple Choice Question: </label>
                    <input className="quest-creator-predefinedList-question-textField" type="text" name="quest-creator-predefinedList-question-textField" value={this.state.value == null ? "" : this.state.value.question}
                        onChange={(e) => (this.handler(e.target.value))} />

                </div>
                <div className="quest-creator-predefinedList-responses-wrapper">
                    <button className="quest-creator-predefinedList-responses-button" onClick={() => this.responseButtonHandler()}>Add Option</button>
                    <div className="quest-creator-predefinedList-responses-responses">
                        <ul>
                            {responses}
                        </ul>
                    </div>
                </div>
                
                <button onClick={() => this.deleteButtonHandler()} type="button" className="quest-creator-predefinedList-question-delete-button delete-button">
                    Delete
                </button>
                
            </div>
        )
    }
}
