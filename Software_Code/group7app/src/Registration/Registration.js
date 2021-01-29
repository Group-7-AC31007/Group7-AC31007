import React, { Component } from 'react'
import './Registration.css'
import sjcl from 'sjcl'
export default class Registration extends Component {
  constructor(props) {
    super(props);
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
  
  //this.state.email and this.state.password are essentially variables holding the relevant data.
  handleSubmit(event) {
    const hashBitArray = sjcl.hash.sha256.hash(this.state.password);
    const Hash = sjcl.codec.hex.fromBits(hashBitArray);
    alert('First Name: ' + this.state.firstName + '\n' + 'Last Name: ' + this.state.lastName + '\n' + 'Email ' + this.state.email + '\n' + 'Password: ' + this.state.password + '\n' + 'Hashed Password ' + Hash);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
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
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
