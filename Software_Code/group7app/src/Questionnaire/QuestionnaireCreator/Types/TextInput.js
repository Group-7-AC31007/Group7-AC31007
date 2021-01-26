import React, { Component } from 'react'
// let obj = { type: this.state.selectValue, value: null, display: true, ID: questionsCopy.length }

export default class TextInput extends Component {
    constructor(props) {
        super(props)
        this.state = props.information
        // type,value,display,ID passed from the list of questions
    }
    render() {
        return (
            <div className="quest-creator-textInput-wrapper">
                <div className="quest-creator-textInput-question-wrapper">
                    <label className="quest-creator-textInput-question-label" htmlFor="quest-creator-textInput-question-textField"> Question: </label>
                    <input className="quest-creator-textInput-question-textField" type="text" name="quest-creator-textInput-question-textField" value = {this.state.value==null ? "" : this.state.value}
                    onChange={(e) => {this.setState({value: e.target.value});console.log(e.target.value)}} />
                    
                </div>

            </div>
        )
    }
}
