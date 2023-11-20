export default {
    resolve: {
        fallback: {
            "https": false,
            "zlib": false,
            "http": false,
            "url": false
        }
    },
    module: {
        unknownContextCritical: false
    }
};