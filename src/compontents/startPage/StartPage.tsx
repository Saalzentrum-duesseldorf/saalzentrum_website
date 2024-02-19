import Header from "../header/Header.tsx";
import "./StartPage.scss";
import FlipCard from "../flipCard/FlipCard.tsx";
import BurgerMenu from "../menu/BurgerMenu.tsx";
import { useEffect, useState } from "react";

function StartPage() {
  const [showScrollBtn, setShowScrollBtn] = useState(true);

  const checkScroll = () => {
    // Hide button if scrolled more than 50 pixels using window.scrollY for better compatibility
    if (window.scrollY > 50) {
      setShowScrollBtn(false);
    } else {
      setShowScrollBtn(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", checkScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const scrollDown = () => {
    window.scrollTo({
      top: document.documentElement.clientHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className={"startPage"}>
      <Header />


      <div className={"burgerMenu-container"}>
        <BurgerMenu />
      </div>


      <div className={"startPageBody"}>

        <FlipCard />

        {showScrollBtn && (
          <button className="scrollDownBtn" onClick={scrollDown}>
            ↓ Scroll Down
          </button>
        )}

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

export default StartPage;
