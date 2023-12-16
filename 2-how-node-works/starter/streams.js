const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
    // Solution 1: Loading the whole file into memory // inefficient for large files
    // fs.readFile('test-file.txt', (err, data) => {
    //     if (err) console.log(err);
    //     res.end(data);
    // });

    // Solution 2: Stream - read file in chunks and send to client as soon as it is available // better for large files
    // const readable = fs.createReadStream("test-file.txt"); // readable stream receive much faster than sendable stream -> backpressure problem
    // readable.on("data", (chunk) => {
    //     res.write(chunk);
    // });
    
    // readable.on("end", () => {
    //     res.end();
    // });

    // readable.on("error", (err) => {
    //     console.log(err);
    //     res.statusCode = 500;
    //     res.end("File not found!");
    // });

    // Solution 3: Pipe operator
    const readable = fs.createReadStream("test-file.txt");
    readable.pipe(res); // readableSource.pipe(writeableDestination)
    // readableSource.pipe(writeableDestination) -> automatically handles the backpressure problem
    // readableSource.pipe(writeableDestination) -> readableSource is a readable stream and writeableDestination is a writeable stream
    // readableSource.pipe(writeableDestination) -> readableSource.pipe() returns the destination stream so we can chain multiple pipe() calls
});

server.listen(8000, '127.0.0.1', () => console.log('Listening...'));
