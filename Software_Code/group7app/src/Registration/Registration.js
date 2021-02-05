import React, { Component } from 'react'
import './Registration.css'
import sjcl from 'sjcl'
export default class Registration extends Component {
  constructor(props) {
		super(props);
		this.history = props.history
    this.state = {firstName: '', lastName: '', email: '', password: ''};
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    
    if (event.target.name == 'firstName') {
        this.setState({firstName: event.target.value})
      }
    if (event.target.name == 'lastName') {
      this.setState({lastName: event.target.value})
    }
    if (event.target.type == 'email') {
      this.setState({email: event.target.value})
    }
    if (event.target.type == 'password') {
      this.setState({password: event.target.value})
    }
    
	}
	
	signUp = (forename, surname, email, hashPassword) => {
		const reqOpts = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ forename, surname, email, hashPassword })
		};
		fetch('http://localhost:3001/signup', reqOpts).then(response => {
			response.json().then(json => {
				if (json == 'SIGNUP SUCCESS') {
					alert('Signed up with the email: ' + email);
					this.history.push("/login")
				} else {
					alert('Could not sign up with the email: ' + email);
					console.log(json);
				}
			});
		});
	};
  
  //this.state.email and this.state.password are essentially variables holding the relevant data.
  handleSubmit(event) {
    const hashBitArray = sjcl.hash.sha256.hash(this.state.password);
		const Hash = sjcl.codec.hex.fromBits(hashBitArray);
		this.signUp(this.state.firstName, this.state.lastName, this.state.email, Hash)
    event.preventDefault();
  }

  render() {
    return (
      <div className="registration-form-wrapper">
        <form className="registration-form" onSubmit={this.handleSubmit}>
          <label>
            First Name:
            <input name='firstName' type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <br></br>
          <label>
            Last Name:
            <input name='lastName' type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <br></br>
          <label>
            Email:
            <input type="email" value={this.state.value} onChange={this.handleChange} />
          </label>
          <br></br>
          <label>
            Password:
            <input type="password" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input className="registration-submit-button" type="submit" value="Sign Up" />
        </form>
      </div>
    );
  }
}
