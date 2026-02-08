import React, { useMemo } from 'react';
import IntlProvider from 'misc/providers/IntlProvider';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import getMessages from './intl';
import MovieDetail from 'app/containers/MovieDetail';

function Detail(props) {
    const { lang } = useLocationSearch();
    const messages = useMemo(() => getMessages(lang), [lang]);
    return (
        <IntlProvider messages={messages}>
            <MovieDetail {...props} />
        </IntlProvider>
    );
}

export default Detail;