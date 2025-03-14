const express = require('express');
const router = express.Router();
const mongoose = require( 'mongoose' );
const passport = require( 'passport' );
const validateProfileInput = require( '../../validation/profile' );
const validateExperienceInput = require( '../../validation/experience' );
const validateEducationInput = require( '../../validation/education' );

// Load Profile Model
const Profile = require( '../../models/Profile' );

//Load User Model
const User = require( '../../models/User' );
const profile = require( '../../validation/profile' );

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get( '/test', ( req, res ) => res.json( { msg: 'Profile Works' } ) );

// @route   GET api/profile/
// @desc    Tests profile route
// @access  Public
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all Profile by handle
// @access  Public
router.get( '/all', (req, res) => {
    const errors = {};

    Profile.find()
      .populate('user', ['name', 'avatar'])
      .then(profiles => {
        if (!profiles) {
          errors.noprofile = 'There is no profiles.';
          return res.status(404).json(errors);
        }
        res.json(profiles);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/handle/:handle
// @desc    Get Profile by handle
// @access  Public
router.get( '/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({ handle: req.params.handle })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/user/:user_id
// @desc    Get Profile by user ID
// @access  Public
router.get( '/user/:user_id', (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.params.user_id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch( err => res.status( 404 ).json( {profile: 'There is no profile for this user.'} ));
  }
);


// @route   POST api/profile/
// @desc    Create profile route
// @access  Public
router.post( '/', passport.authenticate( 'jwt', { session: false } ), ( req, res ) =>
{
  const profileFields = {};
  const { errors, isValid } = validateProfileInput( req.body );

  if ( !isValid )
  { 
    return res.status( 400 ).json(errors);
  }

  profileFields.user = req.user.id;

  if ( req.body.handle ) profileFields.handle = req.body.handle;
  if ( req.body.company ) profileFields.company = req.body.company;
  if ( req.body.website ) profileFields.website = req.body.website;
  if ( req.body.location ) profileFields.location = req.body.location;
  if ( req.body.bio ) profileFields.bio = req.body.bio;
  if ( req.body.status ) profileFields.status = req.body.status;
  if ( req.body.githubusername ) profileFields.githubusername = req.body.githubusername;
  //skills split into array
  if ( typeof req.body.skills !== 'undefined' ) { profileFields.skills = req.body.skills.split( ',' ); }
  
  // social
  profileFields.social = {};
  if ( req.body.youtube ) profileFields.social.youtube = req.body.youtube;
  if ( req.body.twitter ) profileFields.social.twitter = req.body.twitter;
  if ( req.body.facebook ) profileFields.social.facebook = req.body.facebook;
  if ( req.body.linkedin ) profileFields.social.linkedin = req.body.linkedin;
  if ( req.body.instagram ) profileFields.social.instagram = req.body.instagram;

  Profile.findOne( { user: req.user.id } )
    .then( profile =>
    {
      if ( profile )
      { 
        // console.log(profile)
        // update profile
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else
      {
        //create
        Profile.findOne( { handle: profileFields.handle } )
          .then( profile =>
          {
            if ( profile )
            {
              errors.handle = 'That handle already exist.';
              return res.status( 404 ).json( errors );
            }
            
            // save Profile
            new Profile(profileFields).save().then(profile=>res.json(profile));
          } );
      }
    } );
});

// @route   Post api/profile/experience
// @desc    Add Experience to Profile
// @access  Private
router.post( '/experience', passport.authenticate( 'jwt', { session: false } ), ( req, res ) =>
{
  const { errors, isValid } = validateExperienceInput( req.body );

  if ( !isValid )
  { 
    return res.status( 400 ).json(errors);
  }

  Profile.findOne( { user: req.user.id } )
    .then( profile =>
    {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      
      // Add to exp array
      profile.experience.unshift( newExp );
      profile.save().then( profile => res.json( profile ) );
    } )
} );


// @route   Post api/profile/education
// @desc    Add education to Profile
// @access  Private
router.post( '/education', passport.authenticate( 'jwt', { session: false } ), ( req, res ) =>
{
  const { errors, isValid } = validateEducationInput( req.body );

  if ( !isValid )
  { 
    return res.status( 400 ).json(errors);
  }

  Profile.findOne( { user: req.user.id } )
    .then( profile =>
    {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      
      // Add to exp array
      profile.education.unshift( newEdu );
      profile.save().then( profile => res.json( profile ) );
    } )
} );



// @route   DELETE api/profile/experience
// @desc    Delete experience to Profile
// @access  Private
router.delete( '/experience/:exp_id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) =>
{
  Profile.findOne( { user: req.user.id } )
    .then( profile =>
    {
      // get remove index
      const removeIndex = profile.experience.map( item => item.id ).indexOf( req.params.exp_id );
      
      // Splice Out Of array
      profile.experience.splice( removeIndex, 1 );

      //save
      profile.save().then( profile => res.json( profile ) )
      
    } ).catch( err => res.status(404).json( err ) );
} );


// @route   DELETE api/profile/education
// @desc    Delete education to Profile
// @access  Private
router.delete( '/education/:edu_id', passport.authenticate( 'jwt', { session: false } ), ( req, res ) =>
{
  Profile.findOne( { user: req.user.id } )
    .then( profile =>
    {
      // get remove index
      const removeIndex = profile.education.map( item => item.id ).indexOf( req.params.edu_id );
      
      // Splice Out Of array
      profile.education.splice( removeIndex, 1 );

      //save
      profile.save().then( profile => res.json( profile ) )
      
    } ).catch( err => res.status(404).json( err ) );
} );


// @route   DELETE api/profile
// @desc    Delete Profile
// @access  Private
router.delete( '/', passport.authenticate( 'jwt', { session: false } ), ( req, res ) =>
{
  Profile.findOneAndDelete( { user: req.user.id } )
    .then( profile =>
    {
      User.findOneAndDelete( { _id: req.user.id } ).then( () => res.json( { success: true } ) );
    } ).catch( err => res.status(404).json( err ) );
} );

module.exports = router;
