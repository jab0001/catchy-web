import ACTIONS from "../actions/helpActions";

interface PlatformInfo {
  id: number;
  description: string;
}

export interface HelperState {
  services: string[];
  service: string[];
  keywords: string[];
  info: Record<"youtube" | "facebook" | "instagram" | "tiktok", PlatformInfo>;
  loggin: string;
  password: string;
  isPaid: boolean;
  dayLimitModal: boolean;
  limit: number;
}

export const initialState: HelperState = {
  services: ["youtube", "instagram", "facebook", "tiktok"],
  service: [],
  keywords: [],
  isPaid: false,
  dayLimitModal: false,
  limit: 0,
  info: {
    youtube: {
      id: 1,
      description: "",
    },
    facebook: {
      id: 2,
      description: "",
    },
    instagram: {
      id: 3,
      description: "",
    },
    tiktok: {
      id: 4,
      description: ""
    }
  },
  loggin: "",
  password: "",
};

interface Payload {
  type: string,
  payload?: string | {
    [x: string]: any; company: keyof HelperState["info"]; value: string
  }
}


export const helperReducer = (state: any, action: Payload) => {
  switch (action.type) {
    case ACTIONS.CHANGE_KEYWORD:
      const updatedKeywords = Array.from(new Set([...state.keywords, action.payload]));
      return { ...state, keywords: updatedKeywords };
    case ACTIONS.DELETE_KEYWORD:
      return {
        ...state,
        keywords: state.keywords.filter(
          (keyword: string) => keyword !== action.payload
        ),
      };
    case ACTIONS.CHANGE_SERVICE: {
      const index = state.service.indexOf(action.payload);

      if (index > -1) {
        return {
          ...state,
          service: state.service.filter(
            (service: string) => service !== action.payload
          ),
        };
      } else {
        return {
          ...state,
          service: [...state.service, action.payload],
        };
      }
    }
    case ACTIONS.SET_IS_PAID: {
      return {
        ...state,
        isPaid: action.payload
      }
    }
    case ACTIONS.DAY_LIMIT: {
      return {
        ...state,
        dayLimitModal: !state.dayLimitModal
      }
    }
    case ACTIONS.DAY_LIMIT_NUMBER: {
      return {
        ...state,
        limit: action.payload
      }
    }
    case ACTIONS.CHANGE_DESCRIPTION: {
      if (action.payload && typeof action.payload === 'object') {
        return {
          ...state,
          info: {
            ...state.info,
            youtube: {
              ...state.info.youtube,
              description: action.payload.youtube || state.info.youtube.description,
            },
            facebook: {
              ...state.info.facebook,
              description: action.payload.facebook || state.info.facebook.description,
            },
            instagram: {
              ...state.info.instagram,
              description: action.payload.instagram || state.info.instagram.description,
            },
            tiktok: {
              ...state.info.tiktok,
              description: action.payload.tiktok || state.info.tiktok.description,
            },
          },
        };
      }
      return state;
    }
    case ACTIONS.CLEAR_DATA: {
      return {
        ...state,
        service: [],
        keywords: [],
      }
    }
    default:
      return { ...state };
  }
};
