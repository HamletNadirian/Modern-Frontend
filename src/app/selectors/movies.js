export const selectMoviesWithProducer = (state) => {
    const producersById = Object.fromEntries(
        state.producers.list.map(p => [p.id, p])
    );

    return state.movies.list.map(movie => ({
        ...movie,
        producer: producersById[movie.producerId] || null,
    }));
};
