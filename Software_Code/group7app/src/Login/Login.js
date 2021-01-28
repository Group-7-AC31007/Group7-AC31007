import React, { Component } from 'react'
import './Login.css'
export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = { email: '', password: '' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {

		if (event.target.type == 'password') {
			this.setState({ password: event.target.value })
		} else {
			this.setState({ email: event.target.value })
		}
	}

	signIn = (email, hashPassword) => {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, hashPassword })
		}
		fetch('http://localhost:3001/signin', reqOpts).then(response => {
			console.log("LOLE", response);
			response.json().then(json => {
				if(json == "NO SUCH USER") {
					console.log("XD");
				} else {
					alert('Signed in with the email: ' + this.state.email);
				}
			});
		});
	};

	//this.state.email and this.state.password are essentially variables holding the relevant data.
	handleSubmit(event) {
		this.signIn(this.state.email, this.state.password)
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Email:
              <input type="text" value={this.state.value} onChange={this.handleChange} />
				</label>
				<br></br>
				<label>
					Password:
              <input type="password" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>

		);
	}
}