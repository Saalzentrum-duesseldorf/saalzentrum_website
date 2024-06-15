import './MobileHeader.scss';

function MobileHeader(){
  return (
    <>
      <div className="mobile-header">
        <span className={'title'}>Saalzentrum  Düsseldorf</span>
        <img className={"image-container"} src={"/Saal_Comicstyle.jpg"} alt={'header image'}/>
      </div>
      <div className={"header-space"}></div>
    </>
  );
}

export default MobileHeader;