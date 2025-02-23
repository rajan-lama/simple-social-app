import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Register = () =>
{
  const [ attribute, setAttribute ] = useState( {
    name: '', email: '', password: '', password2: '', errors: ''
  } );

  const onChangeValue = (e) => {
    setAttribute((attribute) => ({
        ...attribute, // Keep previous attributes
        [e.target.name]: e.target.value, // Update only the changed field
    } ) );
  }

  const onSubmit = ( e ) =>
  {
    e.preventDefault();
    
    const newUser = attribute;
    console.log( newUser );

    axios.post( '/api/users/register', newUser )
      .then( res => console.log( res.data ) )
      .catch( err => console.log( err.response.data ) )
  }

  return (
    <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <form onSubmit={(e)=>onSubmit(e)}>
              <div className="form-group">
                <input type="text" className="form-control form-control-lg" placeholder="Name" name="name" value={ attribute.name } onChange={(e) => onChangeValue(e) } required />
              </div>
              <div className="form-group">
                <input type="email" className="form-control form-control-lg" placeholder="Email Address" value={ attribute.email } name="email" onChange={(e) => onChangeValue(e) }/>
                <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
              </div>
              <div className="form-group">
                <input type="password" className="form-control form-control-lg" placeholder="Password" value={ attribute.password } name="password" onChange={(e) => onChangeValue(e) }/>
              </div>
              <div className="form-group">
                <input type="password" className="form-control form-control-lg" placeholder="Confirm Password" name="password2" value={ attribute.password2 } onChange={(e) => onChangeValue(e) }/>
              </div>
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
