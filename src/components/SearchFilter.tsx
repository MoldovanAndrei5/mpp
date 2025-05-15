import { useState } from "react";

interface FilterProps {
  setFilter: React.Dispatch<React.SetStateAction<{ sortBy: string; priceRange: number; name: string }>>;
  maxPrice: number;
  mostExpensiveCar: number;
  averageCarPrice: number;
  leastExpensiveCar: number;
}

const SearchFilter: React.FC<FilterProps> = ({ setFilter, maxPrice, mostExpensiveCar, averageCarPrice, leastExpensiveCar }) => {
  const [price, setPrice] = useState(maxPrice);

  return (
    <div style={{height: '90vh', borderRadius: '5px', width: '25vw', backgroundColor: 'rgb(194, 242, 255)', display: "flex", flexDirection: "column", paddingTop: "20px"}}>
        <p style={{fontSize: '34px', fontWeight: 'bold', marginLeft: '10px'}}>Sort by</p>
        <form style={{marginLeft: '20px', marginBottom: '20px', fontSize: '20px'}}>
        <label>
          <input type='radio' name="sort" value="price_asc" onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))} />
          Price ascending
        </label><br />
        <label>
          <input type='radio' name="sort" value="price_desc" onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))} />
          Price descending
        </label><br />
        <label>
          <input type='radio' name="sort" value="name_asc" onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))} />
          Name ascending (A-Z)
        </label><br />
        <label>
          <input type='radio' name="sort" value="name_desc" onChange={(e) => setFilter(prev => ({ ...prev, sortBy: e.target.value }))} />
          Name descending (Z-A)
        </label><br />
      </form>
      <p style={{fontSize: '34px', fontWeight: 'bold', marginLeft: '10px'}}>Filter by</p>
      <label style={{marginLeft: '20px', marginBottom: '10px', fontSize: '20px'}}>Price range</label>
    
      <div style={{ position: "relative", width: "70%", marginLeft: '20px'}}>
        <div style={{ position: "absolute", left: "0%", fontSize: "14px", bottom: 15 }}>0</div>
        <div style={{ position: "absolute", right: "0%", fontSize: "14px", bottom: 15 }}>{price}</div>
        <input type="range" min="0" max={maxPrice} value={price} onChange={(e) => {
            const newPrice = Number(e.target.value);
            setPrice(newPrice);
            setFilter(prev => ({ ...prev, priceRange: newPrice }));
          }}
          style={{
            width: "100%",
            appearance: "none",
            background: "gray",
            height: "4px",
            borderRadius: "5px",
            outline: "none",
            cursor: "pointer",
            marginTop: "20px",
          }} />
        <style>
          {`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              background: blue;
              border-radius: 50%;
              cursor: pointer;
            }
          `}
        </style>
      </div>
      <label style={{marginLeft: '20px', marginTop: '20px', marginBottom: '10px', fontSize: '20px'}} htmlFor="name">Car name</label>
      <input style={{width: '70%', marginLeft: '20px'}} type='text' id='name' onChange={(e) => setFilter(prevFilter => ({ ...prevFilter, name: e.target.value }))} />
      <div style={{backgroundColor: "white", borderRadius: "30px", height: "100%", marginTop: "20px", marginLeft: "20px", marginRight: "20px", marginBottom: "20px"}}>
        <p style={{textAlign: "center", fontSize: "20px", fontWeight: "bold"}}> Car statistics</p>
        <div style={{paddingLeft: "10px"}}>
          <p>The most expensive car available: ${mostExpensiveCar}</p>
          <p>The average price of a car available: ${averageCarPrice}</p>
          <p>The least expensive car available: ${leastExpensiveCar}</p>
        </div>
      </div>
    </div>
  )
}

export default SearchFilter