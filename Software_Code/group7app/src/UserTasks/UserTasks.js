import React, { Component } from 'react'
import Task from './Task'


export default class UserTasks extends Component {
	constructor(props) {
		super(props)
		let tasks = [{"id": 1, "checked": true, "text": "test"}]
		this.state = {projects: [], tasks: tasks, selectedProject: "", usersID: 10}
		this.getProjectList()
	}

	getProjectList() {
		console.log("AN ATTEMPT WAS MADE XDDD");
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				usersID: this.state.usersID,
				projectAccessLevel: 1
			})
		}
		fetch('http://localhost:3001/get_project_list', reqOpts)
			.then(response => response.json().then(json => {
				console.log("/get_project_list", json)
				this.setState({
					projects: json.map(element => "Project " + element.projectsID)
				})
				if (this.state.projects.length != 0) {
					this.setState({selectedProject: this.state.projects[0]})
					this.getTaskList()
				}
			}))
	}

	isTaskCompleted(tasksID) {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tasksID, usersID: this.state.usersID })
		}
		fetch('http://localhost:3001/get_task_completion', reqOpts)
			.then(response => response.json().then(json => {
				console.log(json);
				return !!json["0"].taskCompletionsID
			}))
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
				this.setState({
					tasks: json.map(element => {
						return {
							"id": element.tasksID,
							"checked": false,
							"text": element.text
						}
					})
				})
			}))
	}

	handleProjectChange(value) {
		let projectCopy = value
		this.setState({selectedProject: projectCopy})
	}

	handleTaskStatusChange() {
		let tasksCopy = this.state.tasks
		this.setState({tasks: tasksCopy})
	}

	render() {
		let taskList = this.state.tasks.map((curr, key) => (
			<Task
				key={key}
				handler={() => this.handleTaskStatusChange()}
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
				<div className="projects-wrapper">
					<label>Select a project</label>
					<select value={this.state.selectedProject} onChange={
					(event => {
					this.handleProjectChange(event.target.value)
					this.getTaskList()
					})} className="projects-dropdown">
						{projectList}
					</select>
				</div>
				<div className="research-title">{this.state.selectedProject} tasks</div>
				{taskList}
			</div>
		)
	}
}