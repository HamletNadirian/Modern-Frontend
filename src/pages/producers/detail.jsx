import React, { useMemo } from 'react';
import IntlProvider from 'misc/providers/IntlProvider';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import getMessages from './intl';
import ProducerDetail from "app/containers/ProducerDetail";

function Detail(props) {
    const { lang } = useLocationSearch();
    const messages = useMemo(() => getMessages(lang), [lang]);
    return (
        <IntlProvider messages={messages}>
            <ProducerDetail {...props} />
        </IntlProvider>
    );
}

export default Detail;