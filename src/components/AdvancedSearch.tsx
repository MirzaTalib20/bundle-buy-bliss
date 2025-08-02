// Advanced search with filters
const AdvancedSearch = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select className="border rounded-md p-2">
          <option>Price Range</option>
          <option>₹0 - ₹100</option>
          <option>₹100 - ₹500</option>
          <option>₹500+</option>
        </select>
        
        <select className="border rounded-md p-2">
          <option>Rating</option>
          <option>4+ Stars</option>
          <option>3+ Stars</option>
        </select>
        
        <select className="border rounded-md p-2">
          <option>Sort By</option>
          <option>Newest</option>
          <option>Best Selling</option>
          <option>Price: Low to High</option>
        </select>
      </div>
    </div>
  );
};