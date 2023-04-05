import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const name=localStorage.getItem("username");
  const history=useHistory();
  return (
    <Box className="header">
    <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
    </Box>
 {children}
  {hasHiddenAuthButtons?(
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() =>{history.push("/");}}
        >
          Back to explore
        </Button>
    ):(name?(
      <Stack spacing={2} direction="row">
      <img src="avatar.png" alt={name}></img>
      <span className="username-text" style={{marginTop: 17}}>{name}</span>
      <Button
          style={{color:"#00A278"}}
          onClick={() =>{
            localStorage.clear();
            history.push("/");
            window.location.reload();
        }}
        >
          LOGOUT
        </Button>
      </Stack>
    ):(
        <Stack spacing={2} direction="row">
        <Button
          className="explore-button"
          onClick={()=>{history.push("/login")}}
        >
          LOGIN
        </Button>
        <Button
            className="button"
            variant="contained"
            onClick={()=>{history.push("/register")}}
          >
            REGISTER
          </Button>
          </Stack>)
    )
  }
    </Box>);
    
};

export default Header;
