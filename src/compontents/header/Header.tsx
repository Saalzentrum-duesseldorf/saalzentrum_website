import './Header.scss';

function Header(){
    return (
        <div className="header">
          <span className={'title'}>Saalzentrum Düsseldorf</span>
          <div className={'image-overlay'}></div>
           <img className={"image-container"} src={"public/saalBild.jpg"} alt={'header image'}/>
        </div>
    );
}

export default Header;