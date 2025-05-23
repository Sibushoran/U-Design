import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom"; // ✅ Add this line
import { CartContext } from "../context/CartContext";
import "./Shop.css";

const Shop = () => {
  const { addToCart, addToWishlist } = useContext(CartContext);
   const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const searchQuery = searchParams.get("search");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [statusFilters, setStatusFilters] = useState(["All"]);
  const [priceRange, setPriceRange] = useState([40, 1500]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);


  const [promoBanners, setPromoBanners] = useState([]);
  const [promo50Off, setPromo50Off] = useState({});
  const [categories, setCategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");


  const ratingRanges = [
    { label: "4 to 5", min: 4, max: 5 },
    { label: "3 to 4", min: 3, max: 4 },
    { label: "2 to 3", min: 2, max: 3 },
    { label: "1 to 2", min: 1, max: 2 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const data = res.data;
        const allProducts = data.products || [];

        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setPromoBanners(data.promoBanners || []);
        setPromo50Off(data.promo50Off || {});
        setCategories(data.categories || []);
        setTrendingProducts(data.trendingProducts || []);
        setAllBrands(data.brands || []);
        setAllColors(data.colors || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const productsPerPage = 9;
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const changePage = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter Handlers
  const handleStatusChange = (e, status) => {
    const isChecked = e.target.checked;
    if (status === "All") {
      setStatusFilters(["All"]);
    } else {
      let updated = isChecked
        ? [...statusFilters.filter((s) => s !== "All"), status]
        : statusFilters.filter((s) => s !== status);
      if (updated.length === 0) updated = ["All"];
      setStatusFilters(updated);
    }
  };

  const handleBrandChange = (e, brand) => {
    const isChecked = e.target.checked;
    setSelectedBrands((prev) =>
      isChecked ? [...prev, brand] : prev.filter((b) => b !== brand)
    );
  };

  const handleRatingRangeChange = (e, range) => {
    const isChecked = e.target.checked;
    setSelectedRatings((prev) =>
      isChecked
        ? [...prev, range]
        : prev.filter(
            (r) => !(r.min === range.min && r.max === range.max)
          )
    );
  };

  const handleColorChange = (e, color) => {
    const isChecked = e.target.checked;
    setSelectedColors((prev) =>
      isChecked ? [...prev, color] : prev.filter((c) => c !== color)
    );
  };

  const handleCategoryChange = (e, category) => {
    const isChecked = e.target.checked;
    setSelectedCategories((prev) =>
      isChecked ? [...prev, category] : prev.filter((c) => c !== category)
    );
  };
 useEffect(() => {
  const fetchSearchResults = async () => {
    if (searchQuery) {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/search?q=${searchQuery}`);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Search API error:", error);
      }
    }
  };

  fetchSearchResults();
}, [searchQuery]);


   
  const applyFilters = () => {
    let filtered = [...products];

    // Price Filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Status Filter
    if (!statusFilters.includes("All")) {
      filtered = filtered.filter((p) => statusFilters.includes(p.tag));
    }

    // Brand Filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Rating Filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((p) =>
        selectedRatings.some((range) => p.rating >= range.min && p.rating <= range.max)
      );
    }

    // Color Filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter((p) => selectedColors.includes(p.color));
    }

    // Category Filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) =>
        selectedCategories.includes(p.category)
      );
    }
    
    // Sorting
      if (sortOrder === "lowToHigh") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortOrder === "highToLow") {
        filtered.sort((a, b) => b.price - a.price);
      }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  return (
    <div className="shop-page">
      {/* Banner */}
      <div className='about-content'>
        <div className='about-card'>
          <img src="/src/assets/about-1.jpg" alt="about" />
          <h2>Shop</h2> 
          <p>Home &gt; Shop</p>

          
        </div>
      </div>
      <div className="filter-toggle-bar">
  <button className="toggle-filters-btn" onClick={() => setShowFilters(!showFilters)}>
    {showFilters ? "Hide Filters" : "Show Filters"}
  </button>
</div>

      <div className="shop-content container">
        {showFilters && (
  <aside className="filter-panel">
          <h3>Product Status</h3>
          {["All", "Featured", "On Sale"].map((status, idx) => (
            <label key={idx}>
              <input
                type="checkbox"
                checked={statusFilters.includes(status)}
                onChange={(e) => handleStatusChange(e, status)}
              />{" "}
              {status}
            </label>
          ))}

          <hr />

          <h3>Filter by Price</h3>
          <input
            type="range"
            min="40"
            max="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([40, Number(e.target.value)])}
          />
          <p>Price: ${priceRange[0]} — ${priceRange[1]}</p>
          <button className="filter-btn" onClick={applyFilters}>
            Apply Filters
          </button>

          <hr />

          <h3>Product Brands</h3>
          {allBrands.map((brand, i) => (
            <label key={i}>
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleBrandChange(e, brand)}
              />{" "}
              {brand}
            </label>
          ))}

          <hr />

          <h3>Filter by Rating</h3>
          {ratingRanges.map((range, idx) => (
            <label key={idx} className="rating-option">
              <input
                type="checkbox"
                checked={selectedRatings.some(
                  (r) => r.min === range.min && r.max === range.max
                )}
                onChange={(e) => handleRatingRangeChange(e, range)}
              />
              <span className="star-icon">★</span> {range.label}
            </label>
          ))}

          <hr />

          

         
          <h3>Filter by Category</h3>
          {categories.map((category, idx) => (
            <label key={idx}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={(e) => handleCategoryChange(e, category)}
              />{" "}
              {category}
            </label>
          ))}
        </aside>
        )}

        {/* Main Shop Area */}
        <main className="shop-main">
          <div className="shop-toolbar">
          <div className="sort-dropdown">
              <label>Sort By:</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  applyFilters(); // Re-apply filters and sorting
                }}
              >
                <option value="default">Default sorting</option>
                <option value="lowToHigh">Price low to high</option>
                <option value="highToLow">Price high to low</option>
              </select>
            </div>

          </div>
          
          {/* Product Grid */}
          <section className="product-grid">
            {currentProducts.length === 0 ? (
              <p>No products found matching your filters.</p>
            ) : (
              currentProducts.map((product) => (
                <div key={product._id} className="product-card">
                  {product.tag && (
                    <span className={`product-tag ${product.tag.toLowerCase()}`}>
                      {product.tag}
                    </span>
                  )}
                  <img
                    src={product.img ? `http://localhost:5000/uploads/${product.img}` : product.image}
                    alt={product.title || product.name}
                  />

                  <p className="category">{product.category}</p>
                  <h4>{product.title || product.name}</h4>
                  <div className="price-section">
                    <p className="price">${product.price}</p>
                    {product.original && (
                      <span className="old-price">${product.original}</span>
                    )}
                  </div>
                  <div className="card-actions">
                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                    <button onClick={() => addToWishlist(product)}>♥</button>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => changePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
