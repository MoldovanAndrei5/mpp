const Header = ({ onAddCar }: { onAddCar: () => void }) => {
  return (
    <div style={{display: 'flex', justifyContent: 'space-between', height: '15vh', alignItems: 'center'}}>
        <div className='left' style={{display: 'flex', marginLeft: '100px', fontSize: '24px'}}>
            <p style={{marginRight: '100px'}}>ProCars</p>
            <p>Models</p>
        </div>
        <div style={{display: 'flex'}}>
          <button onClick={onAddCar} style={{marginRight: '50px'}}>Add car</button>
          <div className='right'>
              <img src="src/assets/user-icon-svgrepo-com.svg" style={{height: '40px', width: '70px', marginRight: '100px'}}></img>
          </div>
        </div>
    </div>
  )
}

export default Header