import React, {useEffect, useState} from 'react';
import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
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
import producersActions from '../actions/producers';
import { useListStyles } from '../../misc/hooks/useListStyles';

function ProducerList() {
    const {formatMessage} = useIntl();
    const {theme} = useTheme();
    const classes = useListStyles({theme});
    const dispatch = useDispatch();
    const changePage = useChangePage();
    const locationSearch = useLocationSearch();

    const producers = useSelector(({producers}) => producers);

    const [state, setState] = useState({
        deleteDialogOpen: false,
        producerToDelete: null,
        filterDialogOpen: false,
        filterName: locationSearch.name || '',
        filterYear: locationSearch.yearOfBirth || '',
        notification: null,
    });

    const currentPage = parseInt(locationSearch.page || '1', 10);
    const limit = 10;

    useEffect(() => {
        dispatch(producersActions.fetchProducers({
            page: currentPage,
            limit,
            name: locationSearch.name || '',
            yearOfBirth: locationSearch.yearOfBirth || '',

        }));
    }, [currentPage, locationSearch.name, locationSearch.yearOfBirth, dispatch]);

    const handleDeleteClick = (e, producer) => {
        e.stopPropagation();
        setState({
            ...state,
            deleteDialogOpen: true,
            producerToDelete: producer,
        });
    };

    const handleDeleteConfirm = () => {
        dispatch(producersActions.deleteProducer(state.producerToDelete.id))
            .then(() => {
                dispatch(producersActions.fetchProducers({
                    page: currentPage,
                    limit,
                    name: locationSearch.name || '',
                    yearOfBirth: locationSearch.yearOfBirth || '',
                }));

                setState({
                    ...state,
                    deleteDialogOpen: false,
                    producerToDelete: null,
                    notification: {
                        message: formatMessage({id: 'producer.deleted.success'}),
                        type: 'success',
                    },
                });
                setTimeout(() => {
                    setState(prev => ({...prev, notification: null}));
                }, 3000);
            })
            .catch(() => {
                setState({
                    ...state,
                    notification: {
                        message: formatMessage({id: 'producer.deleted.error'}),
                        type: 'error',
                    },
                });
            });
    };

    const handleProducerClick = (producerId) => {
        changePage({
            locationSearch,
            pathname: `${pagesURLs[pages.producerDetail]}/${producerId}`,
        });
    };
    const handleAddProducer = () => {
        changePage({
            locationSearch,
            pathname: `${pagesURLs[pages.producerDetail]}/new`,
        });
    };
    const handleApplyFilter = () => {
        changePage({
            locationSearch: {
                ...locationSearch,
                name: state.filterName,
                yearOfBirth: state.filterYear,
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

    const totalPages = Math.ceil(producers.totalCount / limit);
    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="title">
                    <strong>{formatMessage({id: 'producers.list.name'})}</strong>
                </Typography>
                <div className={classes.filterButton}>
                    <Button
                        onClick={() => setState({...state, filterDialogOpen: true})}
                        variant="secondary"
                    >
                        <Typography>{formatMessage({id: 'btn.filter'})}</Typography>
                    </Button>
                    <Button onClick={handleAddProducer} variant="primary">
                        <Typography color="inherit">
                            <strong>{formatMessage({id: 'btn.add.producer'})}</strong>
                        </Typography>
                    </Button>
                </div>
            </div>

            {producers.isLoading && (
                <Typography>{formatMessage({id: 'loading'})}</Typography>
            )}

            {!producers.isLoading && (
                <>
                    <div className={classes.list}>
                        {producers.list.map((producer) => (
                            <div key={producer.id} className={classes.card}>
                                <Hover onClick={() => handleProducerClick(producer.id)}>
                                    <Card>
                                        <CardContent>
                                            <div className={classes.content}>
                                                <div className={classes.info}>
                                                    <Typography variant="subtitle">
                                                        <strong>{producer.name}</strong>
                                                    </Typography>
                                                    <div className={classes.meta}>
                                                        <Typography color="secondary">
                                                            {formatMessage({id: 'producer.year'})}: {producer.yearOfBirth}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                <div className={classes.deleteButton}>
                                                    <IconButton
                                                        onClick={(e) => handleDeleteClick(e, producer)}
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
                                <Typography>{formatMessage({id: 'btn.prev'})}</Typography>
                            </Button>
                            <Typography>
                                {currentPage} / {totalPages}
                            </Typography>
                            <Button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                                variant="secondary"
                            >
                                <Typography>{formatMessage({id: 'btn.next'})}</Typography>
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Dialog
                open={state.deleteDialogOpen}
                onClose={() => setState({...state, deleteDialogOpen: false})}
            >
                <Card>
                    <CardTitle>
                        <Typography variant="subtitle">
                            {formatMessage({id: 'producer.delete.confirm'})}
                        </Typography>
                    </CardTitle>
                    <CardContent>
                        <Typography>
                            {state.producerToDelete && `${formatMessage({id: 'producer.delete.message'}).replace('{name}', state.producerToDelete.name)}`}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button
                            onClick={() => setState({...state, deleteDialogOpen: false})}
                            variant="secondary"
                        >
                            <Typography>{formatMessage({id: 'btn.cancel'})}</Typography>
                        </Button>
                        <Button onClick={handleDeleteConfirm} variant="primary">
                            <Typography color="inherit">
                                <strong>{formatMessage({id: 'btn.delete'})}</strong>
                            </Typography>
                        </Button>
                    </CardActions>
                </Card>
            </Dialog>

            <Dialog
                open={state.filterDialogOpen}
                onClose={() => setState({...state, filterDialogOpen: false})}
            >
                <Card>
                    <CardTitle>
                        <Typography variant="subtitle">
                            {formatMessage({id: 'filter.title'})}
                        </Typography>
                    </CardTitle>
                    <CardContent>
                        <div className={classes.filterDialog}>
                            <TextField
                                label={formatMessage({id: 'filter.producer.name'})}
                                value={state.filterName}
                                onChange={(e) => setState({
                                    ...state,
                                    filterName: e.target.value
                                })}
                            />
                            <TextField
                                label={formatMessage({id: 'filter.producer.yearOfBirth'})}
                                value={state.filterYear}
                                onChange={(e) => setState({
                                    ...state,
                                    filterYear: e.target.value
                                })}
                            />
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            onClick={() => setState({...state, filterDialogOpen: false})}
                            variant="secondary"
                        >
                            <Typography>{formatMessage({id: 'btn.cancel'})}</Typography>
                        </Button>
                        <Button onClick={handleApplyFilter} variant="primary">
                            <Typography color="inherit">
                                <strong>{formatMessage({id: 'btn.apply'})}</strong>
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

export default ProducerList;