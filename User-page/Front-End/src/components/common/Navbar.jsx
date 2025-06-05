import React, { useContext, useState, Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt,
  FaTags,
  FaSearch,
  FaFacebookF,
  FaLinkedinIn,
  FaBars,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";
import { CartContext } from "../../context/CartContext";

const Navbar = () => {
  const { cartItems, wishlistItems } = useContext(CartContext);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <Fragment>
      {/* Top Bar */}
      <div className="bg-dark text-white small py-2 px-3 d-none d-md-flex justify-content-between align-items-center">
        <div>
          <FaEnvelope className="me-2" />
          support@d-themes.com
          <FaClock className="ms-4 me-2" />
          Mon - Sat 8:00 - 18:00, Sunday Closed
        </div>
        <div className="d-flex align-items-center gap-3">
          <span>USD ▾</span>
          <span>ENG ▾</span>
          <Link to="/login" className="text-white text-decoration-none">
            <FaUser className="me-1" /> Sign In / Register
          </Link>
          <FaFacebookF className="text-white" />
          <FaLinkedinIn className="text-white" />
        </div>
      </div>

      {/* Main Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between px-3 py-3 bg-white shadow-sm">
        <Link to="/" className="text-decoration-none">
          <h2 className="shopnest-logo mb-0">
            Shop<span>Nest</span>
          </h2>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="d-md-none btn border"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <FaBars />
        </button>

        {/* Search bar */}
        <form
          className="premium-search-bar mx-auto d-none d-md-flex"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            className="premium-search-input"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="premium-search-btn">
            <FaSearch />
          </button>
        </form>

        {/* Right icons */}
        <div className="d-flex align-items-center gap-3 mt-3 mt-md-0">
          <div className="d-none d-md-flex align-items-center">
            <FaPhoneAlt className="text-dark me-2" size={18} />
            <div>
              <small className="text-muted">Call Us</small>
              <div className="fw-semibold">0(800) 123-456</div>
            </div>
          </div>
          <Link to="/wishlist" className="text-dark position-relative">
            <FaHeart size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge bg-dark rounded-pill">
              {wishlistItems.length}
            </span>
          </Link>
          <Link to="/cart" className="text-dark position-relative">
            <FaShoppingCart size={20} />
            <span className="position-absolute top-0 start-100 translate-middle badge bg-dark rounded-pill">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`navbar navbar-expand-md bg-primary px-4 py-2`}>
        <div className="container-fluid p-0">
          <div className="collapse navbar-collapse d-md-flex justify-content-between">
            <ul className="navbar-nav flex-column flex-md-row align-items-start align-items-md-center gap-3 m-0">
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle text-dark bg-white rounded-pill px-3 py-2 d-flex align-items-center"
                  data-bs-toggle="dropdown"
                  role="button"
                >
                  <i className="fas fa-bars me-2"></i> All Categories
                </span>
                <ul className="dropdown-menu mt-2">
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <li key={index}>
                        <Link
                          to={`/shop?category=${encodeURIComponent(category)}`}
                          className="dropdown-item"
                        >
                          <i className="fas fa-cogs me-2"></i> {category}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-muted">Loading...</li>
                  )}
                </ul>
              </li>
              <li>
                <Link to="/" className="nav-link text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="nav-link text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className="nav-link text-white">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/news" className="nav-link text-white">
                  News
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="nav-link text-white d-flex align-items-center"
                >
                  <FaMapMarkerAlt className="me-1" /> Track Order
                </Link>
              </li>
              <li>
                <Link
                  to="/deals"
                  className="nav-link text-white d-flex align-items-center"
                >
                  <FaTags className="me-1" /> Daily Deals
                </Link>
              </li>
            </ul>
            <Link
              to="/login"
              className="btn btn-outline-light rounded-pill mt-3 mt-md-0"
            >
              <FaUser className="me-2" /> Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="bg-primary d-md-none text-white px-4 py-3">
          <form onSubmit={handleSearch} className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-light w-100" type="submit">
              Search
            </button>
          </form>
          <ul className="list-unstyled">
            <li>
              <Link to="/" className="text-white d-block py-1">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-white d-block py-1">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-white d-block py-1">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/news" className="text-white d-block py-1">
                News
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-white d-block py-1">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </Fragment>
  );
};

export default Navbar;
