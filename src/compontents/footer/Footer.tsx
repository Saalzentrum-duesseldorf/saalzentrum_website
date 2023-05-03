import './Footer.scss'

function Footer() {

    return (
        <div className={'footer'}>
          <div className="bg-light py-4">
            <div className="container text-center">
              <p className="text-muted mb-0 py-2">© 2023 SaalzentrumDuesseldorf All rights reserved.</p>

              <div className={"footer-row row text-center"}>
              <div className={"col-md-6 text-muted"}>
              <a href={'https://www.jw.org'}>Impressum</a>
              </div>

                <div className={"col-md-6 text-muted"}>
              <a  href={'https://www.jw.org'}>Datenschutz</a>
              </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Footer