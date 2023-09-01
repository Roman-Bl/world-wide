import { NavLink } from "react-router-dom";
import style from "./PageNav.module.css";
import Logo from "./Logo";
import { useAuth } from "../context/FakeAuthContext";
import User from "./User";

function PageNav() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className={style.nav}>
      <Logo />
      <ul>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          {isAuthenticated ? (
            <NavLink to="/" className={style.ctaLink} onClick={logout}>
              Logout
            </NavLink>
          ) : (
            <NavLink to="/login" className={style.ctaLink}>
              Login
            </NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
