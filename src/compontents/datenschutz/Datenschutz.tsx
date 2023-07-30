import Header from "../header/Header.tsx";
import BurgerMenu from "../menu/BurgerMenu.tsx";

const Datenschutz = () => {
  return (
    <div>
      <Header />
      <BurgerMenu />
      <div>
        Wir nehmen den Schutz Ihrer personenbezogenen Daten sehr ernst und
        halten uns strikt an die Regeln der Datenschutzgesetze. Die Nutzung
        unserer Website ist in der Regel ohne Angabe personenbezogener Daten
        möglich. Ausnahmen hiervon können sich ergeben, wenn Sie die Funktion
        "Ticket eröffnen" nutzen, bei der der JIRA Issue Collector von Atlassian
        verwendet wird. Dabei können personenbezogene Daten wie Name und
        E-Mail-Adresse erhoben und verarbeitet werden. Für diese Verarbeitung
        ist Atlassian verantwortlich. Bitte beachten Sie in diesem Zusammenhang
        die Datenschutzrichtlinie von Atlassian, die unter folgendem Link
        abrufbar ist:
        https://www.atlassian.com/de/legal/privacy-policy#what-this-policy-covers.
        Beim Aufruf unserer Website werden durch den Webserver automatisch
        verschiedene Informationen erfasst, die Ihr Browser übermittelt. Diese
        Informationen beinhalten unter anderem Ihre IP-Adresse, den Browsertyp,
        das Betriebssystem, den Referrer (die Seite, von der aus Sie zu uns
        gelangt sind), den Hostnamen des zugreifenden Rechners sowie die Uhrzeit
        der Serveranfrage. Diese Daten können zur Gewährleistung der Sicherheit
        und Stabilität der Systeme sowie zur Verbesserung unseres Angebots
        ausgewertet werden und können gegebenenfalls Rückschlüsse auf
        personenbezogene Daten zulassen. Eine Zusammenführung dieser Daten mit
        anderen Datenquellen wird nicht vorgenommen. Unser Webserver wird von
        IONOS bereitgestellt. Für die Verarbeitung Ihrer Daten durch IONOS ist
        die Datenschutzerklärung von IONOS maßgeblich, die unter folgendem Link
        abrufbar ist: https://www.ionos.de/terms-gtc/datenschutzerklaerung/.
        Diese Datenschutzerklärung enthält unter anderem Informationen darüber,
        welche Daten durch IONOS erhoben werden, zu welchem Zweck und auf
        welcher Rechtsgrundlage die Datenverarbeitung erfolgt und welche Rechte
        Sie als betroffene Person haben. Wir weisen darauf hin, dass die
        Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail oder
        über das Kontaktformular) Sicherheitslücken aufweisen kann. Ein
        lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht
        möglich. Wir widersprechen hiermit ausdrücklich der Nutzung unserer im
        Impressum veröffentlichten Kontaktdaten durch Dritte zur Übersendung von
        nicht ausdrücklich angeforderter Werbung und Informationsmaterialien.
        Der Betreiber der Website behält sich ausdrücklich rechtliche Schritte
        im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch
        Spam-E-Mails, vor.
      </div>
    </div>
  )
}

export default Datenschutz