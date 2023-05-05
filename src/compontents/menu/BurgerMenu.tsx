import "./BurgerMenu.scss";

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
            <a href="#">
              <li>Startseite</li>
            </a>
            <a href="#">
              <li>Kalender</li>
            </a>
            <a href="#">
              <li>Tickets</li>
            </a>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default BurgerMenu;
