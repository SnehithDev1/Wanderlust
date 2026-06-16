const ExpressError = require("./ExpresssError");

module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}