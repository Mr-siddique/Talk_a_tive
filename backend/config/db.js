const mongoose=require('mongoose');
const connectDB=async ()=>{
    try{
        const connect=await mongoose.connect(process.env.mongoURI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`mongoDB connected : ${connect.connection.host}`);
    }catch(err){
        console.log(`error : ${err.message}`);
        process.exit();
    }
}
module.exports = connectDB;