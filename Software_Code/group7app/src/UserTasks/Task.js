import React, { Component } from 'react'

export default class Task extends Component {
	constructor(props) {
		super(props)
		this.state = props.task
		this.handler = props.handler
	}

	handleCheck(event) {
		let task = this.state
		task.checked = event.target.checked
		console.log(task);
		this.handler()
	}
	
	render() {
		return (
			<div className="task-wrapper">
				<label>
					<input 
						name={this.state.id}
						type="checkbox"
						checked={this.state.checked}
						onChange={(event) => this.handleCheck(event)}
					/>
					{this.state.text}
				</label>
			</div>
		)
	}
}
