import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';

const state = {
    labels: ['answer 1', 'answer 2', 'answer 3',
        'answer 4', 'answer 5'],
    datasets: [
        {
            label: 'Questionnaire',
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


    render() {
        return (
            <div>
                <Bar
                    data={state,state}
                    height={500}
                    width={500}
                    options={{
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                top: 5,
                                left: 900,
                                right: 900,
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
            </div>
        )
    }
}
