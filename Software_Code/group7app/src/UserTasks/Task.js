import React, { Component } from 'react'

export default class Task extends Component {
	constructor(props) {
		super(props)
		console.log(props.task)
		this.state = props.task
		this.handler = props.handler
	}

	handleCheck(event) {
		let task = this.state
		task.checked = event.target.checked
		console.log(task)
		this.handler(task)
	}
	
	render() {
		return (
			<div className="task">
				<input
					className="task-checkbox"
					name={this.state.id}
					type="checkbox"
					checked={this.state.checked}
					onChange={(event) => this.handleCheck(event)}
				/>
				<label>{this.state.text}</label>
			</div>
		)
	}
}
