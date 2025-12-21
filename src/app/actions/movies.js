import {producersStorage} from './producers';
import {
    RECEIVE_MOVIES,
    REQUEST_MOVIES,
    ERROR_RECEIVE_MOVIES,
    DELETE_MOVIE,
    UPDATE_MOVIE,
    CREATE_MOVIE
} from '../constants/actionTypes';


const receiveMovies = (movies, totalCount) => ({
    payload: {movies, totalCount},
    type: RECEIVE_MOVIES,
});

const requestMovies = () => ({
    type: REQUEST_MOVIES,
});

const errorReceiveMovies = () => ({
    type: ERROR_RECEIVE_MOVIES,
});

const deleteMovieAction = (id) => ({
    payload: id,
    type: DELETE_MOVIE,
});

const updateMovieAction = (movie) => ({
    payload: movie,
    type: UPDATE_MOVIE,
});

const createMovieAction = (movie) => ({
    payload: movie,
    type: CREATE_MOVIE,
});

let moviesStorage = Array.from({length: 50}, (_, i) => ({
    id: `movie-${i + 1}`,
    title: `Movie ${i + 1}`,
    releaseYear: 2020 + (i % 5),
    genre: ['Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi'][i % 5],
    rating: (7 + Math.random() * 3).toFixed(1),
    producerId: `producer-${(i % 10) + 1}`,
    budget: (10 + Math.random() * 90).toFixed(1) + 'M',
    description: `Description for Movie ${i + 1}`,
}));

const getMovies = ({page = 1, limit = 10, title = '', producerId = ''}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...moviesStorage];

            if (title) {
                filtered = filtered.filter(m =>
                    m.title.toLowerCase().includes(title.toLowerCase())
                );
            }
            if (producerId) {
                const producer = producersStorage.find
                (p => p.name.toLowerCase().includes(producerId.toLowerCase()));
                if (producer) {
                    filtered = filtered.filter(m => m.producerId === producer.id);
                } else {
                    filtered = filtered.filter(m => m.producerId === producerId);
                }
            }

            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedMovies = filtered.slice(start, end);

            resolve({
                movies: paginatedMovies,
                totalCount: filtered.length,
            });
        }, 500);
    });
};

const deleteMovieAPI = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            moviesStorage = moviesStorage.filter(m => m.id !== id);
            resolve({success: true});
        }, 300);
    });
};

const updateMovieAPI = (id, data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = moviesStorage.findIndex(m => m.id === id);
            if (index !== -1) {
                moviesStorage[index] = {...data, id};
            }
            resolve({...data, id});
        }, 500);
    });
};

const createMovieAPI = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMovie = {
                ...data,
                id: `movie-${Date.now()}`,
                producerName: data.producerName || `Producer ${data.producerId || 'Unknown'}`,
            };
            moviesStorage.unshift(newMovie);
            resolve(newMovie);
        }, 500);
    });
};

const fetchMovies = (params) => (dispatch) => {
    dispatch(requestMovies());
    return getMovies(params)
        .then(({movies, totalCount}) => dispatch(receiveMovies(movies, totalCount)))
        .catch(() => dispatch(errorReceiveMovies()));
};

const deleteMovie = (id) => (dispatch) => {
    return deleteMovieAPI(id)
        .then(() => {
            dispatch(deleteMovieAction(id));
            return Promise.resolve();
        })
        .catch((error) => Promise.reject(error));
};

const updateMovie = (id, data) => (dispatch) => {
    return updateMovieAPI(id, data)
        .then((movie) => {
            dispatch(updateMovieAction(movie));
            return Promise.resolve();
        })
        .catch((error) => Promise.reject(error));
};

const createMovie = (data) => (dispatch) => {
    return createMovieAPI(data)
        .then((movie) => {
            dispatch(createMovieAction(movie));
            return Promise.resolve();
        })
        .catch((error) => Promise.reject(error));
};

export default {
    fetchMovies,
    deleteMovie,
    updateMovie,
    createMovie,
};

export {
    RECEIVE_MOVIES,
    REQUEST_MOVIES,
    ERROR_RECEIVE_MOVIES,
    DELETE_MOVIE,
    UPDATE_MOVIE,
    CREATE_MOVIE,
};