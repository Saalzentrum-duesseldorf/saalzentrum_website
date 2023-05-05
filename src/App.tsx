import './App.scss'
import Header from "./compontents/header/Header.tsx";
import Footer from "./compontents/footer/Footer.tsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import FlipCard from "./compontents/flipCard/FlipCard.tsx";
import BurgerMenu from "./compontents/menu/BurgerMenu.tsx";

function App() {

  return (
    <>
        <Header/>



    <div className={'text-center'}>
      <BurgerMenu/>
     <FlipCard/>
    </div>


        <Footer/>
    </>
  )
}

export default App
