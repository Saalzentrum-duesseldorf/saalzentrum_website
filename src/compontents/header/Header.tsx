import './Header.scss';

function Header() {
    return (
      <>
        <div className="header">
          <span className={'title'}>Saalzentrum - Düsseldorf</span>
           <img className={"image-container"} src={"/Saal_Comicstyle.jpg"} alt={'header image'}/>
        </div>
        <div className={"header-space"}></div>
      </>
    );
}

export default Header;