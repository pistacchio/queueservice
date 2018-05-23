const request = require('request');

for (let i = 0; i < 10; i++) {
    console.log(`calling ${i}`);
    request.get(`http://localhost:3000/${i}`, (error, response, body) => {
        console.log(`called ${body}`);
    });
}
