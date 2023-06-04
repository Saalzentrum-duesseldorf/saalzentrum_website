import Header from "../header/Header.tsx";
import FlipCard from "../flipCard/FlipCard.tsx";
import "./StartPage.scss"

function App() {
  return (<div className={"startpage"}>
    <Header/>
    <div className={'text-center'}>
      <FlipCard />

      <div className={"starterText"}>
        <div className={"starterTextHeader"}>
        Herzlich willkommen auf der Website für das Saalzentrum in der
        Langenberger Straße 5 in Düsseldorf. </div>
        Hier findest du organisatorische
        Informationen und Übersichten. Außerdem gibt es die Möglichkeit ein Ticket zu eröffnen.
        Dies ist insbesondere für Termine, die in den Kalender eingetragen werden sollen
        und Meldungen von Defekten oder notwendigen Instandhaltungsarbeiten im
        Saalkomplex vorgesehen. Auch bei Fragen und Anliegen zu dieser Website
        kann ein Ticket eröffnet werden.
      </div>
    </div>
  </div>)
}

export default App