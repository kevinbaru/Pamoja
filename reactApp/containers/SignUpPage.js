import React, { PropTypes } from 'react';
import {HashRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Redirect } from 'react-router'
import SignUpForm from '../components/signup';

class SignUpPage extends React.Component {

  /**
  * Class constructor.
  */
  constructor(props) {
    super(props);

    // set the initial component state
    this.state = {
      errors: {},
      logIn:false,
      user: {
        email: '',
        name: '',
        password: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  /**
  * Change the user object.
  *
  * @param {object} event - the JavaScript event object
  */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  /**
  * Process the form.
  *
  * @param {object} event - the JavaScript event object
  */
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.user.name,
        email: this.state.user.email,
        password:this.state.user.password,
        passwordRepeat:this.state.user.passwordRepeat,
      })
    })
    .then(resp=>resp.json())
    .then((resp)=>{
      console.log(resp,'signupppp.......')

      if(resp.success){
        this.setState({
          errors: {},
          logIn:true
        });

      }else{
        const errors = resp.errors ? resp.errors : {};
        errors.summary = resp.message;

        this.setState({
          errors
        });
      }

    })
    .catch(err=>{
      console.log(err)
    })

    console.log('name:', this.state.user.name);
    console.log('email:', this.state.user.email);
    console.log('password:', this.state.user.password);
    console.log('passwordRepeat:', this.state.user.passwordRepeat);
  }

  /**
  * Render the component.
  */

  render() {



    return this.state.logIn ?
    (
      <div>
        <Switch>
        <Redirect from='/signup' to='/login'/>
        </Switch>

      </div>

    ):

    (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

export default SignUpPage;
