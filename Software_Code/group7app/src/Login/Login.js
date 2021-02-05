import React, { Component } from 'react'
import './Login.css'
import sjcl from 'sjcl'
import Cookies from 'js-cookie'
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.history = props.history
    let params = new URLSearchParams(window.location.search)
    this.state = { email: '', password: '', user: props.user.user, id: props.user.id, position: props.user.position, redirect: params.get("redirect") };
    console.log("redirect?", this.state.redirect);
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
    };
    console.log(hashPassword);
    fetch('http://localhost:3001/signin', reqOpts).then(response => {
      response.json().then(json => {
        console.log(json);
        if (json == "NO SUCH USER") {
          console.log("NO SUCH USER");
        } else if (json.locked == 1) {
          alert("Account is locked please contact your lab manager")
        } else {

          if (hashPassword == json.hashPassword) {
            console.log(json);
            console.log(json.position);
            const expires = (60 * 60) * 1000;
            const inOneHour = new Date(new Date().getTime() + expires);
            //alert('Signed in with the email: ' + this.state.email);
            console.log("login", "logged in");
            Cookies.set('access_token', json.email + "#" + json.usersID + "#" + json.position + "#logged-in", { expires: inOneHour });
            this.handleUser({ user: json.email, id: json.usersID, position: json.position });
            if (this.state.redirect == null) {
              this.history.push(`/refresh?message=Logging in to ${json.email}&timer=1000`)
            } else {
              console.log("redirecting to share");
              this.history.push(`${this.state.redirect}`)
            }
          } else {
            alert('Incorrect password: ' + this.state.email);
          }
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
   // console.log(Cookies.get('access_token'));
    //console.log(this.state.user + "#" + this.state.id + "#" + this.state.position + "#logged-in");
    if (Cookies.get('access_token') == this.state.user + "#" + this.state.id + "#" + this.state.position + "#logged-in") {
      console.log("got in");
      if (this.state.redirect != null) {
        console.log("redirecting to ", this.state.redirect);
        this.history.push(`/${this.state.redirect}`)
      }
      return (
        <div>
          <div>{this.state.user}</div>
          <button onClick={() => {
            Cookies.remove('access_token');
            this.handleUser({ user: "", id: "", position: "" })
            this.history.push("/refresh?next=login&message=Logging out")
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
            <div className="clear"> </div>
            <input className="login-submit-button" type="submit" value="Sign In" />
          </form>
        </div>

      );
    }
  }

}
