import React, { Fragment, useEffect,useState } from 'react';
import "./Product.css";
import { clearErrors, getProduct } from "../../actions/productaction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import ProductCard from "../Home/ProductCard.js";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Metadata from '../layout/metadata';
//import { Rating } from "@material-ui/lab";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "SmartPhones",
];

const Products = () => {
  
  const alert=useAlert();
    const dispatch=useDispatch();
   
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([0, 25000]);
    const [category, setCategory] = useState("");
    const [ratings, setRatings] = useState(0);

     const {products,loading,error,resultPerPage,productsCount,filterdProductCounts}= useSelector((state =>state.products))

   
    
    const { keyword } = useParams();

    const setCurrentPageNo = (e) => {
      setCurrentPage(e);
    };

    const priceHandler = (event, newPrice) => {
      console.log(newPrice)
      setPrice(newPrice);
    };



    useEffect(() => {
    
      if(error)
       {
          alert.error(error);
         dispatch(clearErrors());
       } 
       dispatch(getProduct(keyword,currentPage,price,category,ratings));


    },[dispatch,keyword,currentPage,price,category,alert,error,ratings]);
  
  
   let count=filterdProductCounts;
  
  
    return (
    <Fragment>
      {loading ? <Loader /> : (

        <Fragment>

          <Metadata title="Products" />

        <h2 className="productsHeading">Products</h2>

<div className="products">
  {products &&
    products.map((product) => (
      <ProductCard key={product._id} product={product} />
    ))}
</div>


  {keyword && <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            /> 


            
<Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>



            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
</div>}
 


           










{resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}

        



        </Fragment>





      )}

    </Fragment>
  );
}

export default Products;
