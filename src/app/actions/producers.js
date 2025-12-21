import {
    RECEIVE_PRODUCERS,
    REQUEST_PRODUCERS,
    ERROR_RECEIVE_PRODUCERS,
    DELETE_PRODUCER,
    UPDATE_PRODUCER,
    CREATE_PRODUCER
} from '../constants/actionTypes';

const receiveProducers = (producers, totalCount) => ({
    payload: {producers, totalCount},
    type: RECEIVE_PRODUCERS,
});

const requestProducers = () => ({
    type: REQUEST_PRODUCERS,
});

const errorReceiveProducers = () => ({
    type: ERROR_RECEIVE_PRODUCERS,
});

const deleteProducerAction = (id) => ({
    payload: id,
    type: DELETE_PRODUCER,
});

const updateProducerAction = (producer) => ({
    payload: producer,
    type: UPDATE_PRODUCER,
});

const createProducerAction = (producer) => ({
    payload: producer,
    type: CREATE_PRODUCER,
});

let producersStorage = Array.from({length: 50}, (_, i) => ({
    id: `producer-${i + 1}`,
    name: `Producer ${i + 1}`,
    yearOfBirth: 1960 + (i % 5),

}));

const getProducers = ({page = 1, limit = 10, name = '', yearOfBirth = ''}) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let filtered = [...producersStorage];

            if (name) {
                filtered = filtered.filter(p =>
                    p.name.toLowerCase().includes(name.toLowerCase())
                );
            }

            if (yearOfBirth) {
                filtered = filtered.filter(
                    p => String(p.yearOfBirth).includes(String(yearOfBirth))
                );
            }

            const start = (page - 1) * limit;
            const end = start + limit;
            const paginatedProducers = filtered.slice(start, end);

            resolve({
                producers: paginatedProducers,
                totalCount: filtered.length,
            });
        }, 500);
    });
};

const deleteProducerAPI = (id) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            producersStorage = producersStorage.filter(p => p.id !== id);
            resolve({success: true});
        }, 300);
    });
};

const updateProducerAPI = (id, data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = producersStorage.findIndex(p => p.id === id);
            if (index !== -1) {
                producersStorage[index] = {...data, id};
            }
            resolve({...data, id});
        }, 500);
    });
};

const createProducerAPI = (data) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newProducer = {
                ...data,
                id: `producer-${Date.now()}`,
            };
            producersStorage.unshift(newProducer);
            resolve(newProducer);
        }, 500);
    });
};

const fetchProducers = (params) => (dispatch) => {
    dispatch(requestProducers());
    return getProducers(params)
        .then(({producers, totalCount}) => dispatch(receiveProducers(producers, totalCount)))
        .catch(() => dispatch(errorReceiveProducers()));
};

const deleteProducer = (id) => (dispatch) => {
    return deleteProducerAPI(id)
        .then(() => {
            dispatch(deleteProducerAction(id));
            return Promise.resolve();
        })
        .catch((error) => Promise.reject(error));
};

const updateProducer = (id, data) => (dispatch) => {
    return updateProducerAPI(id, data)
        .then((producer) => {
            dispatch(updateProducerAction(producer));
            return Promise.resolve();
        })
        .catch((error) => Promise.reject(error));
};

const createProducer = (data) => (dispatch) => {
    return createProducerAPI(data)
        .then((producer) => {
            dispatch(createProducerAction(producer));
            return Promise.resolve();
        })
        .catch((error) => Promise.reject(error));
};
export default {
    fetchProducers,
    deleteProducer,
    updateProducer,
    createProducer,
};

export {
    RECEIVE_PRODUCERS,
    REQUEST_PRODUCERS,
    ERROR_RECEIVE_PRODUCERS,
    DELETE_PRODUCER,
    UPDATE_PRODUCER,
    CREATE_PRODUCER,
    producersStorage
};