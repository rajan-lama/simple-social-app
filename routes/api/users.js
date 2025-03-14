const express = require('express');
const router = express.Router();
const gravatar = require( 'gravatar' );
const User = require( '../../models/User' );
const bcrypt = require( 'bcryptjs' );
const jwt = require( 'jsonwebtoken' );
const keys = require( '../../config/keys' );
const passport = require('passport');

//Load Input Validation
const validateRegisterInput = require( '../../validation/register' );
const validateLoginInput = require( '../../validation/login' );

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

module.exports = router;

// @route   GET api/users/register
// @desc    Register user / Returning JWT Token
// @access  Public
router.post( '/register', ( req, res ) =>
{ 
  const { errors, isValid } = validateRegisterInput( req.body );

  // Check Validation
  if ( !isValid )
  { 
    return res.status( 400 ).json( errors );
  }

  User.findOne( { email: req.body.email } )
    .then( user =>
    {
      if ( user )
      {
        errors.email = 'Email aready exists';
        return res.status( 400 ).json( errors );
      } else
      {
        const avatar = gravatar.url( req.body.email, {
          s: '200', // size
          r: 'pg', // Rating
          d: 'mm' // default
        } );
        const newUser = new User( {
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
        } );

        bcrypt.genSalt( 10, ( err, salt ) =>
        {
          bcrypt.hash( newUser.password, salt, ( err, hash ) =>
          {
            if ( err ) throw err;
            newUser.password = hash;
            newUser.save()
              .then( user => res.json( user ) )
              .catch( err => console.log( err ) )
            
          } )
        } )
      }
    } );
} );


// @route   GET api/users/login
// @desc    Register user / Returning JWT Token
// @access  Public
router.post( '/login', ( req, res ) =>
{
  const { errors, isValid } = validateLoginInput( req.body );

  // Check Validation
  if ( !isValid )
  { 
    return res.status( 400 ).json( errors );
  }

  const email = req.body.email;
  const password = req.body.password;


  // find user by email
  User.findOne( { email } )
    .then( user =>
    {
      // Check for user
      if ( !user )
      {
        errors.email = 'User not found.';
        return res.status(404).json( errors );
      }

      //check password
      bcrypt.compare( password, user.password )
        .then( isMatch =>
        {
          if ( isMatch )
          {
            // res.json( { msg: 'SUCCESS' } );

            const payload = { id:user.id, name: user.name, avatar: user.avatar } // created jwt payload

            // sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              ( err, token ) =>
              { 
                res.json( {
                  success: true,
                  token: 'Bearer ' + token
                } );
              }); // payload + secret + timeout(1hr)
          } else
          {
            errors.password = 'Password incorrect';
            return res.status( 400 ).json( errors )
          }
        } );
    } );
} );

// @route   GET api/users/current
// @desc    Register user / Returning JWT Token
// @access  Public
router.get( '/current', passport.authenticate( 'jwt', { session: false } ), (req, res) =>
{ 
  res.json( {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  } );
} );
module.exports = router;