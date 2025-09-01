import "./BurgerMenu.scss";
import { Link } from 'react-router-dom';
import { showCollectorDialog } from "../../utils.ts";

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
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
            {/* @ts-ignore*/}
            <Link onClick={showCollectorDialog}>
              <li>Tickets</li>
            </Link>
          </ul>
        </div>
      </nav>

    </div>

  );
}

export default BurgerMenu;
