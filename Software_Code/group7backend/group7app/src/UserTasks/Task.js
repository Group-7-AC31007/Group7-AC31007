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

	// https://stackoverflow.com/questions/1500260/detect-urls-in-text-with-javascript
	urlify(text) {
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		return text.replace(urlRegex, (url) => {
			return '<a href="' + "/share" +url.split("share")[1] + '">Click here</a>';
		})
	}

	render() {
		console.log("i",this.state.text);
		return (
			<div className="task">
				<input
					className="task-checkbox"
					name={this.state.id}
					type="checkbox"
					checked={this.state.checked}
					onChange={(event) => this.handleCheck(event)}
				/>
				<label dangerouslySetInnerHTML={{ __html: this.urlify(this.state.text) }}>
				</label>
			</div >
		)
	}
}
