import './Header.scss';
import { Container } from 'react-bootstrap';

function Header(){
    return (
        <div className="header">
            <Container fluid className="p-0">
                <div className="image-container"></div>
            </Container>
        </div>
    );
}

export default Header;