import React, { Component } from 'react'
import YesNoTaker from './YesNoTaker'
import TextInputTaker from './TextInputTaker';
import PredefinedListTaker from './PredefinedListTaker';
import Cookies from 'js-cookie'
export default class ProjectManagement extends Component {
    constructor(props) {
        super(props)
        this.history = props.history
        this.state = { questions: [], user: props.user.user, id: props.user.id }

    }
    componentDidMount() {
        this.setState({ questionnaires: this.questionnaireListHandler() })
    }
    // This method gets the specific projects tied to this user ID
    getProjectAccessList() {
        let usersID = 10

        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usersID })
        }

        fetch('http://localhost:3001/get_project_access_list', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF PROJECTS") {
                    alert('Could not get list of projects!');
                    console.log(json);
                } else {
                    console.log(json)
                    let projectjson = json;
                    let projectID  = projectjson.map((cur)=> 
                    {
                        return cur.projectsID
                    })
                    console.log(projectID)
                    console.log(projectjson[0].projectsID)
                    console.log(projectjson);
                }
            });
        });
    }
    questionnaireListHandler() {

        let usersID = this.state.id
        if (!usersID) {
            return
        }
        console.log(usersID);
        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usersID })
        }
        fetch('http://localhost:3001/get_quiz_list', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF QUESTIONNAIRES") {
                    alert('Could not get list of questionnaires!');
                    console.log(json);
                } else {
                    console.log(json)
                    let questionnaireList = json;
                    console.log(questionnaireList);
                    this.setState({ questionnaires: json })
                }
            });
        });
    console.log(" state ")
    console.log(this.state.id)

    }
    questionListHandler(questionnairesID) {
        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionnairesID })
        }
        fetch('http://localhost:3001/get_quiz', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF QUESTIONNAIRES") {
                    alert('Could not get list of questionnaires!');
                    console.log(json);
                    this.setState({ questions: [] })
                } else {
                    console.log(json)
                    let questionsList = json;
                    console.log(questionsList);
                    this.setState({ questions: json })
                }
            });
        });
    }
    answerHandler() {
        let questionsCopy = this.state.questions
        this.setState({ questions: questionsCopy })
    }
    submitHandler() {
        console.log(this.state.questions);
        // ${questionID}, ${userID}, ${answer});
        let questions = this.state.questions.map((cur) => { return { id: cur.questionID, answer: !cur.answer ? "" : cur.answer } })
        let submitJson = { userID: this.state.id, questions: questions }

        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(submitJson)
        }
        fetch('http://localhost:3001/complete_quiz', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT SEND COMPLETION") {
                    alert('Could not send completed quiz!');
                    console.log(json);
                } else {
                    alert('Questionnaire Submitted!')
                    this.history.push("/")
                    console.log(json)
                }
            });
        });


    }
    render() {
        console.log(this.state.questionnaires);
        let questionOptions = !this.state.questionnaires ? [] : this.state.questionnaires.map((current, index) =>
            (<option key={index} value={current.questionnairesID}>{current.questionnairesName}</option>)
        )
        console.log(this.state.questions);
        let questionList = this.state.questions.map((current, key) =>
        (current.type === "YesNo" ? (<YesNoTaker key={key} handler={() => this.answerHandler()} question={current}></YesNoTaker>) :
            current.type === "TextInput" ? (<TextInputTaker key={key} handler={() => this.answerHandler()} question={current}></TextInputTaker>) :
                (<PredefinedListTaker key={key} handler={() => this.answerHandler()} question={current}></PredefinedListTaker>)))
        return (
            <div className="quest-taker-main-wrapper" >
                <select onClick={() => {this.getProjectAccessList()}}>
                    <option disabled selected value> -- select an option -- </option>
                    {questionOptions}
                </select>
                { questionList}
                {
                    this.state.questions.length > 0 ?
                        (<button onClick={() => this.submitHandler()}>
                            Submit
                        </button>) : null
                }
            </div >
        )
    }
}
