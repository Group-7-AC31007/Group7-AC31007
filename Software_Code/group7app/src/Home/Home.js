import React, { Component } from 'react'
import './Home.css'
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.history = props.history

        this.state = { user: props.user.user, id: props.user.id, position: props.user.position };
    }
    render() {
        return (
            <div className="home-page-wrapper">
                <div className="home-page-square-two"> </div>
            </div>
        )
    }
}
