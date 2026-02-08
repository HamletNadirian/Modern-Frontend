import ProducersPage from 'pages/producers';
import React from 'react';
import PageContainer from './components/PageContainer';

const Producers = (props) => {
    return (
        <PageContainer>
            <ProducersPage {...props} />
        </PageContainer>
    );
};

export default Producers;