const Validator = require( 'validator' );
const isEmpty = require( './is-empty' );

module.exports = function validatePostInput(data)
{ 
  let errors = {};

  data.text = !isEmpty( data.text ) ? data.text : '';
  data.name = !isEmpty( data.name ) ? data.name : '';

  if ( Validator.isEmpty( data.text ) )
  {  
    errors.text = 'Text is required';
  }
 
  if ( ! Validator.isLength( data.text, { min: 10, max: 500 }) )
  { 
    errors.text = 'Post must have 10 to 300 characters';
  }

  if ( Validator.isEmpty( data.name ) )
  { 
    errors.name = 'Name Field is required';
  }

  return {
    errors,
    isValid:  isEmpty(errors)
  }
}