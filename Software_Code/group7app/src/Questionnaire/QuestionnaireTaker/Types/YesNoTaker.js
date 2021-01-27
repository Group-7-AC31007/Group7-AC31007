import React, { Component } from 'react'

export default class YesNoTaker extends Component {

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
                <div className="quest-taker-radio-wrapper" >
                    <form onChange = {(e)=> this.setState({answer:e.target.value})}>
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
