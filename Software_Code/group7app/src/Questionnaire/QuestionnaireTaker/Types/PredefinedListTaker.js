import React, { Component } from 'react'

export default class PredefinedListTaker extends Component {

    constructor(props) {
        super(props)
        this.state = props.question
        console.log(this.state);
        this.state.answer = null
        this.handler = props.handler
    }
    answerHandler(e) {
        let question = this.state
        question.answer = e.target.value
        this.handler()
    }
    render() {
        let responseList = this.state.responses.map((current,key)=> (<div key ={key}> <label htmlFor = {current.responseID}>{current.responseValue}</label><input type="radio" className={"quest-taker-radio-"+current.value} name="quest-taker-radio" value={current.responseValue} id={current.id}/>  </div>))
        return (
            <div className="quest-taker-wrapper">
                <div className="quest-taker-question">
                    {this.state.questionText}
                </div>
                <div className="quest-taker-radio-wrapper" >
                    <form onChange={(e) => this.answerHandler(e)}>
                       {responseList}
                    </form>

                </div>
            </div>
        )
    }


}
