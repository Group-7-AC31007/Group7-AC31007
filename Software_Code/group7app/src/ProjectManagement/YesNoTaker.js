import React, { Component } from 'react'

export default class YesNoTaker extends Component {

    constructor(props) {
        super(props)
        this.state = props.question
        this.state.answer = null
        this.handler = props.handler
    }
    answerHandler(e) {
        let question = this.state
        question.answer = e.target.value
        this.handler()
    }
    render() {
        return (
            <div className="quest-taker-wrapper">
                <div className="quest-taker-question">
                    {this.state.questionText}
                </div>
                <div className="quest-taker-radio-wrapper" >
                    <form onChange={(e) => this.answerHandler(e)}>
                        <label htmlFor = "yes">
                            Yes
                            
                    </label>
                        <input type="radio" className="quest-taker-radio-yes" name="quest-taker-radio" value="yes" id="yes"  />
                        <label htmlFor = "no">
                            No
                    </label>
                        <input type="radio" className="quest-taker-radio-no" name="quest-taker-radio" value="no" id="no" />
                    </form>

                </div>
            </div>
        )
    }


}
