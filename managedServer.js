const Hapi = require('hapi');

module.exports = function (handlers) {
    // set export MAX_PROCESSES=1 to avoid parallel processing
    // usert MAX_PROCESSES or set it to 0 to have an infinite number of parallel processes
    const MAX_PROCESSES = process.env.MAX_PROCESSES !== undefined
        ? parseInt(process.env.MAX_PROCESSES, 10)
        : 0;

    const server = Hapi.server({
        port: 3000,
        host: '0.0.0.0'
    });

    let runningProcesses = 0;

    function makeManagedHandler (fn) {
        async function wrapperFn (request, h) {
            try {
                if (MAX_PROCESSES === 0) {
                    // ALL PARALLEL
                    const fnResult = await fn(request, h);
                    return fnResult;
                } else {
                    // PARALLEL WITH MAX
                    function waitForMaxPromFn () {
                        return new Promise(resolve => {
                            async function waitForMax () {
                                if (runningProcesses >= MAX_PROCESSES) {
                                    setTimeout(waitForMax, 100);
                                } else {
                                    runningProcesses++;
                                    const fnResult = await fn(request, h);
                                    runningProcesses--;
                                    resolve(fnResult);
                                }
                            }

                            waitForMax();
                        });
                    }

                    const fnResult = await waitForMaxPromFn();
                    return fnResult;
                }
            } catch (err) {
                const errorMsg = `ERROR: ${err}`;
                console.log(errorMsg);
                return h.response(errorMsg)
                    .code(500);
            }
        }

        return wrapperFn;
    }

    handlers.forEach(h => {
        h.handler = makeManagedHandler(h.handler);
        server.route(h);
    })

    const init = async () => {
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
        console.log(`  MAX_PROCESSES is set to: ${MAX_PROCESSES}`);
    };

    process.on('unhandledRejection', (err) => {
        console.log(err);
        process.exit(1);
    });

    process.on('SIGINT', function() {
        process.exit();
    });

    init();
};
