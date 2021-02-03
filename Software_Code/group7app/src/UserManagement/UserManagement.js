import React, { Component } from 'react'
import UserTable from './UserTable';
import Cookies from 'js-cookie'
export default class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.history = props.history
        this.state = { user: props.user.user, id: props.user.id, position: props.user.position, data: [] };
        this.getUsers()
    }

    getUsers() {
        console.log("getting-users");
        const reqOpts = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('http://localhost:3001/get_users', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "UNABLE TO GET USERS") {
                    console.log("NO SUCH USER");
                } else {
                    console.log(json);
                    this.setState({ data: json })
                    return json
                }
            });
        });
    }

    render() {
        console.log(Cookies.get('access_token'));
        console.log(this.state);
        if (this.state.user + "#" + this.state.id + "#" + this.state.position + "#logged-in" == Cookies.get('access_token')) {
        return (
            <div className="table-container">
                {!this.state.data.length ? null :  <UserTable regetUsers={()=>this.getUsers()} history={this.history} data={this.state.data}></UserTable>}
                
            </div>
        )
        }else{
            this.history.push("/")
            return (
                <div></div>
            )
        }
    }
}
