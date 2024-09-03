import ACTIONS from "../actions/helpActions";

interface PlatformInfo {
  id: number;
  title: string;
  description: string;
}

export interface HelperState {
  services: string[];
  service: string[];
  keywords: string;
  info: Record<"youtube" | "facebook" | "instagram", PlatformInfo>;
  loggin: string;
  password: string;
}

export const initialState: HelperState = {
  services: ["youtube", "instagram", "facebook", "all"],
  service: [],
  keywords: "",
  info: {
    youtube: {
      id: 1,
      title: "",
      description: "",
    },
    facebook: {
      id: 2,
      title: "",
      description: "",
    },
    instagram: {
      id: 3,
      title: "",
      description: "",
    },
  },
  loggin: "",
  password: "",
};

interface Payload{
    type: string,
    payload: string | { company: keyof HelperState["info"]; value: string }
}
  

export const helperReducer = (state: any, action: Payload) => {
  switch (action.type) {
    case ACTIONS.CHANGE_KEYWORD:
      return { ...state, keywords: action.payload };
    case ACTIONS.CHANGE_SERVICE:
      if (action.payload === "all") {
        const result = state.services.filter((service: string) => {
          return service !== "all";
        });

        return {
          ...state,
          service: Object.assign([], state.service, result),
        };
      } else {
        const index = state.service.indexOf(action.payload);

        if (index > -1) {
          const updatedService = [...state.service];
          updatedService[index] = action.payload;
          return {
            ...state,
            service: updatedService,
          };
        } else {
          return {
            ...state,
            service: [...state.service, action.payload],
          };
        }
      }

    case ACTIONS.CHANGE_TITLE:
      if (
        typeof action.payload === "object" &&
        action.payload.company !== null &&
        action.payload.value !== null
      ) {
        return {
          ...state,
          info: {
            ...state.info,
            [action.payload.company]: {
              ...state.info[action.payload.company],
              title: action.payload.value,
            },
          },
        };
      } else return state;
    case ACTIONS.DELETE_SERVICE:
      const index = state.service.indexOf(action.payload);

      if (index > -1) {
        return {
          ...state,
          service: [
            ...state.service.slice(0, index),
            ...state.service.slice(index + 1),
          ],
        };
      }
      return state;
    default:
      return { ...state };
  }
};
