import Header from "../header/Header.tsx";
import FlipCard from "../flipCard/FlipCard.tsx";

function App() {
  return (<div>
    <Header/>
    <div className={'text-center'}>
      <FlipCard/>
    </div>
  </div>)
}

export default App