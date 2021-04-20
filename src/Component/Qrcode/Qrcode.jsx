import QRCode from 'qrcode.react';
import { useState } from 'react';
import './Qrcode.css';

function Qrcode(props) {
    // React hook, to switch default & overlay qr
    const [isClicked, setClick] = useState(false);

    return (
        <div
            className={'mx-auto p-2 '+(isClicked ? 'qr-container-overlay' : 'qr-container-default')}
            onClick={() => setClick(!isClicked)}
        >
            <QRCode
                    value={props.link}
                    size={isClicked ? 200 : 100}
                    level="M"
                    bgColor="transparent"
                    fgColor={isClicked ? "#fff" : "#000"}
                    className={isClicked ? 'qr-overlay' : 'qr-default'}
            />
            {isClicked && <h3 className="qr-link-overlay"> {props.link} </h3>}
        </div>
    );
}

export default Qrcode;