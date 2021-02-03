import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

const testData = {
    labels: ['answer 1', 'answer 2', 'answer 3',
        'answer 4', 'answer 5'],
    datasets: [
        {
            label: 'Question1',
            backgroundColor: 'rgba(75,192,192,1)',
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
        this.state = { data: [],question:0 }

    }
    NextButton(ch)
    {
        console.log(" This is the ch ")
        console.log(this.state.data.length)
        console.log(ch)
        if(ch<this.state.data.length-1)
        {
        ch++;
        console.log(" if Part ")
        this.setState({question:ch})
        }
        else
        {
            console.log(" Else part ")
            this.setState({question:0})
        }
        console.log(this.state.data)
        console.log(this.state.data[1])

    }
    PrevButton(ch)
    {
        console.log(" This is the ch ")
        console.log(this.state.data.length)
        console.log(ch)
        if(ch<=0)
        {
        ch = this.state.data.length-1
        this.setState({question:ch})
        }
        else
        {
            ch--
            this.setState({question:ch})
        }
        console.log(this.state.data)
        console.log(this.state.data[1])
    }
    QVisualizerHandler() {
        let questionnairesID = 49 /*remove after being able to choose questionnaire*/

        const reqOpts = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionnairesID })
        }
        fetch('http://localhost:3001/get_qvisualization', reqOpts).then(response => {
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
                                    backgroundColor: 'rgba(75,192,192,1)',
                                    data: data,
                                }
                            ],

                        }
                        arrayOfQuestionData.push(curData)
                    }
                    this.setState({ data: arrayOfQuestionData })
                }
            });
        });
    }
    render() {
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
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 5,
                    left: 200,
                    right: 200,
                    bottom: 50
                }
            },
        }
        return (
            <div>
                <Bar
                    // data={(!this.state.data.length) ? testData : this.state.data[Math.floor(Math.random() * (this.state.data.length))]}
                    data={(!this.state.data.length) ? testData : this.state.data[this.state.question]}
                    height={500}
                    width={500}
                    options={options}
                />
                <button className="chart-test-button" onClick={() => /*console.log(JSON.stringify(this.state.questions)) + */this.QVisualizerHandler()}  > Visualizer Test</button >
                <button className=" next-button " onClick={()=>this.NextButton(this.state.question)}> Next Question </button>
                <button className=" prev-button " onClick={()=>this.PrevButton(this.state.question)}> Prev Question </button>
            </div>
        )
    }
}
