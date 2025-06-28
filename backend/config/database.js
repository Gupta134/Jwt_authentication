const mongosh=require("mongoose");
const connectdb=async()=>{
    try{
        let MongoDb_URL=process.env.MONGO_URI
        await mongosh.connect(MongoDb_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log("mongodb connected successfully")

    }
    catch(err){
         console.error('❌ DB Connection Failed:', err.message);
         process.exit(1)

    }
    

}

module.exports=connectdb;