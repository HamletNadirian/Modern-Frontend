import MovieDetailPage from 'pages/movies/detail';
import React from 'react';
import PageContainer from './components/PageContainer';

const MovieDetail = (props) => {
    return (
        <PageContainer>
            <MovieDetailPage {...props} />
        </PageContainer>
    );
};

export default MovieDetail;