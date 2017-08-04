import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';


const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  user
}) => (
  <div style={{backgroundColor:'#eee',height:'100vh'}}>
    <AppBar
      title="Pamoja"
      iconElementRight={<FlatButton  label="About" />}
      style={{marginBottom:100}}
    />

  <Card style={{margin:'auto', maxWidth:380}}>

    <form className="form-signin" onSubmit={onSubmit}>
      <h2 className="card-heading">login</h2>

      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="form-control">
        <TextField
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
          fullWidth={true}
        />
      </div>

      <div className="form-control">
        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          fullWidth={true}
          value={user.password}
        />
      </div>

      <div className="button-line" >
        <RaisedButton style={{width:'100%', height:50}} type="submit" label="Log in" primary />
      </div>

      <CardText>Don't have an account? <Link to={'/signup'}>Create one</Link>.</CardText>
    </form>
  </Card>
    </div>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
