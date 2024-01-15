const Joi = require('joi');

const discussionSchema = Joi.object({
    heading: Joi.string().required().min(3),
    description: Joi.string().required(),
});

const discussUpdateSchema = Joi.object({
    heading: Joi.string().min(3),
    description: Joi.string().min(3),
    
}).or('title', 'description', 'body', 'tags', 'state');


const validDiscussCreation = (req, res, next) => {
    const { error, value } = discussionSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

const validDiscussUpdate = (req, res, next) => {
    const { error, value } = discussUpdateSchema.validate(req.body)
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    next()
}

module.exports = { validDiscussCreation, validDiscussUpdate }
