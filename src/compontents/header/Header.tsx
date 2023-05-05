import './Header.scss';

function Header(){
    return (
        <div className="header">
          <span className={'title'}>Saalzentrum Dusseldorf</span>
           <img className={"image-container"} src={"src/assets/saalBild.png"} alt={'header image'}/>
        </div>
    );
}

export default Header;