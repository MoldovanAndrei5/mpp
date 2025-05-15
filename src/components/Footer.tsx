const Footer = () => {
  return (
    <div style={{backgroundColor: 'rgb(240, 240, 240)', display: "flex", justifyContent: "space-between", alignItems: "center", padding: "50px", position: 'relative'}}>
        <div className="left" style={{display: "flex"}}>
            <div className="first" style={{marginRight: "100px"}}>
                <p style={{fontWeight: 'bold'}}>Contact</p>
                <p>Contact us</p>
            </div>
            <div className="second">
                <p style={{fontWeight: 'bold'}}>Legal</p>
                <p>Company data</p>
                <p>Terms and conditions</p>
                <p>Customer protection</p>
            </div>
        </div>
        <div className="right" style={{display: "flex", position: 'absolute', right: 0, bottom: 10}}>
            <img src="src/assets/facebook.svg" style={{width: '50px', height: '50px'}}></img>
            <img src="src/assets/linkedin.svg" style={{width: '50px', height: '50px', marginRight: '10px'}}></img>
            <img src="src/assets/youtube.svg" style={{width: '50px', height: '50px', marginRight: '10px'}}></img>
            <img src="src/assets/instagram.svg" style={{width: '50px', height: '50px', marginRight: '10px'}}></img>
        </div>
        
    </div>
  )
}

export default Footer