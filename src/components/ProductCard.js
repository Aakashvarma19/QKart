import { AddShoppingCartOutlined } from "@mui/icons-material";
// import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  // const useStyles = makeStyles({
  //   card: {
  //     maxWidth: 345,
  //     boxShadow: "0 5px 8px 0 rgba(0, 0, 0, 0.3)",
  //     backgroundColor: "#fafafa",
  //   },
  //   media: {
  //     height: 300,
  //   },
  // });
  return (
    <Card className="card">
        <CardMedia
        component="img"
        image={product.image}  
         />
      <CardContent>
        <Typography variant="body2">
        {product.name}
        <br />
       <b>${product.cost}</b>
      </Typography>
      <Rating name="read-only" defaultValue={product.rating} readOnly />
      <CardActions className=".card-actions">
        <Button fullWidth className="card-button" onClick={handleAddToCart} variant="contained"startIcon={<AddShoppingCartOutlined />}
        color="success">Add to Cart</Button>
      </CardActions>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
