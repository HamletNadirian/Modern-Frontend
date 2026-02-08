import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import Dialog from 'components/Dialog';
import CardActions from 'components/CardActions';
import Hover from 'components/Hover';
import IconButton from 'components/IconButton';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';
import useChangePage from 'misc/hooks/useChangePage';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';
import moviesActions from '../actions/movies';
import { selectMoviesWithProducer } from 'app/selectors/movies';
import producersActions from '../actions/producers';
import { useListStyles } from '../../misc/hooks/useListStyles';

function MoviesList() {
    const { formatMessage } = useIntl();
    const { theme } = useTheme();
    const classes = useListStyles({ theme });
    const dispatch = useDispatch();
    const changePage = useChangePage();
    const locationSearch = useLocationSearch();

    const movies = useSelector(state => ({
        ...state.movies,
        list: selectMoviesWithProducer(state),
    }));

    const producers = useSelector(state => state.producers?.list || []);

    const [state, setState] = useState({
        deleteDialogOpen: false,
        movieToDelete: null,
        filterDialogOpen: false,
        filterTitle: locationSearch.title || '',
        filterProducerId: locationSearch.producerId || '',
        notification: null,
    });

    const currentPage = parseInt(locationSearch.page || '1', 10);
    const limit = 10;

    useEffect(() => {
        if (producers.length === 0) {
            dispatch(producersActions.fetchProducers({ page: 1, limit: 100 }));
        }
    }, [dispatch, producers.length]);

    useEffect(() => {
        dispatch(moviesActions.fetchMovies({
            page: currentPage,
            limit,
            title: locationSearch.title || '',
            producerId: locationSearch.producerId || '',
        }));
    }, [currentPage, locationSearch.title, locationSearch.producerId, dispatch]);

    const handleDeleteClick = (e, movie) => {
        e.stopPropagation();
        setState({
            ...state,
            deleteDialogOpen: true,
            movieToDelete: movie,
        });
    };

    const handleDeleteConfirm = () => {
        dispatch(moviesActions.deleteMovie(state.movieToDelete.id))
            .then(() => {
                dispatch(moviesActions.fetchMovies({
                    page: currentPage,
                    limit,
                    title: locationSearch.title || '',
                    producerId: locationSearch.producerId || '',
                }));

                setState({
                    ...state,
                    deleteDialogOpen: false,
                    movieToDelete: null,
                    notification: {
                        message: formatMessage({ id: 'movie.deleted.success' }),
                        type: 'success',
                    },
                });
                setTimeout(() => {
                    setState(prev => ({ ...prev, notification: null }));
                }, 3000);
            })
            .catch(() => {
                setState({
                    ...state,
                    notification: {
                        message: formatMessage({ id: 'movie.deleted.error' }),
                        type: 'error',
                    },
                });
            });
    };

    const handleMovieClick = (movieId) => {
        changePage({
            locationSearch,
            pathname: `${pagesURLs[pages.movieDetail]}/${movieId}`,
        });
    };

    const handleAddMovie = () => {
        changePage({
            locationSearch,
            pathname: `${pagesURLs[pages.movieDetail]}/new`,
        });
    };

    const handleApplyFilter = () => {

        console.log('Applying filter:', {
            title: state.filterTitle,
            producerId: state.filterProducerId,
        });

        changePage({
            locationSearch: {
                ...locationSearch,
                title: state.filterTitle,
                producerId: state.filterProducerId,
                page: '1',
            },
        });
        setState({
            ...state,
            filterDialogOpen: false,
        });
    };

    const handlePageChange = (newPage) => {
        changePage({
            locationSearch: {
                ...locationSearch,
                page: String(newPage),
            },
        });
    };

    const totalPages = Math.ceil(movies.totalCount / limit);

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="title">
                    <strong>{formatMessage({ id: 'movies.list.title' })}</strong>
                </Typography>
                <div className={classes.filterButton}>
                    <Button
                        onClick={() => setState({ ...state, filterDialogOpen: true })}
                        variant="secondary"
                    >
                        <Typography>{formatMessage({ id: 'btn.filter' })}</Typography>
                    </Button>
                    <Button onClick={handleAddMovie} variant="primary">
                        <Typography color="inherit">
                            <strong>{formatMessage({ id: 'btn.add.movie' })}</strong>
                        </Typography>
                    </Button>
                </div>
            </div>

            {movies.isLoading && (
                <Typography>{formatMessage({ id: 'loading' })}</Typography>
            )}

            {!movies.isLoading && (
                <>
                    <div className={classes.list}>
                        {movies.list.map((movie) => (
                            <div key={movie.id} className={classes.card}>
                                <Hover onClick={() => handleMovieClick(movie.id)}>
                                    <Card  >
                                        <CardContent>
                                            <div className={classes.content}>
                                                <div className={classes.info}>
                                                    <Typography variant="subtitle">
                                                        <strong>{movie.title}</strong>
                                                    </Typography>
                                                    <div className={classes.meta}>
                                                        <Typography color="secondary">
                                                            {formatMessage({ id: 'movie.year' })}: {movie.releaseYear}
                                                        </Typography>
                                                        <Typography color="secondary">
                                                            {formatMessage({ id: 'movie.rating' })}: {movie.rating}
                                                        </Typography>
                                                        <Typography color="secondary">
                                                            {formatMessage({ id: 'movie.genre' })}: {movie.genre}
                                                        </Typography>

                                                        <Typography color="secondary">
                                                            Producer: {movie.producer?.name || '—'}
                                                        </Typography>

                                                    </div>
                                                </div>
                                                <div className={classes.deleteButton}>
                                                    <IconButton
                                                        onClick={(e) => handleDeleteClick(e, movie)}
                                                    >
                                                        <Typography variant="title">🗑️</Typography>
                                                    </IconButton>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Hover>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className={classes.pagination}>
                            <Button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                variant="secondary"
                            >
                                <Typography>{formatMessage({ id: 'btn.prev' })}</Typography>
                            </Button>
                            <Typography>
                                {currentPage} / {totalPages}
                            </Typography>
                            <Button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                variant="secondary"
                            >
                                <Typography>{formatMessage({ id: 'btn.next' })}</Typography>
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Dialog
                open={state.deleteDialogOpen}
                onClose={() => setState({ ...state, deleteDialogOpen: false })}
            >
                <Card>
                    <CardTitle>
                        <Typography variant="subtitle">
                            {formatMessage({ id: 'movie.delete.confirm' })}
                        </Typography>
                    </CardTitle>
                    <CardContent>
                        <Typography>
                            {state.movieToDelete && `${formatMessage({ id: 'movie.delete.message' }).replace('{title}', state.movieToDelete.title)}`}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            onClick={() => setState({ ...state, deleteDialogOpen: false })}
                            variant="secondary"
                        >
                            <Typography>{formatMessage({ id: 'btn.cancel' })}</Typography>
                        </Button>
                        <Button onClick={handleDeleteConfirm} variant="primary">
                            <Typography color="inherit">
                                <strong>{formatMessage({ id: 'btn.delete' })}</strong>
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Dialog>

            <Dialog
                open={state.filterDialogOpen}
                onClose={() => setState({ ...state, filterDialogOpen: false })}
            >
                <Card>
                    <CardTitle>
                        <Typography variant="subtitle">
                            {formatMessage({ id: 'filter.title' })}
                        </Typography>
                    </CardTitle>
                    <CardContent>
                        <div className={classes.filterDialog}>
                            <TextField
                                label={formatMessage({ id: 'filter.movie.title' })}
                                value={state.filterTitle}
                                onChange={(e) => setState({
                                    ...state,
                                    filterTitle: e.target.value
                                })}
                            />
                            <TextField
                                label={formatMessage({ id: 'filter.producer.id' })}
                                value={state.filterProducerId}
                                onChange={(e) => setState({
                                    ...state,
                                    filterProducerId: e.target.value
                                })}
                            />
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            onClick={() => setState({ ...state, filterDialogOpen: false })}
                            variant="secondary"
                        >
                            <Typography>{formatMessage({ id: 'btn.cancel' })}</Typography>
                        </Button>
                        <Button onClick={handleApplyFilter} variant="primary">
                            <Typography color="inherit">
                                <strong>{formatMessage({ id: 'btn.apply' })}</strong>
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Dialog>

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

export default MoviesList;