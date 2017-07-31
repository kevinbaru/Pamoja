import React, { PropTypes } from 'react';
import LoginForm from '../components/login.js';
import { Redirect } from 'react-router';
import {HashRouter as Router, Route, Switch, Link } from 'react-router-dom'

class LoginPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor(props) {
    super(props);
    console.log(this.props,'proppps')

    // set the initial component state
    this.state = {
      errors: {},
      loggedIn:false,
      user: {
        email: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    fetch('http://localhost:3000/login', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: this.state.user.email,
        password: this.state.user.password,
      })
    })
    .then(resp=>{

    return resp.json()
    })
    .then((resp)=>{


      if(resp && resp.success){
        this.setState({
          errors: {},
          loggedIn:true
        });

      }else{
        const errors = resp.errors ? resp.errors : {};
        errors.summary = "name/password is incorrect";

        this.setState({
          errors
        });
      }

    })
    .catch((err)=>{
      throw err
    })


    console.log('email:', this.state.user.email);
    console.log('password:', this.state.user.password);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    event.preventDefault();
    console.log('changeUser method.');
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
   * Render the component.
   */
  render() {
    return this.state.loggedIn?
    (<div>
      <Switch>
      <Redirect to='/home'/>
      </Switch>
    </div>
    )
    :(
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

export default LoginPage;
