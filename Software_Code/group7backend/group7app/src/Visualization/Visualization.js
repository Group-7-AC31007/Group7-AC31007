
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Bar } from 'react-chartjs-2';
import './Visualization.css'
import Cookies from 'js-cookie'


const testData = {
    labels: ['answer 1', 'answer 2', 'answer 3',
        'answer 4', 'answer 5'],
    datasets: [
        {
            label: 'Question1',
            backgroundColor: 'rgba(196,235,208,1)',
            barThickness: 50,
            maxBarThickness: 100,
            maxBarLength: 100,
            minBarLength: 0,
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [65, 59, 80, 81, 56]
        }
    ]
}

export default class Visualization extends Component {
    constructor(props) {
        super(props)
        this.state = { data: [], question: 0, questionnaireList: [] ,user: props.user.user, id: props.user.id, position: props.user.position}
        this.history = props.history
        this.GetQuizListHandler()
    }
    NextButton(ch) {
        console.log(" This is the ch ")
        console.log(this.state.data.length)
        console.log(ch)
        if (ch < this.state.data.length - 1) {
            ch++;
            console.log(" if Part ")
            this.setState({ question: ch })
        }
        else {
            console.log(" Else part ")
            this.setState({ question: 0 })
        }
        console.log(this.state.data)
        console.log(this.state.data[1])

    }
    PrevButton(ch) {
        console.log(" This is the ch ")
        console.log(this.state.data.length)
        console.log(ch)
        if (ch <= 0) {
            ch = this.state.data.length - 1
            this.setState({ question: ch })
        }
        else {
            ch--
            this.setState({ question: ch })
        }
        console.log(this.state.data)
        console.log(this.state.data[1])
    }

    GetQuizListHandler() {
        let cookie = Cookies.get('access_token')
        if (!cookie) {
            return
        }
        let patt = /#\d+#/i
        let matchResult1 = cookie.match(patt)
        let patt2 = /\d+/i
        let matchResult2 = matchResult1[0].match(patt2)
        let userID = matchResult2[0]
        console.log("userID");
        console.log(userID);
        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userID })

        }
        fetch('/api/get_user_quiz_list', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST OF QUESTIONNAIRES") {
                    alert('Could not get list of questionnaires!');
                    console.log(json);
                    console.log(response);
                } else {
                    console.log(json)
                    let questionnaireList = json;
                    this.setState({ questionnaireList }, () => this.QVisualizerHandler(json[0].questionnairesID))
                }

                console.log("pog");
            });
        });
    }

    QVisualizerHandler(questionnaireID) {
        console.log(questionnaireID);
        let questionnairesID = questionnaireID /*remove after being able to choose questionnaire*/
        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionnairesID })
        }
        fetch('/api/get_qvisualization', reqOpts).then(response => {
            response.json().then(json => {
                if (json == "COULD NOT GET LIST FOR CHARTS") {
                    alert('Could not get list for charts!');
                    // console.log(json);
                } else {
                    // console.log(json)
                    let chartData = json;
                    console.log(chartData);
                    let uniqDat = {}
                    chartData.forEach(element => {
                        if (element.questionID in uniqDat) {
                            uniqDat[element.questionID].push(element)
                        } else {
                            uniqDat[element.questionID] = [element]
                        }
                    });
                    let result = []
                    // console.log(uniqDat);
                    let keys = Object.keys(uniqDat)
                    // console.log(keys);
                    // for each question
                    for (let x in keys) {
                        let curQuestion = uniqDat[keys[x]]
                        // console.log("new question");
                        // console.log(curQuestion);
                        let answers = []
                        //for each answer
                        for (let y in Object.keys(curQuestion)) {
                            //console.log(curQuestion[Object.keys(curQuestion)[y]]);
                            let curAnswer = curQuestion[Object.keys(curQuestion)[y]]
                            if (!answers.includes(curAnswer.text_answer)) {
                                answers.push(curAnswer.text_answer)
                            }
                        }
                        let answersCount = [...answers].map((cur) => {
                            return {
                                text: cur, count: 0
                            }
                        })
                        for (let y in Object.keys(curQuestion)) {
                            let curAnswer = curQuestion[Object.keys(curQuestion)[y]]
                            if (answers.includes(curAnswer.text_answer)) {
                                answersCount[answers.indexOf(curAnswer.text_answer)].count++
                            }
                        }
                        // console.log("--- answers");
                        // console.log(answersCount);
                        console.log(curQuestion);
                        result.push({ questionnairesID: questionnairesID, questionnaireName: json[0].questionnairesName, answers: answersCount, questionText: curQuestion[0].questionText })
                    }
                    console.log("result");
                    console.log(result);
                    let arrayOfQuestionData = []
                    for (let x in result) {
                        let labels = result[x].answers.map((cur) => {
                            return (!(cur.text) ? "Empty Response" : cur.text)
                        })
                        let data = result[x].answers.map((cur) => {
                            return (cur.count)
                        })
                        let curData = {
                            labels: labels,
                            datasets: [
                                {
                                    label: result[x].questionText,
                                    backgroundColor: 'rgba( 70,70,70,0.5)',
                                    data: data,
                                    borderWidth: 2,
                                    borderColor: 'rgb( 70,70,70)'
                                }
                            ],

                        }
                        arrayOfQuestionData.push(curData)
                    }
                    console.log(arrayOfQuestionData);
                    this.setState({ data: arrayOfQuestionData, question: 0 })
                }
            });
        });
    }

    render() {
        if (this.state.user + "#" + this.state.id + "#" + this.state.position + "#logged-in" == Cookies.get('access_token')) {
            let qlist = this.state.questionnaireList.map((cur) => {
                return <option value={cur.questionnairesID}>
                    {cur.QuestionnaireName}
                </option>

            })

            let options = {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
                maintainAspectRatio: true,
                responsive: true,

                layout: {
                    padding: {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    }
                },
            }
            if (this.state.data.length) {
                console.log(this.state);
                return (
                    <div className="chart-wrapper">
                        <label className="choose-questionnaire">Choose a Questionnaire:</label>
                        <select className="questionnaire-options" name="Questionnaire" id="Questionnaire" onChange={(e) => this.QVisualizerHandler(e.target.value)}>
                            {qlist}
                        </select>
                        <hr className="bar-chart-lines" />


                        {console.log(this.state.question)}

                        <Bar
                            data={this.state.data[this.state.question]}
                            /*height={500}
                            width={500} */
                            options={options}
                        />
                        <hr className="bar-chart-lines" />
                        <div className="clear"> </div>
                        <button className=" next-button " onClick={() => this.NextButton(this.state.question)}> <i class="fa fa-long-arrow-right" aria-hidden="true"></i> </button>
                        <button className=" prev-button " onClick={() => this.PrevButton(this.state.question)}> <i class="fa fa-long-arrow-left" aria-hidden="true"></i> </button>
                        <hr></hr>

                    </div >
                )
            } else {
                return (

                    <div></div>
                )
            }
        } else {
            this.history.push("/login")

            return (
                <div className="redirecting_to_login_wrapper">
                    <div className="redirecting_to_login">
                        <p>Redirecting to login</p>
                    </div>
                </div>
            )
        }
    }
}
