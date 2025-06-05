import logo from "../../assets/assets/logo.png";

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
             <div className="navbar-right"></div></div></> );
}
 
export default Navbar;