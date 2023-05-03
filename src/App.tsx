import './App.scss'
import Header from "./compontents/header/Header.tsx";
import Footer from "./compontents/footer/Footer.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import FlipCard from "./compontents/flipCard/FlipCard.tsx";

function App() {

  return (
    <>
        <Header/>

    <div className={'text-center'}>
     <FlipCard/>
    </div>


        <Footer/>
    </>
  )
}

export default App
