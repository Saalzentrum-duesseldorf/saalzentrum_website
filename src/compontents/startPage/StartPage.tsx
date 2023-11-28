import Header from "../header/Header.tsx";
import "./StartPage.scss";
import FlipCard from "../flipCard/FlipCard.tsx";
import BurgerMenu from "../menu/BurgerMenu.tsx";

function App() {

  return (
    <div className={"startPage"}>
      <Header />
      <BurgerMenu/>

      <div className={"startPageBody"}>
        <div className={"flipCards"}>
        <FlipCard />
        </div>
        <div className={"starterTextBox"}>
          <div className={"starterTextHeader"}>
            Herzlich willkommen auf der Website für das Saalzentrum in der
            Langenberger Straße 5 in Düsseldorf.
          </div>
          <div className={"starterText"}>
            Hier findest du organisatorische Informationen und Übersichten.
            Außerdem gibt es die Möglichkeit ein Ticket zu eröffnen. Dies ist
            insbesondere für Termine, die in den Kalender eingetragen werden
            sollen und Meldungen von Defekten oder notwendigen
            Instandhaltungsarbeiten im Saalkomplex vorgesehen. Auch bei Fragen
            und Anliegen zu dieser Website kann ein Ticket eröffnet werden.
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
