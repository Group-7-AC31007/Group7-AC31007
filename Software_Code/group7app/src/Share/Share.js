import React, { Component } from 'react'
import Cookies from 'js-cookie'
import QuestionnaireTaker from '../Questionnaire/QuestionnaireTaker/QuestionnaireTaker'
export default class Share extends Component {
    constructor(props) {
        super(props)
        this.history = props.history
        let params = new URLSearchParams(window.location.search)
        this.state = { user: props.user.user, id: props.user.id, position: props.user.position, shareID: params.get("id") }

    }
    componentDidMount(){

    }
    render() {
        console.log("share-redner",this.state);
        if(this.state.shareID==undefined){
            this.history.push("/")
            return(
                <div></div>
            )
        }
        if (this.state.user + "#" + this.state.id + "#" + this.state.position + "#logged-in" == Cookies.get('access_token')) {
            return (
                <div>
                    <QuestionnaireTaker history = {this.history} selected = {this.state.shareID} user = {{user: this.state.user, id: this.state.id, position: this.state.position}} >

                    </QuestionnaireTaker>
                </div>
            )
        } else {
            this.history.push(`/login?redirect=share?id=${this.state.shareID}`)
            return(
            <div>
            </div>
            )
        }

    }
}
