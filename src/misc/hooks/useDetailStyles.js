import { createUseStyles } from 'react-jss';
export const useDetailStyles = createUseStyles(theme => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(2)}px`,
    },
    viewField: {
        display: 'flex',
        flexDirection: 'column',
        gap: `${theme.spacing(0.5)}px`,
        marginBottom: `${theme.spacing(1)}px`,
    },
    actions: {
        display: 'flex',
        gap: `${theme.spacing(1)}px`,
        justifyContent: 'flex-end',
    },
    notification: {
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 2000,
        minWidth: '300px',
    },
}));