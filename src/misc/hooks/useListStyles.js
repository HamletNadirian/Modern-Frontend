import {createUseStyles} from 'react-jss';

export const useListStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: `${theme.spacing(2)}px`,
    },
    filterButton: {
        display: 'flex',
        gap: `${theme.spacing(1)}px`,
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
    },
    card: {
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.2s',
        '&:hover $deleteButton': {opacity: 1},
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    info: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(1)}px`,
        flex: 1,
    },
    meta: {
        display: 'flex',
        gap: `${theme.spacing(2)}px`,
    },
    deleteButton: {
        opacity: 0,
        transition: 'opacity 0.2s',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: `${theme.spacing(2)}px`,
        marginTop: `${theme.spacing(2)}px`,
    },
    filterDialog: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
    },
    notification: {
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 2000,
        minWidth: '300px',
    },
}));