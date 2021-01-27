import React, { Component } from 'react'

export default class TextInputTaker extends Component {

    constructor(props) {
        super(props)
        this.state = props.question
        this.state.answer = null

    }
    render() {
        return (
            <div className="quest-taker-wrapper">
                <div className="quest-taker-question">
                    {this.state.value}
                </div>
                <div className="quest-taker-text-wrapper" >
                    <form onChange={(e) => (this.setState({ answer: e.target.value }))}>
                        <label htmlFor = "text">
                            Answer:
                        </label>
                        <input className="quest-taker-text-input" type="text" name="quest-creator-text-input" id="text"/>

                    </form>

                </div>
            </div>
        )
    }


}