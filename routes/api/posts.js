const express = require('express');
const router = express.Router();
const mongoose = require( 'mongoose' );
const passport = require( 'passport' );

// Post model
const Post = require( '../../models/Post' );
const Profile = require( '../../models/Profile' );

// Validation
const validatePostInput = require( '../../validation/post' );


// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get( '/test', ( req, res ) => res.json( { msg: 'Posts Works' } ) );

// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get( '/', ( req, res ) =>
{ 
  Post.find().sort( { date: -1 } ).then( posts => res.json( posts ) )
    .catch( err=>res.status(404).json( {nopostfound: 'No Posts found.'} ));
} );

// @route   GET api/posts/:id
// @desc    Get Posts by id
// @access  Public
router.get( '/:id', ( req, res ) =>
{ 
  Post.findById( req.params.id ).then( post => res.json( post ) )
    .catch( err => res.status( 404 ).json( {nopostfound: 'No Post found with that Id.'} ));
} );

// @route   DELETE api/posts/:id
// @desc    Delete Posts by id
// @access  Private
router.delete( '/:id', passport.authenticate( 'jwt', { session: false }), ( req, res ) =>
{
  Profile.findOne( { user: req.user.id } )
    .then( profile =>
    {
     /* This part of the code is checking if the user making the request is the owner of the post
     before allowing the deletion of the post. */
      Post.findById( req.params.id )
        .then( post =>
        {  // Check for the post owner
          if ( post.user.toString() !== req.user.id )
          { 
            return res.status( 401 ).json( { notauthorized: 'User not authorized.' } );
          }
          
          // Delete 
          // post.remove().then( () => res.json( { success: true } ) );
          post.deleteOne( {
            id: req.params.id
          } ).then( () => res.json( { success: true } ) );
        } )
        .catch( err => res.status( 404 ).json( { postnotfound: 'No Post Found.' } ) )
    } );
  
} );

// @route   POST api/posts
// @desc    Tests post route
// @access  Public
router.post( '/', passport.authenticate( 'jwt', { session: false } ), ( req, res ) =>
{

  const { errors, isValid } = validatePostInput( req.body );

  // check validation
  if ( !isValid )
  { 
    // if any errors, send 400
    return res.status( 400 ).json(errors);
  }

  const newPost = new Post( {
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  } );

  newPost.save().then( post => res.json(post) );
} );

module.exports = router;
