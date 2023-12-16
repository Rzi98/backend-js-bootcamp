const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4; // default is 4

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
    console.log('I/O finished');
    console.log('------------------');

    setTimeout(() => console.log('Timer 2 finished'), 0);
    setTimeout(() => console.log('Timer 3 finished'), 3000);
    setImmediate(() => console.log('Immediate 2 finished')); // this will be executed before the timer 2 because it is in the check phase and the timer 2 is in the timer phase

    process.nextTick(() => console.log('Process.nextTick')); // this will be executed before everything else because it is in the nextTick phase
    // this is the microtask queue

    // thread pool
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password encrypted');
    });

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password encrypted');
    });

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password encrypted');
    });

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password encrypted');
    });
});

console.log('Hello from the top-level code'); 

/*
    OUTPUT:
    Hello from the top-level code
    Timer 1 finished
    Immediate 1 finished
    I/O finished
    ------------------
    Process.nextTick
    Immediate 2 finished
    Timer 2 finished
    2357 Password encrypted
    2360 Password encrypted
    2457 Password encrypted
    2497 Password encrypted
    Timer 3 finished
*/