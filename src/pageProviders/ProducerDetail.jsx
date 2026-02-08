import ProducerDetailPage from 'pages/producers/detail';
import React from 'react';
import PageContainer from './components/PageContainer';

const ProducerDetail = (props) => {
    return (
        <PageContainer>
            <ProducerDetailPage {...props} />
        </PageContainer>
    );
};

export default ProducerDetail;