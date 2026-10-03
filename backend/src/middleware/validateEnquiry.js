const { body, validationResult } = require('express-validator');

const enquiryValidationRules = [
  body('parentName')
    .isString().withMessage('Parent name must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Parent name must be between 2 and 100 characters'),
  body('studentName')
    .isString().withMessage('Student name must be text')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Student name must be between 2 and 100 characters'),
  body('email')
    .isString().withMessage('Email must be text')
    .bail()
    .trim()
    .isEmail().withMessage('A valid email address is required')
    .bail()
    .normalizeEmail()
    .isLength({ max: 200 }).withMessage('Email must not exceed 200 characters'),
  body('phone')
    .isString().withMessage('Phone must be text')
    .bail()
    .trim()
    .matches(/^[0-9+\-\s()]{10,20}$/).withMessage('Phone must contain 10 to 20 valid phone characters'),
  body('classSeeking')
    .isString().withMessage('Class seeking must be text')
    .bail()
    .trim()
    .isIn(['Nursery', 'KG', 'I–V', 'VI–VIII', 'IX–X', 'XI–XII'])
    .withMessage('Select a valid class'),
  body('message')
    .optional({ values: 'undefined' })
    .isString().withMessage('Message must be text')
    .bail()
    .trim()
    .isLength({ max: 2000 }).withMessage('Message must not exceed 2000 characters'),
  body('source')
    .optional({ values: 'undefined' })
    .isString().withMessage('Source must be text')
    .bail()
    .trim()
    .isIn(['', 'Newspaper', 'Social Media', 'Friend/Referral', 'Army Newsletter', 'Website'])
    .withMessage('Select a valid enquiry source'),
  body('contactTime')
    .optional({ values: 'undefined' })
    .isString().withMessage('Contact time must be text')
    .bail()
    .trim()
    .isLength({ max: 100 }).withMessage('Contact time must not exceed 100 characters')
];

const validateEnquiry = async (req, res, next) => {
  await Promise.all(enquiryValidationRules.map((rule) => rule.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Enquiry validation failed',
      errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
    });
  }
  next();
};

module.exports = { enquiryValidationRules, validateEnquiry };
