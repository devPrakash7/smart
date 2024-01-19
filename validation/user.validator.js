

const { body, validationResult } = require('express-validator');

//validate user form detail
exports.user_validator = [
     
  body('full_name')
      .not()
      .isEmpty()
      .withMessage('full_name is required')
      .isString()
      .withMessage('full_name should be a string')
      .trim(),

      body('mobile_number')
      .not()
      .isEmpty()
      .withMessage('mobile_number is required')
      .isString()
      .withMessage('mobile_number should be a string')
      .isLength({min:10})
      .withMessage('mobile number length can be greater than 10 digit')
      .trim(),
   
    body('email')
      .not()
      .isEmpty()
      .withMessage('email is required')
      .isString()
      .withMessage('email should be a string')
      .isEmail().withMessage('please enter a valid email address')
      .trim(),

    body('password')
      .not()
      .isEmpty()
      .withMessage('password is required')
      .isString()
      .withMessage('password should be a string')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
      .withMessage('please enter a valid password like this : demo123@909')
      .trim()
];

exports.login_validator = [

  body('email')
  .not()
  .isEmpty()
  .withMessage('email is required')
  .isString()
  .withMessage('email should be a string')
  .isEmail().withMessage('please enter a valid email address')
  .trim(),

body('password')
  .not()
  .isEmpty()
  .withMessage('password is required')
  .isString()
  .withMessage('password should be a string')
  .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
  .withMessage('please enter a valid password like this : demo123@909')
  .trim()

];



exports.validation_result = (req, res, next) => {
  const result = validationResult(req);
  const haserror = !result.isEmpty();

  if (haserror) {
    const err = result.array()[0].msg;
    return res.status(400).send({ sucess: false, message: err });
  }

  next();
};


