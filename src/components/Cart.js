import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  const cartItems = [];
  cartData.forEach((cartItem) => {
    const product = productsData.find((p) => p._id === cartItem.productId);
    if (product) {
      cartItems.push({
        name: product.name,
        qty: cartItem.qty,
        cost: product.cost,
        category: product.category,
        rating: product.rating,
        image: product.image,
        id: product._id,
      });
    }
  });
  return cartItems;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let total = 0;
  items.forEach((item) => {
    total += item.cost * item.qty;
  });
  return total;
};

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */

export const getTotalItems = (items = []) => {
  return items.length;
};

const ItemQuantity = ({ value, handleAdd, handleDelete }) => {
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="success" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
      </Box>
      <IconButton size="small" color="success" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */
const Cart = ({ products, items = [], handleQuantity, isReadOnly = false }) => {
  let token = localStorage.getItem("token");
  const history = useHistory();

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      {isReadOnly ? (
        <>
          <Box className="cart">
            {items.map((item, id) => {
              return (
                <Box
                  display="flex"
                  alignItems="flex-start"
                  padding="1rem"
                  key={id}
                >
                  <Box className="image-container">
                    <img
                      src={item.image}
                      alt={item.id}
                      width="100%"
                      height="100%"
                    />
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    height="6rem"
                    paddingX="1rem"
                  >
                    <div>{item.name}</div>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box fontSize="12px">Qty: {item.qty}</Box>
                      <Box padding="0.5rem" fontWeight="800" fontSize="12px">
                        ${item.cost}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
            <Box
              padding="1rem"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box color="#3C3C3C" alignSelf="center">
                Order total
              </Box>
              <Box
                color="#3C3C3C"
                fontWeight="700"
                fontSize="1.5rem"
                alignSelf="center"
                data-testid="cart-total"
              >
                ${getTotalCartValue(items)}
              </Box>
            </Box>
          </Box>
          <Box className="cart" justifyContent="flex-start">
            <Box paddingLeft="1rem" display="flex" justifyContent="flex-start">
              <h2>Order Details</h2>
            </Box>
            <Box padding="1rem" display="flex" justifyContent="space-between">
              <span>Products</span> <span>{getTotalItems(items)}</span>
            </Box>
            <Box padding="1rem" display="flex" justifyContent="space-between">
              <span>Subtotal</span> <span>${getTotalCartValue(items)}</span>
            </Box>
            <Box padding="1rem" display="flex" justifyContent="space-between">
              <span>Shipping Charges</span> <span>$0</span>
            </Box>
            <Box padding="1rem" display="flex" justifyContent="space-between">
              <span style={{ fontSize: 18, fontWeight: 800 }}>Total</span>
              <span style={{ fontSize: 18, fontWeight: 800 }}>
                ${getTotalCartValue(items)}
              </span>
            </Box>
          </Box>
        </>
      ) : (
        <Box className="cart">
          {items.map((item, id) => {
            return (
              <Box
                display="flex"
                alignItems="flex-start"
                padding="1rem"
                key={id}
              >
                <Box className="image-container">
                  <img
                    src={item.image}
                    alt={item.id}
                    width="100%"
                    height="100%"
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{item.name}</div>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <ItemQuantity
                      value={item.qty}
                      handleAdd={() =>
                        handleQuantity(
                          token,
                          items,
                          products,
                          item.id,
                          item.qty + 1,
                          { preventDuplicate: false }
                        )
                      }
                      handleDelete={() =>
                        handleQuantity(
                          token,
                          items,
                          products,
                          item.id,
                          item.qty - 1,
                          { preventDuplicate: false }
                        )
                      }
                    />
                    <Box padding="0.5rem" fontWeight="700">
                      ${item.cost}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="success"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() =>
                history.push({
                  pathname: "/checkout",
                  state: { items: items, products: products },
                })
              }
            >
              Checkout
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Cart;
