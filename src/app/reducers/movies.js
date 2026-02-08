import {
    RECEIVE_MOVIES,
    REQUEST_MOVIES,
    ERROR_RECEIVE_MOVIES,
    DELETE_MOVIE,
    UPDATE_MOVIE,
    CREATE_MOVIE,
} from '../actions/movies';

const initialState = {
    isLoading: false,
    list: [],
    totalCount: 0,
    error: false,
};

export default function moviesReducer(state = initialState, action) {
    switch (action.type) {
        case REQUEST_MOVIES: {
            return {
                ...state,
                isLoading: true,
                error: false,
            };
        }

        case RECEIVE_MOVIES: {
            return {
                ...state,
                isLoading: false,
                list: action.payload.movies,
                totalCount: action.payload.totalCount,
                error: false,
            };
        }

        case ERROR_RECEIVE_MOVIES: {
            return {
                ...state,
                isLoading: false,
                error: true,
            };
        }

        case DELETE_MOVIE: {
            return {
                ...state,
                list: state.list.filter(movie => movie.id !== action.payload),
            };
        }

        case UPDATE_MOVIE: {
            return {
                ...state,
                list: state.list.map(movie =>
                    movie.id === action.payload.id ? action.payload : movie
                ),
            };
        }

        case CREATE_MOVIE: {
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