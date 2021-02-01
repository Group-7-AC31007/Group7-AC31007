import React, { Component } from 'react'
import Task from './Task'


export default class UserTasks extends Component {
	constructor(props) {
		super(props)
		let tasks = [{"id": 1, "checked": true, "text": "test"}]
		this.state = {tasks: tasks}
	}

	handleStatusChange() {
		let tasksCopy = this.state.tasks
		this.setState({tasks: tasksCopy})
	}

	render() {
		let taskList = this.state.tasks.map((curr, key) => (
			<Task
				key={key}
				handler={() => this.handleStatusChange()}
				task={curr}
			/>
		))

		console.log(this.state.tasks)
		
		return (
			<div className="tasks-wrapper">
				<div className="research-title">PLACEHOLDER tasks</div>
				{taskList}
			</div>
		)
	}
}