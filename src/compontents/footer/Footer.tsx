import "./Footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (

      <div className={"footer"}>
        <div className=" bg-light py-4">
          <div className="container text-center">
            <div className={"footer-row row text-center"}>
              <div className={" col-md-6 text-muted"}>
                <Link to="/impressum">
                  <li>Impressum</li>
                </Link>
              </div>

              <div className={"col-md-6 text-muted"}>
                <Link to="/datenschutz">
                  <li>Datenschutz</li>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Footer;
