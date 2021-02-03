import React, { Component } from 'react'
import './refresh.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
export default class Refresh extends Component {
    constructor(props) {
        super(props)
        let params = new URLSearchParams(window.location.search)
        this.state = {
            history: props.history,
            next: (params.get('next') == null) ? "" : params.get('next'),
            timer: (params.get('timer') == null) ? 500 : parseInt(params.get('timer')),
            message: (params.get('message') == null) ? "" : params.get('message')
        }
    }
    componentWillUnmount() {
        var id = window.setTimeout(function () { }, 0);

        while (id--) {
            window.clearTimeout(id); // will do nothing if no timeout with id is present
        }
    }
    componentDidMount() {
        setTimeout(() => {
            console.log("pushing");
            this.state.history.push("/" + this.state.next)
        }, this.state.timer);
    }
    render() {
        console.log(this.state);

        return (
            <div className="redirectWrapper">
                <div className="redirectContainer">
                    <h1>
                        {this.state.message == "" ? "Redirecting ..." : this.state.message}
                    </h1> 

                    <Loader color="#4365e2" width={150} height={150} type="Oval" />
                </div>
            </div>
        )
    }
}
