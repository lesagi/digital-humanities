import bguLogo from "../BGU-Logo.png";
import mojLogo from "../moj-logo.png";
import "./Header.css";
const Header = () => {
  return (
    <header>
      <div id="img-container">
        <img src={bguLogo} />
      </div>
      <div id="img-container">
        <img src={mojLogo} />
      </div>
    </header>
  );
};

export default Header;
