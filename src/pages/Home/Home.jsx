import Navbar from "../Navbar/Navbar";

import './Home.css';
import hero_banner from '../../assets/assets/hero_banner.jpg';


const Home = () => {
    return ( <>
  
    <Navbar/>
    <div className="hero">
        <img src={hero_banner} alt="" />
    </div>
   
    </> );
}
 
export default Home;