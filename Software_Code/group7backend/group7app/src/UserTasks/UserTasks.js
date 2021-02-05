import React, { Component } from 'react'
import Cookies from 'js-cookie'
import Task from './Task'
import './Task.css'

export default class UserTasks extends Component {
	constructor(props) {
		super(props)
		this.state = {
			projects: [],
			tasks: [],
			selectedProject: "",
			usersID: props.user.id,
			projectAccessLevel: 0,
			user: props.user.user,
			position: props.user.position
		}
		this.history = props.history
	}
	componentDidMount() {
		if (this.state.usersID) {
			this.getProjectList()
		}
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
		fetch('/api/get_project_list', reqOpts)
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
			fetch('/api/get_task_completion', reqOpts)
				.then(response => response.json().then(json => {
					return resolve(!!json["0"] && !!json["0"].taskCompletionsID)
				}))
		})
	}

	// https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
	urlify(text) {
		var urlRegex = /(https?:\/\/[^\s]+)/g
		return text.replace(urlRegex, (url) => {
			return '<a href="' + url + '">' + url + '</a>'
		})
	}

	getTaskList() {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ projectsID: this.state.selectedProject })
		}
		fetch('/api/get_task_list', reqOpts)
			.then(response => response.json().then(json => {
				this.setState({ tasks: [] })
				console.log("/get_task_list", json)
				let tasksCopy = json.map(element => ({
					"id": element.tasksID,
					"text": element.text,
					"checked": false
				}))
				console.log("tc",tasksCopy);
				console.log("json",json);
				tasksCopy.forEach((element, ind) => {
					this.isTaskCompleted(element.id).then(checked => {
						tasksCopy[ind].checked = checked
						console.log("l",tasksCopy);
						this.setState({ tasks: tasksCopy },()=>{console.log(this.state.tasks);})
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
		fetch('/api/set_task_completion', reqOpts)
			.then(response => response.json().then(json => {
				console.log("/set_task_status", json)
				if (json == "COULD NOT SET COMPLETION") {
					task.checked = !task.checked
				}
			}))
	}

	handleProjectChange(value) {
		let projectCopy = value
		this.setState({ selectedProject: projectCopy }, () => this.getTaskList())
	}

	handleTaskStatusChange(task) {
		let tasksCopy = this.state.tasks
		this.setState({ tasks: tasksCopy })
		this.sendTaskStatus(task)
	}

	render() {
		let projectList = this.state.projects.map((curr, key) => (
			<option
				value={curr.id} key={key} className="projects-item">{curr}
			</option>
		))
		let taskList = this.state.tasks.map((curr, key) => (
			<Task
				key={key}
				handler={(task) => this.handleTaskStatusChange(task)}
				task={curr}
			/>
		))

		console.log("PROJECTS", this.state.projects)
		console.log("TASKS", this.state.tasks)
		if (this.state.user + "#" + this.state.usersID + "#" + this.state.position +
			"#logged-in" == Cookies.get('access_token')) {
			return (
			<div className="tasks-main-wrapper">
				<div className="tasks-wrapper">
				<div className="quest-creator-icons-wrapper">
                    <i className="fa fa-book" style={{ fontSize: "60px" }}></i>
                    <i className="fa fa-laptop" style={{ fontSize: "60px" }}></i>
                    <i className="fa fa-file-text" style={{ fontSize: "60px" }}></i>
                </div>
					<div className="projects">
					
						<label>Select a project: </label>
						<select value={this.state.selectedProject} onChange={(
							event => {
								this.handleProjectChange(event.target.value)
							}
						)} className="projects-dropdown">
							{projectList}
						</select>
					</div>
					<div className="research-title">
						Project {this.state.selectedProject} tasks
					</div>
					<hr />
					<div className="task-list">
						{taskList}
					</div>
				</div>

			</div>
		)

			
		} else {
			this.history.push("/refresh?next=login&message=You must be logged in to" +
				" view this page&timer=3000")
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