import { useNavigate } from "react-router-dom";
import { IntroStyle } from "./styledComponents/IntroPageStyle";
import { LogoStyle } from "./styledComponents/ForAllStyle";
import Logo from "../assets/img/logo.svg";
import LogoPicture from "../assets/img/logoPicture.svg";

interface IntroProps {
    switchPage: (arg0: boolean) => void
}

const Intro: React.FC<IntroProps> = ({ switchPage }) => {
    const navigate = useNavigate();

    const handlerSwitchPage = (method: string) => {
        if (method === 'login') {
            switchPage(false);
        }

        if (method === 'registration') {
            switchPage(true);
        }

        navigate('/login');
    }

    return (
        <IntroStyle>
            <LogoStyle src={Logo} />
            <img className="img" alt="logo" src={LogoPicture} />
            <h2 className="title">Create engaging
                titles in seconds!</h2>
            <p className="text">Boost your views with AI SMM assistant.</p>
            <div className="container">
                <button onClick={() => handlerSwitchPage('registration')} className='button register'>
                    Get Started
                </button>
                <button onClick={() => handlerSwitchPage('login')} className='button login'>
                    Log In
                </button>
            </div>
        </IntroStyle>
    );
}

export default Intro;