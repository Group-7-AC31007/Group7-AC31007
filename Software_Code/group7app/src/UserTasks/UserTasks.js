import React, { Component } from 'react'
import Task from './Task'


export default class UserTasks extends Component {
	constructor(props) {
		super(props)
		this.state = {
			projects: [],
			tasks: [],
			selectedProject: "",
			usersID: 10,
			projectAccessLevel: 0
		}
		this.getProjectList()
	}

	getProjectList() {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				usersID: this.state.usersID,
				projectAccessLevel: this.state.projectAccessLevel
			})
		}
		fetch('http://localhost:3001/get_project_list', reqOpts)
		.then(response => response.json().then(json => {
			console.log("/get_project_list", json)
			this.setState({
				projects: json.map(element => element.projectsID)
			})
			if (this.state.projects.length != 0) {
				this.setState({ selectedProject: this.state.projects[0] })
				this.getTaskList()
			}
		}))
	}

	isTaskCompleted(tasksID) {
		return new Promise((resolve, reject) => {
			const reqOpts = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tasksID, usersID: this.state.usersID })
			}
			fetch('http://localhost:3001/get_task_completion', reqOpts)
			.then(response => response.json().then(json => {
				return resolve(!!json["0"] && !!json["0"].taskCompletionsID)
			}))
		})
	}

	getTaskList() {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ projectsID: this.state.selectedProject })
		}
		fetch('http://localhost:3001/get_task_list', reqOpts)
		.then(response => response.json().then(json => {
			console.log("/get_task_list", json)
			let tasksCopy = json.map(element => ({
				"id": element.tasksID,
				"text": element.text,
				"checked": false
			}))
			tasksCopy.forEach((element, ind) => {
				this.isTaskCompleted(element.id).then(checked => {
					tasksCopy[ind].checked = checked
					this.setState({tasks: tasksCopy})
				})
			})
		}))
	}

	sendTaskStatus(task) {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				usersID: this.state.usersID,
				tasksID: task.id,
				checked: task.checked
			})
		}
		fetch('http://localhost:3001/set_task_completion', reqOpts)
		.then(response => response.json().then(json => {
			console.log("/set_task_status", json)
			if (json == "COULD NOT SET COMPLETION") {
				task.checked = !task.checked
			}
		}))
	}

	handleProjectChange(value) {
		let projectCopy = value
		this.setState({ selectedProject: projectCopy })
	}

	handleTaskStatusChange(task) {
		let tasksCopy = this.state.tasks
		this.setState({ tasks: tasksCopy })
		this.sendTaskStatus(task)
	}

	render() {
		let taskList = this.state.tasks.map((curr, key) => (
			<Task
				key={key}
				handler={(task) => this.handleTaskStatusChange(task)}
				task={curr}
			/>
		))
		let projectList = this.state.projects.map((curr, key) => (
			<option key={key} className="projects-item">{curr}</option>
		))

		console.log("PROJECTS", this.state.projects)
		console.log("TASKS", this.state.tasks)

		return (
			<div className="tasks-wrapper">
				<div className="projects">
					<label>Select a project</label>
					<select value={this.state.selectedProject} onChange={(
						event => {
							this.handleProjectChange(event.target.value)
							this.getTaskList()
						}
					)} className="projects-dropdown">
						{projectList}
					</select>
				</div>
				<div className="research-title">Project {this.state.selectedProject} tasks</div>
				<div className="task-list">
					{taskList}
				</div>
			</div>
		)
	}
}