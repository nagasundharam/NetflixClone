import logo from "../../assets/assets/logo.png";
import search_icon from "../../assets/assets/search_icon.svg";
import bell_icon from "../../assets/assets/bell_icon.svg";
import profile_img from "../../assets/assets/profile_img.png";
import caret_icon from "../../assets/assets/caret_icon.svg";
import './Navbar.css';
const Navbar = () => {
    return ( <><div  className="navbar">
             <div className="navbar-left">
                <img src={logo} alt="" />
                <ul>
                    <li>Home</li>
                    <li>Tv Shows</li>
                    <li>Movies</li>
                    <li>News & Poppular</li>
                    <li> MyList </li>
                    <li>Browse by Language</li>
                </ul>
             </div>
             <div className="navbar-right">
                <img src={search_icon} alt="" className="icons" />
                <p>Children</p>
                <img src={bell_icon} alt=""  className="icons"/>
                <div className="navbar-profile">
                    <img src={profile_img} alt="" className="profile" />
                    <img src={caret_icon} alt="" />
                    <div className="dropdown">
                        <p>Sign Out of Netflix</p>
                    </div>
                </div>
                </div>
            </div></> );
}
 
export default Navbar;