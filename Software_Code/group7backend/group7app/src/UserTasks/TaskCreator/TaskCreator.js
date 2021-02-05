import React, { Component } from 'react'
import Cookies from 'js-cookie'
import Task from './Task'

export default class TaskCreator extends Component {
	constructor(props) {
		super(props)
		this.state = {
			projects: [],
			tasks: [],
			selectedProject: "",
			usersID: props.user.id,
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
				projectAccessLevel: 1
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
				}))
				this.setState({ tasks: tasksCopy })
			}))
	}

	handleProjectChange(value) {
		let projectCopy = value
		this.setState({ selectedProject: projectCopy }, () => this.getTaskList())
	}

	handleTaskUpdate(task) {
		console.log("AAAAA", task.text)
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tasksID: task.id, text: task.text })
		}
		fetch('/api/update_task', reqOpts)
			.then(response => response.json().then(json => {
				console.log("/update_task", json)
				if (json == "TASK UPDATED") {
					let ind = tasksCopy.findIndex(element => task.id == element.id)
					this.state.tasks[ind].text = task.text
					let tasksCopy = this.state.tasks
					this.setState({ tasks: tasksCopy })
				} else {
					alert("Could not update task!")
				}
			})).catch(e => console.log("unexpected_err", e))
	}

	handleTaskDelete(task) {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tasksID: task.id })
		}
		fetch('/api/delete_task', reqOpts)
			.then(response => response.json().then(json => {
				console.log("/delete_task", json)
				if (json == "TASK DELETED") {
					let tasksCopy = this.state.tasks
					let ind = tasksCopy.findIndex(element => task.id == element.id)
					tasksCopy.splice(ind, 1)
					this.setState({ tasks: tasksCopy })
				} else {
					alert("Could not delete task!")
				}
			})).catch(e => console.log("unexpected_err", e))
	}

	render() {
		let projectList = this.state.projects.map((curr, key) => (
			<option value={curr.id} key={key} className="projects-item">
				{curr}
			</option>
		))
		let taskList = this.state.tasks.map((curr, key) => (
			<Task
				key={key}
				updHandler={(task) => this.handleTaskUpdate(task)}
				delHandler={(task) => this.handleTaskDelete(task)}
				task={curr}
			/>
		))

		console.log("PROJECTS", this.state.projects)
		console.log("TASKS", this.state.tasks)
		console.log("TASKS_XML", taskList)

		if (this.state.user + "#" + this.state.usersID + "#" + this.state.position +
			"#logged-in" == Cookies.get('access_token')) {
			return (
				<div>
					<div className="tasks-wrapper">
						<div className="projects">
							<label>Select a project</label>
							<select onChange={(event => {
								this.handleProjectChange(event.target.value)
							}
							)} className="projects-dropdown">
								{projectList}
							</select>
						</div>
						<div className="research-title">
							Project {this.state.selectedProject} tasks
					</div>
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
