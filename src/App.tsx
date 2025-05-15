import { useEffect, useState } from "react";
import CarComponent from "./components/CarComponent";
import Footer from "./components/Footer";
import FooterBanner from "./components/FooterBanner";
import Header from "./components/Header";
import SearchFilter from "./components/SearchFilter";
import "./Button.css";
import axios from "axios";
import SalesmanComponent from "./components/SalesmanComponent";

interface CarComponentProps {
  id: number;
  photo: string;
  name: string;
  price: number;
  onClickDelete: () => void;
  onClickUpdate: () => void;
}

interface Salesman {
  id: number;
  name: string;
  email: string;
  phone: string;
  onClickDelete: () => void;
  onClickUpdate: () => void;
}

function App() {
  const [filter, setFilter] = useState({ sortBy: "", priceRange: 150000, name: "" });
  const [cars, setCars] = useState<CarComponentProps[]>([]);
  const [editingCar, setEditingCar] = useState<CarComponentProps | null>(null);
  const [newCar, setNewCar] = useState<CarComponentProps | null>(null);
  const [maxPrice, setMaxPrice] = useState(150000);

  const loadCars = async () => {
    try {
      const { data } = await axios.get("/api/cars", { params: filter });
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        console.error("Error: Expected array, but got:", data);
      }
    } catch (err) {
      console.error("Error loading cars:", err);
      alert("Failed to load cars. Please check your connection or try again later.");
    }
  };

  useEffect(() => {
    console.log("Loading cars with filter:", filter);
    loadCars();
  }, [filter]);

  useEffect(() => {
    const fetchMaxPrice = async () => {
      try {
        const { data } = await axios.get("/api/cars", { params: { priceRange: 150000 } });
        if (Array.isArray(data)) {
          const prices = data.map((car: CarComponentProps) => car.price);
          const max = prices.length > 0 ? Math.max(...prices) : 0;
          setMaxPrice(max);
          console.log("Max price:", max);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (err) {
        console.error("Error fetching max price:", err);
      }
    };

    fetchMaxPrice();
  }, []);

  const mostExpensiveCar = cars.length > 0 ? Math.max(...cars.map(car => car.price)) : 150000;
  const averageCarPrice = cars.length > 0 ? Math.round(cars.reduce((sum, car) => sum + car.price, 0) / cars.length) : 0;
  const leastExpensiveCar = cars.length > 0 ? Math.min(...cars.map(car => car.price)) : 0;

  const [salesmen, setSalesmen] = useState<Salesman[]>([]);
  const [editingSalesman, setEditingSalesman] = useState<Salesman | null>(null);

  const loadSalesmen = async () => {
    try {
      const { data } = await axios.get("/api/salesmen");
      if (Array.isArray(data)) {
        setSalesmen(data);
      }
    } catch (err) {
      console.error("Failed to fetch salesmen:", err);
    }
  };

  useEffect(() => {
    loadSalesmen();
  }, []);

  return (
    <>
      <Header onAddCar={() => setNewCar({ id: 0, photo: "", name: "", price: 0, onClickDelete: () => {}, onClickUpdate: () => {} })} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "100vh", width: "99vw", paddingRight: '100px', paddingLeft: '100px' }}>
        <SearchFilter setFilter={setFilter} maxPrice={maxPrice} mostExpensiveCar={mostExpensiveCar} averageCarPrice={averageCarPrice} leastExpensiveCar={leastExpensiveCar} />
        <div className="cars" style={{ maxHeight: '90vh', overflowY: 'scroll' }}>
          {cars.length === 0 ? (
            <div>No cars available</div>
          ) : (
            <CarComponent cars={cars.map(car => ({
              ...car,
              onClickDelete: async () => {
                try {
                  await axios.delete(`/api/cars/${car.id}`);
                  await loadCars();
                } catch (err) {
                  console.error("Error deleting car:", err);
                }
              },
              onClickUpdate: () => setEditingCar(car),
            }))} />
          )}
          <SalesmanComponent
            salesmen={salesmen.map(s => ({
              ...s,
              onClickDelete: async () => {
                try {
                  await axios.delete(`/api/salesmen/${s.id}`);
                  await loadSalesmen();
                } catch (err) {
                  alert("Failed to delete salesman.");
                }
              },
              onClickUpdate: () => setEditingSalesman(s),
            }))}
          />
        </div>
      </div>
      {editingCar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column" }}>
            <h2>Update Car</h2>
            <input style={{ marginBottom: '10px' }} type="text" value={editingCar.name} onChange={(e) => setEditingCar({ ...editingCar, name: e.target.value })} />
            <input style={{ marginBottom: '10px' }} type="number" value={editingCar.price} onChange={(e) => setEditingCar({ ...editingCar, price: Number(e.target.value) })} />
            <input style={{ marginBottom: '10px' }} type="file" onChange={(e) => {
              if (e.target.files) {
                setEditingCar({ ...editingCar, photo: URL.createObjectURL(e.target.files[0]) });
              }
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button onClick={async () => {
                try {
                  await axios.put(`/api/cars/${editingCar.id}`, editingCar);
                  await loadCars();
                  setEditingCar(null);
                } catch (err) {
                  alert("Invalid input. Please fill in all fields correctly.");
                }
              }}>Save</button>
              <button onClick={() => setEditingCar(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {newCar && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '5px', display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column" }}>
            <h2>Add New Car</h2>
            <input style={{ marginBottom: '10px' }} type="text" placeholder="Name" value={newCar.name} onChange={(e) => setNewCar({ ...newCar, name: e.target.value })} />
            <input style={{ marginBottom: '10px' }} type="number" placeholder="Price" value={newCar.price} onChange={(e) => setNewCar({ ...newCar, price: Number(e.target.value) })} />
            <input style={{ marginBottom: '10px' }} type="file" onChange={(e) => {
              if (e.target.files) {
                setNewCar({ ...newCar, photo: URL.createObjectURL(e.target.files[0]) });
              }
            }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <button onClick={async () => {
                try {
                  await axios.post(`/api/cars`, newCar);
                  await loadCars();
                  setNewCar(null);
                } catch (err) {
                  alert("Invalid input. Please fill in all fields correctly.");
                }
              }}>Add</button>
              <button onClick={() => setNewCar(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {editingSalesman && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '5px',
            display: "flex", flexDirection: "column", width: "300px"
          }}>
            <h2>Update Salesman</h2>
            <input style={{ marginBottom: '10px' }} type="text" value={editingSalesman.name} onChange={(e) => setEditingSalesman({ ...editingSalesman, name: e.target.value })} />
            <input style={{ marginBottom: '10px' }} type="text" value={editingSalesman.email} onChange={(e) => setEditingSalesman({ ...editingSalesman, email: e.target.value })} />
            <input style={{ marginBottom: '10px' }} type="text" value={editingSalesman.phone} onChange={(e) => setEditingSalesman({ ...editingSalesman, phone: e.target.value })} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button onClick={async () => {
                try {
                  await axios.put(`/api/salesmen/${editingSalesman.id}`, editingSalesman);
                  await loadSalesmen();
                  setEditingSalesman(null);
                } catch (err) {
                  alert("Failed to update salesman.");
                }
              }}>Save</button>
              <button onClick={() => setEditingSalesman(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
      <FooterBanner />
    </>
  );
}

export default App;
