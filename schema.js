const Joi=require("joi");
module.exports=Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
   // image:Joi.string().uri().allow("",null),
    price:Joi.number().required().min(0)
}).required().unknown(true);