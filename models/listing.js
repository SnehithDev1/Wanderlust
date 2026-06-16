const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const listingSchema=new Schema({
    title:{
        type:String,
        required:true
          
    }, 
    description:{
        type:String,
        required:true
    },
    image:{
        filename:{
            type:String,
            default:"listImage"
        },
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsfGVufDB8fDB8fHww"
        }
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    location:{type: String,
        required:true
    },
    country:{type:String,
        required:true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    review:[{
        type:Schema.Types.ObjectId,
        ref:"Review"
    }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;