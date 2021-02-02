import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

const testData = {
    labels: ['answer 1', 'answer 2', 'answer 3',
        'answer 4', 'answer 5'],
    datasets: [
        {
            label: 'Question1',
            backgroundColor: 'rgba(75,192,192,1)',
            barPercentage: 0.9,
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
                    // console.log(chartData[5].questionText);
                    let chartAnswer = [...chartData]
                    let loggedAnswers = []
                    let sortedAnswers = []
                    let sortedID = 1

                    // console.log(chartAnswer);
                    for (let i = 0; i < chartAnswer.length; i++) {
                        let count = 0
                        let logCheck = false
                        let loopct = 0
                        let curID = chartAnswer[i].questionID;
                        let curAnswer = chartAnswer[i].text_answer
                        console.log(" Log length ");
                        console.log(loggedAnswers.length);
                        if (loggedAnswers.length >0) {
                            for (let x = 0; x < loggedAnswers.length; x++) {
                                loopct++
                                console.log("loopct");
                                console.log(loopct);
                                // console.log("x");
                                // console.log(x);
                                console.log(" It be like that ")
                                console.log(loggedAnswers[x]);
                                console.log(" I wanna cry")
                                console.log(loggedAnswers[x].Answer);
                                // console.log(JSON.stringify(loggedAnswers[x].Answer));
                                if (curID == loggedAnswers[x].questionID && curAnswer == loggedAnswers[x].Answer && !loggedAnswers[x].Answer) {
                                    logCheck = true
                                }
                                if(!loggedAnswers[x].Answer)
                                {
                                console.log(" curAnswer comparison ");
                                console.log(curAnswer);
                                console.log(" logged answer comparison ");
                                console.log(loggedAnswers[x].Answer);
                                console.log(" xr comparison ");
                                console.log(x);
                                }

                            }
                            // console.log(" curAnswer  ");
                            // console.log(curAnswer);
                            // console.log("curID");
                            // console.log(curID);
                            // console.log(" chartAnswer length ");
                            // console.log(chartAnswer.length);
                            // console.log(logCheck)
                        }
                        // console.log("AAAAAAAAAAAAA");
                        if (logCheck == false) {
                            // console.log(chartAnswer);
                            for (let y = 0; y < chartAnswer.length; y++) {
                                console.log(y);
                                console.log(chartAnswer[y]);
                                if (chartAnswer[y].text_answer == curAnswer && chartAnswer[y].questionID == curID && !chartAnswer[y].text_answer) {
                                    count++
                                    console.log("yes");

                                }
                            }

                            sortedAnswers.push({ ID: sortedID , Answer: curAnswer ,count: count })
                            loggedAnswers.push({ ID: i + 1 ,Answer: curAnswer , questionID: curID })
                            console.log(" Logged Length ")
                            console.log(loggedAnswers.length)
                            console.log(" Logged answer ")
                            console.log(loggedAnswers[i].questionID)
                            sortedID++
                        }
                        console.log(sortedAnswers);
                        console.log(loggedAnswers);

                    }
                    console.log(sortedAnswers);
                    console.log(loggedAnswers);

                }
            });
        });
    }
    render() {
        return (
            <div>
                <Bar
                    data={testData}
                    height={500}
                    width={500}
                    options={{
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                top: 5,
                                left: 200,
                                right: 200,
                                bottom: 50
                            }
                        },
                        title: {
                            display: true,
                            text: 'Questionnaire 1',
                            fontSize: 30
                        },
                        legend: {
                            display: false,
                            position: 'right'
                        }
                    }}
                />
                <button className="chart-test-button" onClick={() => /*console.log(JSON.stringify(this.state.questions)) + */this.QVisualizerHandler()}  > Visualizer Test</button >
            </div>
        )
    }
}
