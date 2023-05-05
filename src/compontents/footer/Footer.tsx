import './Footer.scss'

function Footer() {

    return (
        <div className={'footer'}>
          <div className="bg-light py-4">
            <div className="container text-center">

              <div className={"footer-row row text-center"}>
              <div className={"col-md-6 text-muted"}>
              <a href={'#'}>Impressum</a>
              </div>

                <div className={"col-md-6 text-muted"}>
              <a  href={'#'}>Datenschutz</a>
              </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Footer