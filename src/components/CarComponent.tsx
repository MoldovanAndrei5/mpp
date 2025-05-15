import React from 'react'

interface CarComponentProps {
  id: number;
  photo: string;
  name: string;
  price: Number;
  onClickDelete: (id: number) => void;
  onClickUpdate: (id: number) => void;
}

const CarComponent: React.FC<{cars: CarComponentProps[]}> = ({cars}) => {
  let sortedCars = [...cars].sort((a, b) => a.price < b.price ? 1: -1);
  const third = Math.ceil(sortedCars.length / 3);
  const expensiveCars = sortedCars.slice(0, third);
  const averageCars = sortedCars.slice(third, third * 2);
  const cheapCars = sortedCars.slice(third * 2);
  return (
    <>
    {cars.map((car) => {
      let colorvar = "white";
      if (expensiveCars.includes(car)) colorvar = "green";
      if (averageCars.includes(car)) colorvar = "yellow";
      if (cheapCars.includes(car)) colorvar = "red";
      return (
        <div key={car.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '30px', paddingLeft: "20px", color: "white", textShadow: "1px 2px 2px rgba(0, 0, 0, 1)", border: '1px solid rgba(0, 0, 0, 0.5)', borderRadius:'5px', width: '700px', height:'400px', backgroundImage: `url(${car.photo})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
            <div style={{display: "flex", justifyContent: "center", alignItems: "flex-start", flexDirection: "column"}}>
              <div style={{height: "70%"}}></div>
              <h1 style={{color: colorvar}}>{car.name}</h1>
              <p>Price: {car.price.toString()}$</p>
            </div>
            <div style={{height: '100%', paddingBottom: '30px', marginRight: '20px', justifyContent: 'flex-end', display: "flex", flexDirection: "column"}}>
              <button onClick={() => car.onClickUpdate(car.id)}>Update</button>
              <button onClick = {() => car.onClickDelete(car.id)} style={{marginTop: '10px'}}>Delete</button>
            </div>
        </div>); 
    })}
    </>
  )
}

export default CarComponent