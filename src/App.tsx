import { ChangeEvent, ReactElement, useReducer, useRef } from "react";
import "./App.css";
import {
  initialState,
  helperReducer,
  HelperState,
} from "./state/reducers/helpReducer";
import ACTIONS from "./state/actions/helpActions";
import axios, { AxiosResponse } from "axios";

interface ChangeKeywordAction {
  type: typeof ACTIONS.CHANGE_KEYWORD;
  payload: string;
}

interface ChangeServiceAction {
  type: typeof ACTIONS.CHANGE_SERVICE;
  payload: string;
}

interface DeleteServiceAction {
  type: typeof ACTIONS.DELETE_SERVICE;
  payload: string;
}

interface ChangeTitleAction {
  type: typeof ACTIONS.CHANGE_TITLE;
  payload: {
    value: string;
    company: keyof HelperState["info"];
  };
}

type AppAction =
  | ChangeKeywordAction
  | ChangeServiceAction
  | DeleteServiceAction
  | ChangeTitleAction;

function App() {
  const [state, dispatch] = useReducer<React.Reducer<HelperState, AppAction>>(
    helperReducer,
    initialState
  );
  const selectRef = useRef<HTMLSelectElement | null>(null);

  const handleInput = (
    evt: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
    type: string
  ): void | boolean => {
    switch (type) {
      case "keywords":
        dispatch({
          type: ACTIONS.CHANGE_KEYWORD,
          payload: evt.target.value,
        });
        break;
      case "service":
        if (evt.target.value === "add_company") {
          return;
        }
        dispatch({
          type: ACTIONS.CHANGE_SERVICE,
          payload: evt.target.value,
        });
        if (selectRef.current) {
          selectRef.current.value = "add_company";
        }
        break;
      default:
        break;
    }
  };

  const fetchChatGPTResponse = async (): Promise<void> => {
    const apiUrl: string = "https://api.openai.com/v1/chat/completions";
    const apiKey: string =
      "API_KEY";

    try {
      const response: AxiosResponse<any, any> = await axios.post(
        apiUrl,
        {
          model: "gpt-4o",
          messages: [{ role: "user", content: `create catchy title and description for ${state.service} shorts using following hashtags: ${state.keywords}.max ${15} characters`}],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "ChatGPT response:",
        response.data.choices[0].message.content
      );
    } catch (error) {
      console.error("Error fetching ChatGPT response:", error);
    }
  };

  const test = (
    evt: ChangeEvent<HTMLInputElement>,
    company: keyof HelperState["info"]
  ): void => {
    dispatch({
      type: ACTIONS.CHANGE_TITLE,
      payload: {
        value: evt.target.value,
        company,
      },
    });

    return;
  };

  const handlerDeleteService = (item: string): void => {
    console.log(item);
    dispatch({
      type: ACTIONS.DELETE_SERVICE,
      payload: item,
    });
  };

  return (
    <>
      <h1 className="help__title">Catchy</h1>

      <div className="helper__container">
        <select ref={selectRef} onChange={(evt) => handleInput(evt, "service")}>
          <option value="add_company">add_company</option>
          {state.services.map(
            (service: string, index: number): ReactElement => {
              return (
                <option key={index} value={service}>
                  {service}
                </option>
              );
            }
          )}
        </select>
        {state.service.length
          ? state.service.map((item: string, index: number) => {
              return (
                <button key={index} onClick={() => handlerDeleteService(item)}>
                  {item}
                </button>
              );
            })
          : ""}
        <input
          type="text"
          value={state.keywords}
          onChange={(evt) => handleInput(evt, "keywords")}
        />

        <button onClick={fetchChatGPTResponse}>fetch data</button>

        <div className="help__wrapper">
          {state.service.length ? (
            state.service.map((service: string, index: number) => {
              const platform = service as keyof typeof state.info;
              return (
                <div key={index} className="help__answer">
                  <h3>{service}</h3>
                  <div className="help__wrapper-input">
                    <input
                      type="text"
                      value={state.info[platform].title}
                      onChange={(evt) => test(evt, platform)}
                    />
                    <input
                      type="text"
                      value={state.info[platform].description}
                      readOnly
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p>empty</p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
function addCount(arg0: number) {
  throw new Error("Function not implemented.");
}

function dispatch(arg0: { type: ACTIONS; payload: { value: string; company: "youtube" | "facebook" | "instagram"; }; }) {
  throw new Error("Function not implemented.");
}

