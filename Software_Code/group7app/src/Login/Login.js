import React, { Component } from 'react'
import './Login.css'
import sjcl from 'sjcl'
import Cookies from 'js-cookie'
import { Route } from 'react-router-dom'
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.history = props.history

    this.state = { email: '', password: '', user: props.user.user, id: props.user.id };
    this.userCallback = props.userCallback
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleUser(a) {
    console.log("login", a);
    this.userCallback(a)

  }
  handleChange(event) {

    if (event.target.type == 'password') {
      this.setState({ password: event.target.value })
    } else {
      this.setState({ email: event.target.value })
    }
  }
  componentWillUnmount() {
    var id = window.setTimeout(function () { }, 0);

    while (id--) {
      window.clearTimeout(id); // will do nothing if no timeout with id is present
    }
  }

  signIn = (email, hashPassword) => {
    const reqOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, hashPassword })
    }
    console.log(hashPassword);
    fetch('http://localhost:3001/signin', reqOpts).then(response => {
      response.json().then(json => {
        if (json == "NO SUCH USER") {
          console.log("NO SUCH USER");
        } else {
          console.log(json);
          const expires = (60 * 60) * 1000
          const inOneHour = new Date(new Date().getTime() + expires)
          alert('Signed in with the email: ' + this.state.email);
          Cookies.set('access_token', json.email + "#" + json.usersID + "#logged-in", { expires: inOneHour })
          this.handleUser({ user: json.email, id: json.usersID })
          setTimeout(() => {
            this.history.push("/")
          }, 1000);
        }
      });
    });
  };

  //this.state.email and this.state.password are essentially variables holding the relevant data.
  handleSubmit(event) {
    const hashBitArray = sjcl.hash.sha256.hash(this.state.password.toString());
    const passHash = sjcl.codec.hex.fromBits(hashBitArray);
    this.signIn(this.state.email, passHash)
    event.preventDefault();
  }

  render() {
    if (Cookies.get('access_token') == this.state.user + "#" + this.state.id + "#logged-in") {
      console.log("got in");
      return (
        <div>
          <div>{this.state.user}</div>
          <button onClick={() => {
            Cookies.remove('access_token'); setTimeout(() => {
              this.history.push("/login")
            }, 1000);
          }}>Sign Out</button>
        </div>
      )

    } else {
      return (
        <div className="login-form-wrapper">
          <form className="login-form" onSubmit={this.handleSubmit}>
            <label>
              Email:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
              <div className="spacer" style={{ clear: "both" }} > </div>
            </label>
            <br></br>
            <label>
              Password:
                <input type="password" value={this.state.value} onChange={this.handleChange} />

            </label>
            <input className="login-submit-button" type="submit" value="Submit" />
          </form>
        </div>

      );
    }
  }

}




