import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import CardActions from 'components/CardActions';
import IconButton from 'components/IconButton';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';
import useChangePage from 'misc/hooks/useChangePage';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';
import moviesActions from '../actions/movies';
import producersActions from '../actions/producers';
import {selectMoviesWithProducer} from "../selectors/movies";
import { useDetailStyles } from '../../misc/hooks/useDetailStyles';


function MovieDetail() {
    const {formatMessage} = useIntl();
    const {theme} = useTheme();
    const classes = useDetailStyles({theme});
    const dispatch = useDispatch();
    const changePage = useChangePage();
    const locationSearch = useLocationSearch();
    const {id} = useParams();

    const movies = useSelector(state => ({
        ...state.movies,
        list: selectMoviesWithProducer(state),
    }));

    const producers = useSelector(state => state.producers?.list || []);

    const isNew = id === 'new';

    const [state, setState] = useState({
        mode: isNew ? 'edit' : 'view',
        formData: {
            title: '',
            releaseYear: '',
            genre: '',
            rating: '',
            producerId: '',
            producerName: '',
            budget: '',
            description: '',
        },
        originalData: null,
        validationErrors: {},
        notification: null,
        isSaving: false,
    });
    const producer = producers.find(
        p => p.id === state.formData.producerId
    );

    useEffect(() => {
        if (!producers.length) {
            dispatch(producersActions.fetchProducers({page: 1, limit: 100}));
        }
    }, [dispatch, producers.length]);

    useEffect(() => {
        if (!isNew && movies.list.length > 0) {
            const movie = movies.list.find(m => m.id === id);
            if (movie && !state.originalData) {
                setState(prev => ({
                    ...prev,
                    formData: {
                        title: movie.title || '',
                        releaseYear: movie.releaseYear || '',
                        genre: movie.genre || '',
                        rating: movie.rating || '',
                        producerId: movie.producerId || '',
                        producerName: movie.producerName || '',
                        budget: movie.budget || '',
                        description: movie.description || '',
                    },
                    originalData: {
                        title: movie.title || '',
                        releaseYear: movie.releaseYear || '',
                        genre: movie.genre || '',
                        rating: movie.rating || '',
                        producerId: movie.producerId || '',
                        producerName: movie.producerName || '',
                        budget: movie.budget || '',
                        description: movie.description || '',
                    },
                }));
            }
        }
    }, [id, movies.list, isNew, state.originalData]);

    const validateForm = () => {
        const errors = {};

        if (!state.formData.title || state.formData.title.trim() === '') {
            errors.title = formatMessage({id: 'validation.required'});
        }

        if (!state.formData.releaseYear) {
            errors.releaseYear = formatMessage({id: 'validation.required'});
        } else if (isNaN(state.formData.releaseYear) || state.formData.releaseYear < 1800 || state.formData.releaseYear > 2100) {
            errors.releaseYear = formatMessage({id: 'validation.year.invalid'});
        }

        if (!state.formData.genre || state.formData.genre.trim() === '') {
            errors.genre = formatMessage({id: 'validation.required'});
        }

        if (!state.formData.rating) {
            errors.rating = formatMessage({id: 'validation.required'});
        } else if (isNaN(state.formData.rating) || state.formData.rating < 0 || state.formData.rating > 10) {
            errors.rating = formatMessage({id: 'validation.rating.invalid'});
        }

        return errors;
    };

    const handleEdit = () => {
        setState({
            ...state,
            mode: 'edit',
        });
    };

    const handleCancel = () => {
        if (isNew) {
            changePage({
                locationSearch,
                pathname: pagesURLs[pages.moviesList],
            });
        } else {
            setState({
                ...state,
                mode: 'view',
                formData: {...state.originalData},
                validationErrors: {},
            });
        }
    };

    const handleSave = () => {
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setState({
                ...state,
                validationErrors: errors,
            });
            return;
        }

        setState({...state, isSaving: true});

        const action = isNew
            ? moviesActions.createMovie(state.formData)
            : moviesActions.updateMovie(id, state.formData);

        dispatch(action)
            .then(() => {
                setState({
                    ...state,
                    mode: 'view',
                    originalData: {...state.formData},
                    validationErrors: {},
                    isSaving: false,
                    notification: {
                        message: formatMessage({
                            id: isNew ? 'movie.created.success' : 'movie.updated.success'
                        }),
                        type: 'success',
                    },
                });

                if (isNew) {
                    setTimeout(() => {
                        changePage({
                            locationSearch: {
                                ...locationSearch,
                                page: '1',
                            },
                            pathname: pagesURLs[pages.moviesList],
                        });
                    }, 1500);
                } else {
                    setTimeout(() => {
                        setState(prev => ({...prev, notification: null}));
                    }, 3000);
                }
            })
            .catch(() => {
                setState({
                    ...state,
                    isSaving: false,
                    notification: {
                        message: formatMessage({id: 'movie.save.error'}),
                        type: 'error',
                    },
                });
                setTimeout(() => {
                    setState(prev => ({...prev, notification: null}));
                }, 3000);
            });
    };

    const handleBack = () => {
        changePage({
            locationSearch,
            pathname: pagesURLs[pages.moviesList],
        });
    };

    const handleFieldChange = (field, value) => {
        setState(prev => ({
            ...prev,
            formData: {
                ...prev.formData,
                [field]: value,
            },
            validationErrors: {
                ...prev.validationErrors,
                [field]: undefined,
            },
        }));
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="title">
                    <strong>
                        {isNew
                            ? formatMessage({id: 'movie.create.title'})
                            : formatMessage({id: 'movie.detail.title'})
                        }
                    </strong>
                </Typography>
                <div>
                    {state.mode === 'view' && (
                        <IconButton onClick={handleEdit}>
                            <Typography variant="title">✏️</Typography>
                        </IconButton>
                    )}
                </div>
            </div>

            <Card>
                <CardContent>
                    {state.mode === 'view' ? (
                        <div>
                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    {formatMessage({id: 'movie.field.title'})}
                                </Typography>
                                <Typography variant="subtitle">
                                    <strong>{state.formData.title}</strong>
                                </Typography>
                            </div>

                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    {formatMessage({id: 'movie.field.year'})}
                                </Typography>
                                <Typography>{state.formData.releaseYear}</Typography>
                            </div>

                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    {formatMessage({id: 'movie.field.genre'})}
                                </Typography>
                                <Typography>{state.formData.genre}</Typography>
                            </div>

                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    {formatMessage({id: 'movie.field.rating'})}
                                </Typography>
                                <Typography>{state.formData.rating}</Typography>
                            </div>

                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    Producer
                                </Typography>
                                <Typography>
                                    {producer ? producer.name : '—'}
                                </Typography>
                            </div>

                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    {formatMessage({id: 'movie.field.budget'})}
                                </Typography>
                                <Typography>{state.formData.budget}</Typography>
                            </div>

                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    {formatMessage({id: 'movie.field.description'})}
                                </Typography>
                                <Typography>{state.formData.description}</Typography>
                            </div>
                        </div>
                    ) : (
                        <div className={classes.form}>
                            <TextField
                                label={formatMessage({id: 'movie.field.title'})}
                                value={state.formData.title}
                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                required
                                isError={!!state.validationErrors.title}
                                helperText={state.validationErrors.title}
                            />

                            <TextField
                                label={formatMessage({id: 'movie.field.year'})}
                                value={String(state.formData.releaseYear || '')}
                                onChange={(e) => handleFieldChange('releaseYear', e.target.value)}
                                required
                                isError={!!state.validationErrors.releaseYear}
                                helperText={state.validationErrors.releaseYear}
                            />

                            <TextField
                                label={formatMessage({id: 'movie.field.genre'})}
                                value={state.formData.genre}
                                onChange={(e) => handleFieldChange('genre', e.target.value)}
                                required
                                isError={!!state.validationErrors.genre}
                                helperText={state.validationErrors.genre}
                            />

                            <TextField
                                label={formatMessage({id: 'movie.field.rating'})}
                                value={String(state.formData.rating || '')}
                                onChange={(e) => handleFieldChange('rating', e.target.value)}
                                required
                                isError={!!state.validationErrors.rating}
                                helperText={state.validationErrors.rating}
                            />

                            <select
                                className={classes.select}
                                value={state.formData.producerId || ''}
                                onChange={(e) => handleFieldChange('producerId', e.target.value)}>
                                <option value="">— Select producer —</option>
                                {producers.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>

                            <TextField
                                label={formatMessage({id: 'movie.field.budget'})}
                                value={state.formData.budget}
                                onChange={(e) => handleFieldChange('budget', e.target.value)}
                            />

                            <TextField
                                label={formatMessage({id: 'movie.field.description'})}
                                value={state.formData.description}
                                onChange={(e) => handleFieldChange('description', e.target.value)}
                            />
                        </div>
                    )}
                </CardContent>

                <CardActions>
                    <Button onClick={handleBack} variant="secondary">
                        <Typography>{formatMessage({id: 'btn.back'})}</Typography>
                    </Button>

                    {state.mode === 'edit' && (
                        <>
                            <Button onClick={handleCancel} variant="secondary">
                                <Typography>{formatMessage({id: 'btn.cancel'})}</Typography>
                            </Button>
                            <Button
                                onClick={handleSave}
                                variant="primary"
                                isLoading={state.isSaving}
                            >
                                <Typography color="inherit">
                                    <strong>
                                        {formatMessage({id: isNew ? 'btn.create' : 'btn.save'})}
                                    </strong>
                                </Typography>
                            </Button>
                        </>
                    )}
                </CardActions>
            </Card>

            {/* Notification */}
            {state.notification && (
                <div className={classes.notification}>
                    <Card variant={state.notification.type === 'error' ? 'error' : 'success'}>
                        <CardContent>
                            <Typography color={state.notification.type === 'error' ? 'error' : 'success'}>
                                {state.notification.message}
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

export default MovieDetail;