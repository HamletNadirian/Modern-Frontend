import {
    RECEIVE_PRODUCERS,
    REQUEST_PRODUCERS,
    ERROR_RECEIVE_PRODUCERS,
    DELETE_PRODUCER,
    UPDATE_PRODUCER,
    CREATE_PRODUCER,
} from "../actions/producers";

const initialState = {
    isLoading: false,
    list: [],
    totalCount: 0,
    error: false,
};

export default function producersReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_PRODUCERS: {
            return {
                ...state,
                isLoading: true,
                error: false,
            };
        }
        case RECEIVE_PRODUCERS: {
            return {
                ...state,
                isLoading: false,
                list: action.payload.producers,
                totalCount: action.payload.totalCount,
                error: false,
            };
        }

        case ERROR_RECEIVE_PRODUCERS: {
            return {
                ...state,
                isLoading: false,
                error: true,
            };
        }

        case DELETE_PRODUCER: {
            return {
                ...state,
                list: state.list.filter(producer => producer.id !== action.payload),
            };
        }
        case UPDATE_PRODUCER: {
            return {
                ...state,
                list: state.list.map(producer =>
                    producer.id === action.payload.id ? action.payload : producer
                ),
            };
        }
        case CREATE_PRODUCER: {
            return {
                ...state,
                list: [action.payload, ...state.list],
                totalCount: state.totalCount + 1,
            };
        }

        default:
            return state;
    }
}