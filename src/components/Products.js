import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart, { generateCartItemsFrom } from "./Cart";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [loading, setloading] = useState(false);
  const [products, setProduct] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [value, setvalue] = useState("");
  const [cartData, setCartData] = useState([]);
  const token = localStorage.getItem("token");
  const { enqueueSnackbar } = useSnackbar();
  // const [productData, setProductData] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    setloading(true);
    try {
      const response = await axios.get(config.endpoint + "/products");
      console.log(response.data);
      setProduct(response.data);
      setloading(false);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    // console.log(config.endpoint + "/GET/products/search?value="+text);
    try {
      const response = await axios.get(
        config.endpoint + "/products/search?value=" + text
      );
      setProduct(response.data);
    } catch (err) {
      if (err.response.status === 404) setEmpty(true);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   *
   */
  const [debounceTimeout, setdebounceTimeout] = useState(500);
  const debounceSearch = (event, debounceTimeout) => {
    setvalue(event.target.value);
  };
  useEffect(() => {
    performAPICall();
    fetchCart(token);
  }, []);
  useEffect(() => {
    if (value) {
      if (debounceTimeout !== 0) {
        clearTimeout(debounceTimeout);
      }
      let newTimeout = setTimeout(() => performSearch(value), 500);
      setdebounceTimeout(newTimeout);
    }
  }, [value]);

  const fetchCart = async (token) => {
    if (!token) return;
    try {
      let response = await axios.get(config.endpoint + "/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          { variant: "error" }
        );
      }

      return null;
    }
    // finally{
    //   console.log(cartData);
    // }
  };
  const isItemInCart = (items, productId) => {
    return items.some((item) => item.productId === productId);
  };
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (token) {
      if (isItemInCart(items, productId)) {
        enqueueSnackbar(
          "Item already in cart. Use the cart sidebar to update quantity or remove item.",
          { variant: "warning" }
        );
      } else {
        try {
          const response = await axios.post(
            config.endpoint + "/cart",
            { productId: productId, qty: qty },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCartData(response.data);
        } catch (e) {
          enqueueSnackbar("Something went wrong", { variant: "error" });
          return null;
        }
      }
    } else {
      enqueueSnackbar("Login to add an item to the Cart", {
        variant: "warning",
      });
    }
  };

  return (
    <div>
      <Header
        children={
          <Box width={350}>
            <TextField
              className="search-desktop search"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              onChange={(event) => debounceSearch(event, 500)}
              placeholder="Search for items/categories"
              name="search"
            />
          </Box>
        }
      />
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container>
        <Grid item className="product-grid" xs={12} md={token ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India's <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>

          {loading ? (
            <Box className="loading">
              <CircularProgress /> <p>Loading Products</p>{" "}
            </Box>
          ) : (
            <div>
              {empty ? (
                <Box className="loading">
                  <SentimentDissatisfied />
                  <h4>No Products Found</h4>
                </Box>
              ) : (
                <div style={{ margin: "10px" }}>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                  >
                    {products.map((item, id) => (
                      <Grid item xs={2} md={3} key={id}>
                        <ProductCard
                          product={item}
                          handleAddToCart={() =>
                            addToCart(token, cartData, products, item._id, 1, {
                              preventDuplicate: false,
                            })
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </div>
              )}
            </div>
          )}
        </Grid>
        {token && (
          <Grid item xs={12} md={3} sx={{ bgcolor: "#E9F5E1" }}>
            <Cart
              products={products}
              items={generateCartItemsFrom(cartData, products)}
              handleQuantity={addToCart}
            />
          </Grid>
        )}
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
