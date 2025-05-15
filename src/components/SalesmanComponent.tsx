import React from "react";

interface Salesman {
    id: number;
    name: string;
    email: string;
    phone: string;
    onClickDelete: () => void;
    onClickUpdate: () => void;
  }

  const SalesmanComponent: React.FC<{ salesmen: Salesman[] }> = ({ salesmen }) => (
    <div>
      <h2>Salesmen</h2>
      {salesmen.map((s) => (
        <div key={s.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
          <p><strong>{s.name}</strong></p>
          <p>Email: {s.email}</p>
          <p>Phone: {s.phone}</p>
          <button onClick={s.onClickUpdate}>Update</button>
          <button onClick={s.onClickDelete} style={{ marginLeft: '10px' }}>Delete</button>
        </div>
      ))}
    </div>
  );
  
  export default SalesmanComponent;