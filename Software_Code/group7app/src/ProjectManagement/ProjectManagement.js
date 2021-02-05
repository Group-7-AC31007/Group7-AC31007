import React, { Component } from 'react'
import YesNoTaker from './YesNoTaker'
import TextInputTaker from './TextInputTaker';
import PredefinedListTaker from './PredefinedListTaker';
import Cookies from 'js-cookie'
export default class ProjectManagement extends Component {
    constructor(props) {
        super(props)
        this.history = props.history
        this.state = { questions: [], user: props.user.user, id: props.user.id, pid: [],position: props.user.position}
        this.getProjectAccessList() 

    }
    // This method gets the specific projects tied to this user ID
    getProjectAccessList() {
        let usersID = this.state.id
        let tempcheck = " "

        if (this.state.position == 2) {
            tempcheck = "get_lab_project"
            
        }
        else
        {
            tempcheck = "get_project_access_list"
        }
        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usersID })
        }

        fetch( `http://localhost:3001/${tempcheck}`, reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF PROJECTS") {
                    alert('Could not get list of projects!');
                    console.log(json);
                } else {
                    // console.log(json)
                    let projectjson = json;
                    let projectID = projectjson.map((cur) => {
                        return cur.projectsID
                    })
                    console.log(projectID);
                    this.setState({ pid: projectID })
                    // console.log(projectID)
                    // console.log(projectjson[0].projectsID)
                    // console.log(projectjson);
                }
            });
        });
    }

    tablemaker(rID)
    {


        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rID })
        }

        fetch( 'http://localhost:3001/get_project_users', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF PROJECTS") {
                    alert('Could not get list of projects!');
                    console.log(json);
                } else {
                    // console.log(json)
                    let projectjson = json;
                    let projectID = projectjson.map((cur) => {
                        return cur.projectsID
                    })
                    // console.log(projectID);
                    console.log(" Reached ")
                }
            });
        });
    
    }
    render() {
        console.log(this.state.pid)
        let vstate = this.state.pid.map((cur) => {
            return <option value={cur} selected={this.tablemaker(cur)}>
                {console.log("cur is")}
                {console.log(cur)}
                {cur}
            </option>
        })
        return (
            <div className="quest-taker-main-wrapper" >
                <select  >
                    <option disabled selected value> -- select a research -- </option>
                    {vstate}
                </select>
            </div >
        )
    }
}
