import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const SignUpForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (
  <div style={{backgroundColor:'#eee',height:'100vh'}}>
    <AppBar
      title="Pamoja"
      iconElementRight={<FlatButton  label="About" />}
      style={{marginBottom:70}}
    />
  <Card style={{margin:'auto', maxWidth:380}}>
    <form className="form-signin" onSubmit={onSubmit}>
      <h2 className="card-heading">Sign Up</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="sform-control">
        <TextField
          floatingLabelText="Name"
          name="name"
          errorText={errors.name}
          onChange={onChange}
          value={user.name}
        />
      </div>

      <div className="sform-control">
        <TextField
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>

      <div className="sform-control">
        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>

      <div className="sform-control">
        <TextField
          floatingLabelText=" Confirm Password"
          type="password"
          name="passwordRepeat"
          onChange={onChange}
          errorText={errors.passwordRepeat}
          value={user.passwordRepeat}
        />
      </div>

      <div className="button-line">
        <RaisedButton style={{width:'100%', height:50}} type="submit" label="Create New Account" primary />
      </div>

      <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
    </form>
  </Card>
</div>
);

SignUpForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
