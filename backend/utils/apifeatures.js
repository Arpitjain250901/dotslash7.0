 class Apifeatures{

    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i", //lowercase uppercase both
            },
        } : {};

      
       // console.log(keyword)
     this.query.find({...keyword});
     return this; // return this class
    }



    filter(){
       
        const querycopy ={...this.queryStr};

       const removefield=["keyword","page","limit"];

       removefield.forEach((key) => delete querycopy[key]);
  
       //filter for price and rating
       let queryStr=JSON.stringify(querycopy);
       
       queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

       let parsedJSON=JSON.parse(queryStr, function(k, v) { 
        return (k === "$gte" || k==="$gt" ||  k === "$lte" || k==="$lt") ? parseInt(v,10): v; 
    });

    //this.query = this.query.find(parsedJSON);


       this.query = this.query.find(JSON.parse(queryStr));
   
      //this.query=this.query.find(querycopy);
      return this;
    }


    pagination(resultperpage){

        const currentPage=Number(this.queryStr.page) || 1;
        const skip = resultperpage  *(currentPage-1);
 
        this.query.limit(resultperpage).skip(skip);
        return this;
    }
 };

 module.exports  = Apifeatures