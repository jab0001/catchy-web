import { ReactElement, useEffect, useReducer, useState } from "react";
import {
    initialState,
    helperReducer,
    HelperState,
} from "../state/reducers/helpReducer";
import ACTIONS from "../state/actions/helpActions";
import axios, { AxiosResponse } from "axios";
import { auth, checkApiUsageLimit, checkSubscriptionStatus } from "../firebaseConfig";
import Description from "./Description";
import { useNavigate } from "react-router-dom";
import DayLimitModal from "./DayLimitModal";
import { MainStyle } from "./styledComponents/MainStyle";
import { InputStyle } from "./styledComponents/ForAllStyle";
import { LogoStyle } from "./styledComponents/ForAllStyle";
import Logo from "../assets/img/logo.svg";
import { MAX_KEYWORDS, images, dataPreparationForPromt } from "../helpers";
import { LoadingStyle } from "./styledComponents/LoadingStyle";
import LoadingImg from "../assets/img/loading.svg";



interface ChangeKeywordAction {
    type: typeof ACTIONS.CHANGE_KEYWORD;
    payload: string;
}

interface ChangeServiceAction {
    type: typeof ACTIONS.CHANGE_SERVICE;
    payload: string;
}

interface DayLimitAction {
    type: typeof ACTIONS.DAY_LIMIT;
}

interface DeleteKeywordAction {
    type: typeof ACTIONS.DELETE_KEYWORD;
    payload: string;
}

interface ChangeDescriptionAction {
    type: typeof ACTIONS.CHANGE_DESCRIPTION;
    payload: any;
}

interface ClearDataAction {
    type: typeof ACTIONS.CLEAR_DATA;
}

type AppAction =
    | ChangeKeywordAction
    | ChangeServiceAction
    | DayLimitAction
    | DeleteKeywordAction
    | ChangeDescriptionAction
    | ClearDataAction;

interface MainPageProps {
    handleLogout: () => void;
}

