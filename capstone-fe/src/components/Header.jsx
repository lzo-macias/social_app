import React from "react";
import { Link } from "react-router-dom"

function Header() {
  return (
    <nav>
        <Link to ="/"> Home </Link>
        <Link to ="/myprofile"> Profile </Link>
        <Link to ="/communities"> Communities </Link>
        <Link to ="/messages"> Messages </Link>
    </nav>
  )
}

export default Header;
