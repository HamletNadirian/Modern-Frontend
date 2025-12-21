import React, {useEffect, useState} from 'react';
import {createUseStyles} from 'react-jss';
import {useIntl} from 'react-intl';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Button from 'components/Button';
import Card from 'components/Card';
import CardContent from 'components/CardContent';
import CardTitle from 'components/CardTitle';
import CardActions from 'components/CardActions';
import IconButton from 'components/IconButton';
import TextField from 'components/TextField';
import Typography from 'components/Typography';
import useTheme from 'misc/hooks/useTheme';
import useChangePage from 'misc/hooks/useChangePage';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import * as pages from 'constants/pages';
import pagesURLs from 'constants/pagesURLs';
import producersActions from '../actions/producers';
import { useDetailStyles } from '../../misc/hooks/useDetailStyles';

function ProducerDetail() {
    const {formatMessage} = useIntl();
    const {theme} = useTheme();
    const classes = useDetailStyles({theme});
    const dispatch = useDispatch();
    const changePage = useChangePage();
    const locationSearch = useLocationSearch();
    const {id} = useParams();

    const producers = useSelector(({producers}) => producers);
    const isNew = id === 'new';

    const [state, setState] = useState({
        mode: isNew ? 'edit' : 'view',
        formData: {
            name: '',
            yearOfBirth: '',
        },
        originalData: null,
        validationErrors: {},
        notification: null,
        isSaving: false,
    });
    useEffect(() => {
        if (!producers.list?.length) {
            dispatch(producersActions.fetchProducers({ page: 1, limit: 50 }));
        }
    }, []);

    useEffect(() => {
        if (!isNew) {
            const producer = producers.list.find(p => p.id === id);
            if (producer) {
                setState(prev => ({
                    ...prev,
                    formData: {...producer},
                    originalData: {...producer},
                }));
            }
        }
    }, [id, producers.list, isNew]);

    const validateForm = () => {
        const errors = {};

        if (!state.formData.name || state.formData.name.trim() === '') {
            errors.name = formatMessage({id: 'validation.required'});
        }
        if (!state.formData.yearOfBirth) {
            errors.yearOfBirth = formatMessage({ id: 'validation.required' });
        } else if (isNaN(state.formData.yearOfBirth) || state.formData.yearOfBirth < 1900 || state.formData.yearOfBirth > 2007) {
            errors.yearOfBirth = formatMessage({ id: 'validation.year.invalid' });
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
                pathname: pagesURLs[pages.producersList],
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
            ? producersActions.createProducer(state.formData)
            : producersActions.updateProducer(id, state.formData);

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
                            id: isNew ? 'producer.created.success' : 'producer.updated.success'
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
                            pathname: pagesURLs[pages.producersList],
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
                        message: formatMessage({id: 'producer.save.error'}),
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
            pathname: pagesURLs[pages.producersList],
        });
    };

    const handleFieldChange = (field, value) => {
        setState({
            ...state,
            formData: {
                ...state.formData,
                [field]: value,
            },
            validationErrors: {
                ...state.validationErrors,
                [field]: undefined,
            },
        });
    };

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="title">
                    <strong>
                        {isNew
                            ? formatMessage({id: 'producer.create.name'})
                            : formatMessage({id: 'producer.detail.name'})
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
                                    {formatMessage({id: 'producer.field.name'})}
                                </Typography>
                                <Typography variant="subtitle">
                                    <strong>{state.formData.name}</strong>
                                </Typography>
                            </div>
                            <div className={classes.viewField}>
                                <Typography color="secondary">
                                    {formatMessage({ id: 'producer.field.year' })}
                                </Typography>
                                <Typography>{state.formData.yearOfBirth}</Typography>
                            </div>
                        </div>
                    ) : (
                        <div className={classes.form}>
                            <TextField
                                label={formatMessage({id: 'producer.field.name'})}
                                value={state.formData.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                required
                                isError={!!state.validationErrors.name}
                                helperText={state.validationErrors.name}
                            />
                            <TextField
                                label={formatMessage({ id: 'producer.field.year' })}
                                value={state.formData.yearOfBirth}
                                onChange={(e) => handleFieldChange('yearOfBirth', e.target.value)}
                                required
                                isError={!!state.validationErrors.yearOfBirth}
                                helperText={state.validationErrors.yearOfBirth}
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

export default ProducerDetail;