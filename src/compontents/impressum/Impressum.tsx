import BurgerMenu from "../menu/BurgerMenu.tsx";
import "./Impressum.scss";

const Impressum = () => {
  return (
    <div className={"imprint"}>
    <BurgerMenu />
      <div className={"starterTextBox"}>
        <div className={"starterTextHeader"}>
          Impressum
        </div>
        <div className={"starterText"}>
          Betreiber der Website: Dimitrios Kakoulis / Julian Hartz Langenberger Str.
          5 40233 Düsseldorf Kontaktdaten: E-Mail: info@saalzentrum-duesseldorf.de
          Zuständige Aufsichtsbehörde: Stadt Düsseldorf Amt für öffentliche Ordnung
          und Verbraucherschutz Marktplatz 1 40213 Düsseldorf Die Website ist nicht
          umsatzsteuerpflichtig. Urheberrecht und Marken: Alle Inhalte dieser
          Website, insbesondere Texte, Bilder und Grafiken, sind urheberrechtlich
          geschützt. Die Verwendung von Inhalten dieser Website bedarf der
          ausdrücklichen Zustimmung des Betreibers. Gegebenenfalls verwendete Marken
          sind Eigentum der jeweiligen Markeninhaber. Streitschlichtung: Die
          Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung
          (OS) bereit, die Sie unter https://ec.europa.eu/consumers/odr/ finden. Wir
          sind nicht bereit und nicht verpflichtet, an einem
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </div>
      </div>
    </div>
  )
}

export default Impressum
