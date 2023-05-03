import './Header.scss';

function Header(){
    return (
        <div className="header">
          <h1 className={'title'}>Saalzentrum Dusseldorf</h1>
           <img className={"image-container"} src={"src/assets/saalBild.png"} alt={'header image'}/>
        </div>
    );
}

export default Header;