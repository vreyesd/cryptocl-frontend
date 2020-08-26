import React from 'react'
import {Link} from "react-router-dom"

const Header = () => 
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
            <Link to="/" className="navbar-brand">CryptoCL</Link>
        </div>
    </nav>

export default Header