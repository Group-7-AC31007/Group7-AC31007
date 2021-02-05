import React, { Component } from 'react'

export default class Task extends Component {
	constructor(props) {
		super(props)
		this.state = props.task
		this.updateHandler = props.updHandler
		this.deleteHandler = props.delHandler
	}

	componentWillReceiveProps(nextProps) {
		this.setState(nextProps.task)
	}

	handleUpdate() {
		let task = this.state
		this.updateHandler(task)
	}

	handleDelete() {
		let task = this.state
		this.deleteHandler(task)
	}

	render() {
		console.log("TEXT", this.state.text)
		return (
			<div className="task">
				<span>
					<input
						type="text"
						onChange={(event) => {
							this.setState({text: event.target.value})
						}}
						value={this.state.text}>
					</input>
					<button onClick={() => this.handleUpdate()}>Update</button>
					{/* <button onClick={() => this.handleDelete()}>X</button> */}
				</span>
			</div>
		)
	}
}
