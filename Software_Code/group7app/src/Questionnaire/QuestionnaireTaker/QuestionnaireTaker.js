import React, { Component } from 'react'
import YesNoTaker from './Types/YesNoTaker'
import TextInputTaker from './Types/TextInputTaker';
import PredefinedListTaker from './Types/PredefinedListTaker';
import Cookies from 'js-cookie'
import "./QuestionnaireTaker.css";


export default class QuestionnaireTaker extends Component {
    constructor(props) {
        super(props)
        this.history = props.history
        this.state = { questions: [], user: props.user.user, id: props.user.id, position: props.user.position, selected: props.selected == undefined ? -1 : parseInt(props.selected) }

    }
    componentDidMount() {
        this.setState({ questionnaires: this.questionnaireListHandler() })
    }
    projectListHandler() {
        let userID = 0

        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID })
        }

        fetch('http://localhost:3001/get_project_list', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF PROJECTS") {
                    alert('Could not get list of projects!');
                    console.log(json);
                } else {
                    console.log(json)
                    let projectID = json;
                    console.log(projectID);
                }
            });
        });
    }
    questionnaireListHandler() {
        console.log(this.state);
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
                    this.setState({ questionnaires: json }, () => {
                        if (json.map((cur) => { return cur.questionnairesID }).includes(this.state.selected)) {
                            this.questionListHandler(this.state.selected)
                        };
                    })
                }
            });
        });
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
                    // alert('Questionnaire Submitted!')
                    this.history.push(`/refresh?timer=3000&message=Questionnaire Submitted : ${this.state.questionnaires[this.state.questionnaires.map((cur) => { return cur.questionnairesID }).indexOf(this.state.selected)].questionnairesName}`)
                    console.log(json)
                }
            });
        });


    }
    render() {
        if (this.state.user + "#" + this.state.id + "#" + this.state.position + "#logged-in" == Cookies.get('access_token')) {

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
                    {this.state.selected == -1 ? (<select className="quest-taker-choose-quest" onChange={(e) => { this.questionListHandler(e.target.value) }}> {/* if we are using a preselected don't render the selector */}
                        <option disabled selected value> -- select an option -- </option>
                        {questionOptions}
             <div className="quest-creator-icons-wrapper">
                    <i className="fa fa-book" style={{ fontSize: "60px" }}></i>
                    <i className="fa fa-laptop" style={{ fontSize: "60px" }}></i>
                    <i className="fa fa-file-text" style={{ fontSize: "60px" }}></i>
                </div>
                    </select>) : (!this.state.questions.length) ? (<div> There is no questionniare with the id {this.state.selected} or you do not have access to it</div>) :
                            (<div>{this.state.questionnaires[this.state.questionnaires.map((cur) => { return cur.questionnairesID }).indexOf(this.state.selected)].questionnairesName} </div>)}


                    {questionList}
                    {
                        this.state.questions.length > 0 ?
                            (<button onClick={() => this.submitHandler()}>
                                Submit
                            </button>) : null
                    }
                </div >
            )
        } else {
            console.log("test, didn't get in");
            this.history.push("/login")
            return(
                <div></div>
            )
        }
    }
}
