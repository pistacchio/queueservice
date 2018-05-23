module.exports = function (request, h) {
    return new Promise((resolve, reject) => {
        console.log(`serving ${request.params.id}`);
        setTimeout(() => {
            console.log(`served ${request.params.id}`);
            resolve(request.params.id)
        }, Math.random() * 3000);
    });
}
