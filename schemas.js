const BaseJoi = require("joi"); //used for validations
const { number } = require("joi");
const review = require("./models/review");
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
	campground: Joi.object({
		title: Joi.string().required().escapeHTML(),
		// image: Joi.string().required(),
		price: Joi.number().required().min(0),
		description: Joi.string().required().escapeHTML(),
		location: Joi.string().required().escapeHTML(),
	}).required(),
	deleteImages: Joi.array().items(Joi.string()).optional() // Validate deleteImages as an optional array of strings
});

module.exports.reviewSchema = Joi.object({
	rating: Joi.number().required().min(1).max(5),
	body: Joi.string().required().escapeHTML(),
}).required();
