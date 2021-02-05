import React, { Component } from 'react'
import "./QuestionnaireCreator.css"
import YesNo from './Types/YesNo'
import TextInput from './Types/TextInput'
import PredefinedList from './Types/PredefinedList'
import Cookies from 'js-cookie'

export default class QuestionnaireCreator extends Component {
    constructor(props) {
        super(props) /* Calls the parent constructor */
        this.questions = []
        this.state = { projectList: [], selectValue: "PredefinedList", questions: [], submitError: false, user: props.user.user, id: props.user.id, position: props.user.position }

    }

    getProjectList() {
        let cookie = Cookies.get('access_token')
        let patt = /#\d+#/i
        let matchResult1 = cookie.match(patt)
        let patt2 = /\d+/i
        let matchResult2 = matchResult1[0].match(patt2)
        let userID = matchResult2[0]

        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID })

        }
        fetch('/api/get_user_project_list', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF PROJECTS") {
                    alert('Could not get list of projects!');
                    console.log(json);
                    console.log(response);
                } else {
                    console.log(json)
                    let projectsList = json;
                    this.setState({ projectList: projectsList })
                    console.log(projectsList);
                    console.log(this.state.projectList);

                }

                console.log("pog");
            });
        });


    }

    createButtonHandler() {
        let questionsCopy = this.state.questions

        let ID_listnotempty = questionsCopy.length ? questionsCopy[questionsCopy.length - 1].id + 1 : 0 // increment safely           
        let obj = {
            type: this.state.selectValue, value: null, display: true,
            id: ID_listnotempty
        } // increment id for key prop // ter

        questionsCopy.push(obj)
        this.setState({ questions: questionsCopy })
        // This.state is how we hold the information about a component
        // questions:questions changing the object field questions to the value questions 
        console.log(this.state.questions)
        // We are assigning an object in this method 
        console.log(JSON.stringify(this.state.questions));

    }


    submitButtonHandler() {
        //handle quiz is not complete
        let hasError = false
        if (!this.state.pID) {
            alert("You have not selected a project!")
            return
        }
        if (!this.state.questions.length) {
            hasError = true
        }
        for (let x in this.state.questions) {
            if (this.state.questions[x].type != "PredefinedList") {
                if (!this.state.questions[x].value || this.state.questions[x].value == "") {
                    console.log("empty question", this.state.questions[x]);
                    hasError = true
                }
            } else {
                console.log(this.state.questions[x]);
                if (!this.state.questions[x].value || !this.state.questions[x].value.question || this.state.questions[x].value.question == "") {
                    console.log("empty question", this.state.questions[x]);
                    hasError = true
                } else {
                }

                if (!!this.state.questions[x].value && this.state.questions[x].value.responses.length) {
                    for (let y in this.state.questions[x].value.responses) {
                        if (!this.state.questions[x].value.responses[y].value || this.state.questions[x].value.responses[y].value.trim() == "") {
                            hasError = true
                        }
                    }
                } else {
                    hasError = true
                }
            }
        }

        // is complete we can continue 

        this.setState({ submitError: hasError })
        if (hasError) {
            return
        }
        let questionsCopyNormalised = this.state.questions.map((cur, ind) => { cur.id = ind; return cur })// return a copy of the state with index's normalisd
        let result = { researcherID: this.state.id, projectID: this.state.pID, questions: questionsCopyNormalised, host: "https://localhost:3000" } // prepare json for sending with questionnaire & project ID 
        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        }
        console.log(result);
        fetch('/api/create_quiz', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT CREATE QUESTIONNAIRE") {
                    alert('Could not create questionnaire!');
                    console.log(json);
                } else {
                    alert('Questionnaire successfully created!');
                    console.log(json)
                }
            });
        });
    }

    deleteButtonHandler(question) {
        let questionsCopy = this.state.questions
        console.log(question)
        for (let x = 0; x < questionsCopy.length; x++) {
            if (questionsCopy[x].id === question.id) {
                questionsCopy.splice(x, 1)
                break;
            }
        }
        for (let x = 0; x < questionsCopy.length; x++) {
            questionsCopy[x].id = x
        }
        this.setState({ questions: questionsCopy })
    }
    questionChangeHandler() {
        let questionsCopy = this.state.questions
        this.setState({ questions: questionsCopy })
    }
    render() {
        let plist = this.state.projectList.map((cur) => {
            return <option value={cur.projectsID}>
                {cur.title}
            </option>

        })
        let createProps = (cur) => {
            return {
                handler: (q) => this.questionChangeHandler(q),
                deleteHandler: (q) => this.deleteButtonHandler(q),
                key: cur.id,
                information: cur,
            }
        }
        let questionList = this.state.questions.map((current) =>
        (current.type === "YesNo" ? (<YesNo {...createProps(current)}></YesNo>) :
            current.type === "TextInput" ? (<TextInput {...createProps(current)}></TextInput>) :
                (<PredefinedList {...createProps(current)}></PredefinedList>)))
        console.log(this.state.questions)
        return (
            <div className="quest-creator-wrapper">
                <div className="quest-creator-icons-wrapper">
                    <i className="fa fa-book" style={{ fontSize: "60px" }}></i>
                    <i className="fa fa-laptop" style={{ fontSize: "60px" }}></i>
                    <i className="fa fa-file-text" style={{ fontSize: "60px" }}></i>
                </div>
                {this.state.submitError == true ? <div className="quest-creator-error">
                    Errors Below Please ammend
                    </div> : null}
                <div className="quest-creator-project-wrapper">
                    <label className="quest-creator-project-label" htmlFor="quest-creator-project-dropdown"> Projects: </label>
                    <select onClick={() => this.getProjectList()} onChange={(e) => this.setState({ pID: e.target.value })} className="quest-creator-project-dropdown" name="quest-creator-project-dropdown">
                        <option disabled selected value>Please select a project</option>
                        {plist}
                        {/* Link to already existing projects drom db */}
                    </select>
                </div>
                <div className="quest-creator-name-wrapper">
                    <label className="quest-creator-name-label" htmlFor="quest-creator-name-value"> Name of questionnaire: </label>
                    <input className="quest-creator-name-value" type="text" name="quest-creator-name-value" />
                </div>

                <div className="quest-creator-type-wrapper">
                    <hr />
                    <label className="quest-creator-type-label" htmlFor="quest-creator-type-dropdown"> Type of question: </label>
                    <select value={this.state.selectValue} onChange={(e) => { this.setState({ selectValue: e.target.value }); console.log(e.target.value) }} className="quest-creator-type-dropdown" name="quest-creator-type-dropdown">
                        <option value="PredefinedList"> Predefined List </option>
                        <option value="TextInput"> Text Input </option>
                        <option value="YesNo"> Yes/No </option>
                    </select>
                </div>

                <button onClick={() => this.createButtonHandler()} type="button" className="quest-creator-newQuestion-button button"> New Question </button>
                {questionList}
                <div>
                    <hr></hr>
                    <button onClick={() => this.submitButtonHandler()} type="button" className="quest-creator-submitQuestionnaire-button"> Submit Questionnaire </button>
                </div>
            </div>



        )
    }
}
