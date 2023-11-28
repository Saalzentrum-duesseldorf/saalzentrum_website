import "./BurgerMenu.scss";
import { Link } from 'react-router-dom';

function BurgerMenu() {
  return (
    <div className={'container center burgerMenu'}>
      <nav role="navigation">
        <div id="menuToggle">
          <input type="checkbox" />

          <span></span>
          <span></span>
          <span></span>

          <ul id="menu">
            <Link to="/">
              <li>Startseite</li>
            </Link>
            <Link to="/calendar">
              <li>Kalender</li>
            </Link>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default BurgerMenu;
