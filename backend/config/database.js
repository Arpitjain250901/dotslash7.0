const mongoose=require("mongoose");

const connectDatabase= () => {

mongoose.connect(process.env.DB_URI)
  .then((data) => {
    console.log(`Connected to MongoDB: ${data.connection.host}`);
  })

   // handled promise rejection
  // .catch((error) => {
  //   console.error('Error connecting to MongoDB:', error);
  // });

 

}

module.exports=connectDatabase
//frwbjfjc