function MainPage({ handleLogout }: MainPageProps) {
    const [state, dispatch] = useReducer<React.Reducer<HelperState, AppAction>>(
        helperReducer,
        initialState
    );
    const [openService, setOpenService] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>('');
    const [isGenerated, setIsGenerated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleServiceVisibility = (service: string) => {
        setOpenService((prev) =>
            prev.includes(service)
                ? prev.filter((s) => s !== service)
                : [...prev, service]
        );
    };

    /* const handlePaymentUpdate = async () => {
        if (!auth.currentUser) {
            console.error("User is not authenticated");
            return;
        }
    
        await updatePaymentStatus(auth.currentUser.uid, true);
    }; */

    useEffect(() => {
        console.log("useEffect triggered");
        const fetchKeyAndStatus = async () => {
            if (!auth.currentUser) {
                console.error("User is not authenticated");
                return;
            }

            // Проверяем статус подписки
            await checkSubscriptionStatus(dispatch);
        };

        fetchKeyAndStatus();
    }, []);

    const handleInputKeywords = (
        keyword: string
    ): void | boolean => {
        if (!keyword) {
            return;
        }
        // Разделяем строку ключевых слов по специальным символам и пробелам
        const keywordsArray = keyword.split(/[\s,.;:]+/).filter(Boolean);

        // Пример: Вы можете добавить логику для дальнейшей обработки массива
        if (keywordsArray.length > MAX_KEYWORDS) {
            keywordsArray.length = MAX_KEYWORDS;
        }

        keywordsArray.forEach((word) => {
            dispatch({
                type: ACTIONS.CHANGE_KEYWORD,
                payload: word,
            });
        });

        // Очищаем поле ввода после обработки
        setKeyword('');
    };

    const handleRemoveKeyword = (keyword: string): void => {
        dispatch({
            type: ACTIONS.DELETE_KEYWORD,
            payload: keyword,
        });
    };

    const handleInputServices = (
        service: string,
    ): void | boolean => {
        dispatch({
            type: ACTIONS.CHANGE_SERVICE,
            payload: service,
        });
    };

    const goOnGeneratePage = () => {
        setIsGenerated(false);
        dispatch({
            type: ACTIONS.CLEAR_DATA,
        });
    }

    const fetchChatGPTResponse = async (): Promise<void> => {
        const isAllowed = await checkApiUsageLimit(state.service.length, dispatch);

        if (!isAllowed) {
            dispatch({
                type: ACTIONS.DAY_LIMIT,
            });
            return;
        }

        if (state.service.length === 0 || state.keywords.length === 0) {
            return;
        }

        setLoading(true);

        const apiUrl: string = "https://api.openai.com/v1/chat/completions";

        let prompt = dataPreparationForPromt(state.keywords, state.service)

        try {
            const response: AxiosResponse<any, any> = await axios.post(
                apiUrl,
                {
                    model: "gpt-4o",
                    messages: [{ role: "user", content: prompt }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_GPT_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const services: Record<"youtube" | "facebook" | "instagram" | "tiktok", string> = {
                youtube: "",
                facebook: "",
                instagram: "",
                tiktok: ""
            };

            const regex = /(\w+):\s([^:\n]+)/g;
            let match;

            while ((match = regex.exec(response.data.choices[0].message.content)) !== null) {
                const service = match[1].toLowerCase();
                const description = match[2].trim();

                if (service in services) {
                    console.log(service)
                    services[service as keyof typeof services] = description;
                }
            }

            const answer = state.service.length > 1 ? services : { [state.service[0]]: response.data.choices[0].message.content };

            dispatch({
                type: ACTIONS.CHANGE_DESCRIPTION,
                payload: answer
            });

            setLoading(false);
            setIsGenerated(true);
        } catch (error) {
            console.error("Error fetching ChatGPT response:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingStyle>
          <img className="img" src={LoadingImg}/>
        </LoadingStyle>  // Можно показать спиннер или сообщение о загрузке
      }

    return (
        <>
            <MainStyle>
                {!isGenerated ? (
                    <div className="generate">
                        {/* <button onClick={handleLogout}>Logout</button> */}
                        <InputStyle
                            type="text"
                            className="input"
                            placeholder="Enter up to 5 keywords"
                            value={keyword}
                            onChange={(evt) => setKeyword(evt.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleInputKeywords(keyword);
                                }
                            }}
                            onBlur={() => handleInputKeywords(keyword)}
                        />

                        {state.keywords.length ? (<ul className="list">
                            {state.keywords.map((word) => {
                                return <li className="item" key={word}>
                                    <button className="keyword" onClick={() => { handleRemoveKeyword(word) }}>{word}<svg className="close" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6.20455 0.545454L9.06818 5.625H9.20455L12.1023 0.545454H17.3864L12.1705 9.27273L17.5909 18H12.1705L9.20455 12.8182H9.06818L6.10227 18H0.715909L6.06818 9.27273L0.886364 0.545454H6.20455Z" fill="#147FC2" />
                                    </svg>
                                    </button>
                                </li>
                            })}
                        </ul>) : <ul className="list"></ul>}

                        {/* {state.keywords.length ? state.keywords.map((word) => {
                            return <button className="keyword" key={word} onClick={() => { handleRemoveKeyword(word) }}>{word}</button>
                        }) : ''} */}

                        <ul className="companies">
                            {state.services.map((service: string, index: number): ReactElement => {
                                return (
                                    <li className="company" key={index}>
                                        <label htmlFor={service}>
                                            <input id={service} type="checkbox" style={{ display: "none" }} /* onChange={() => handleInputServices(service)} */ />
                                            <img
                                                src={images[service]}
                                                alt={service}
                                                onClick={() => handleInputServices(service)}
                                                className="service-image"
                                            />
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                        {/* <button onClick={() => handleInputKeywords(keyword)}>add</button> */}
                        <button className="button payment" onClick={() => navigate('/payment')}>GO PREMIUM</button>
                        <button className="button fetch" disabled={state.service.length === 0 || state.keywords.length === 0} onClick={fetchChatGPTResponse}>GENERATE</button>
                    </div>) :
                    <div className="generated">
                        <LogoStyle src={Logo} className="help-logo" />
                        {Object.entries(state.info).map(([service, { description }], index) => {
                            const isOpen = openService.includes(service);

                            if (!description) {
                                return null;
                            }

                            return (
                                <div key={index} className="help-list">
                                    <h3 className="help-title" onClick={() => toggleServiceVisibility(service)}>
                                        <img className="help-img" src={images[service]} alt={service} />
                                        {service}
                                        <span className="help-arrow">{isOpen ? "▼" : "►"}</span>
                                    </h3>

                                    {isOpen && (
                                        <div className="help-textarea">
                                            <Description description={description} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        <div className="generated-btns">
                            <button className="generate-back" onClick={() => goOnGeneratePage()}>&larr;</button>
                            <button className="button generated-payment" onClick={() => navigate('/payment')}>GO PREMIUM</button>
                        </div>
                    </div>
                }
            </MainStyle>
            <DayLimitModal
                limit={state.limit}
                isOpen={state.dayLimitModal}
                onClose={() => dispatch({ type: ACTIONS.DAY_LIMIT })}
            />
        </>
    );
}

export default MainPage;

