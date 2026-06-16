const Joi=require("joi");
module.exports=reviewSchema=Joi.object(
    {
        comment:Joi.string().required(),
        rating:Joi.number().required().min(1).max(5),
        createdAt:Joi.date().allow("",null)
    }
).required().unknown(true)