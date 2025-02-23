import React, { useState } from 'react';
import axios from 'axios';

const Login = () =>
{
  const [ attribute, setAttribute ] = useState( {
       email: '', password: '', errors: '' } );
  
  const onChangeValue = ( e ) =>
  {
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
  }


  return (
    <div className="login">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Log In</h1>
            <p className="lead text-center">Sign in to your DevConnector account</p>
            <form onSubmit={(e)=>onSubmit(e)}>
              <div className="form-group">
                <input type="email" className="form-control form-control-lg" placeholder="Email Address" name="email" value={ attribute.email } onChange={ ( e ) => onChangeValue( e ) } />
              </div>
              <div className="form-group">
                <input type="password" className="form-control form-control-lg" placeholder="Password" name="password" value={ attribute.password } onChange={ ( e ) => onChangeValue( e ) } />
              </div>
              <input type="submit" className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
