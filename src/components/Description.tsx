import { DescriptionStyle } from "./styledComponents/DescriptionStyle";
import CopyImg from "../assets/img/copy.svg";

interface Props {
    description: string;
}

const Description = ({ description }: Props) => {
    const copyHandler = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Скопировано в буфер обмена!");
        }).catch((error) => {
            console.error("Ошибка при копировании:", error);
        });
    };

    return <DescriptionStyle><textarea
        className="textarea"
        value={description}
        readOnly
        onClick={() => { copyHandler(description) }}
    />
        <img className="img" src={CopyImg} />
    </DescriptionStyle>
}

export default Description;