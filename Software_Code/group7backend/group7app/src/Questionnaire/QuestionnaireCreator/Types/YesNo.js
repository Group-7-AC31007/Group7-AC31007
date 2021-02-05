import React, { Component } from 'react'
// let obj = { type: this.state.selectValue, value: null, display: true, ID: questionsCopy.length }

export default class YesNo extends Component {
    constructor(props) {
        super(props)
        this.state = props.information
        this.questionHandler = props.handler
        this.deleteHandler = props.deleteHandler
        // type,value,display,ID passed from the list of questions
    }
    handler(value) {
        let info = this.state
        info.value = value
        this.questionHandler(info)
    }
    deleteButtonHandler(e) {
        let info = this.state
        this.deleteHandler(info)
    }

    render() {
        return (
            <div className="quest-creator-yesNo-wrapper questions">
                <hr />

                <div className="quest-creator-yesNo-question-wrapper">
                    <label className="quest-creator-yesNo-question-label" htmlFor="quest-creator-yesNo-question-textField"> Yes/No Question: </label>
                    <input className="quest-creator-yesNo-question-textField" type="text" name="quest-creator-yesNo-question-textField" value={this.state.value == null ? "" : this.state.value}
                        onChange={(e) => (this.handler(e.target.value))} />

                </div>
                
                <button onClick={() => this.deleteButtonHandler()} type="button" className="quest-creator-yesNo-question-delete-button delete-button">
                    Delete
                </button>
            </div>
        )
    }
}
