import BurgerMenu from "../menu/BurgerMenu.tsx";
import "./Impressum.scss";

const Impressum = () => {
  return (
    <div className={"imprint"}>

      <div className={"Calendar-header"}>
        <img className={"Image"} src={"/image_impressum.png"} alt={"header image calendar page"} />
      </div>
      <div className={"Header-space"}></div>

      <BurgerMenu />
      <div className={"starterTextBox"}>
        <div className={"starterTextHeader"}>Impressum</div>
        <div className={"starterText"}>
          <div className={"headline"}>Betreiber der Website:</div>
          Dimitrios Kakoulis
          <br/>
          <br/>
          <div className={"headline"}>Kontaktdaten:</div>
          info@saalzentrum-duesseldorf.de
          <br/>
          Langenberger Str. 5 40233 Düsseldorf
          <br/>
          <br/>
          <div className={"headline"}>Zuständige Aufsichtsbehörde:</div>
          Stadt Düsseldorf
          <br/>Amt für öffentliche Ordnung und Verbraucherschutz
          <br/>
          Marktplatz 1 40213 Düsseldorf
          <br/>
          <br/>
          Die Website ist nicht umsatzsteuerpflichtig.
          <br/>
          <br/>
          <div className={"headline"}>Urheberrecht und Marken:</div>
          Alle Inhalte dieser
          Website, insbesondere Texte, Bilder und Grafiken, sind
          urheberrechtlich geschützt. Die Verwendung von Inhalten dieser Website
          bedarf der ausdrücklichen Zustimmung des Betreibers.
          <br/>
          Gegebenenfalls verwendete Marken sind Eigentum der jeweiligen Markeninhaber.
          Streitschlichtung: Die Europäische Kommission stellt eine Plattform
          zur Online-Streitbeilegung (OS) bereit, die Sie unter
          https://ec.europa.eu/consumers/odr/ finden. Wir sind nicht bereit und
          nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </div>
      </div>
    </div>
  );
};

export default Impressum;
