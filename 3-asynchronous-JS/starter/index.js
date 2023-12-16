const fs = require('fs');
const superagent = require('superagent');

const readFilePro = file => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (err, data) => {
            if(err) reject('I could not find that file 😢');
            resolve(data);
        });
    });
}

const writeFilePro = (file, data) => {  
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, err => {
            if(err) reject('Could not write file 😢');
            resolve('success');
        });
    });
}

const getDocPic = async () => {
    try {
        const data = await readFilePro(`${__dirname}/dog.txt`);
        console.log(`Breed: ${data}`);

        // Concurrently run 3 promises at the same time //
        const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

        const all = await Promise.all([res1Pro, res2Pro, res3Pro]);
        
        // convert to messagess array //
        const imgs = all.map(el => el.body.message);
        console.log(imgs);

        await writeFilePro('dog-img.txt', imgs.join('\n'));

        console.log('Random dog image saved to file!');
    } catch (error) {
        console.error('Error:', error.message);
        console.log('ERROR 💥');
        throw error;
    }

    return '2: READY 🐶';
};

// METHOD 1: USING PROMISES
(async () => {
    try {
        console.log('1: Will get dog pics!');
        const x = await getDocPic();
        console.log(x);
        console.log('3: Done getting dog pics!');
    } catch (error) {
        console.error('Error:', error.message);
        console.log('ERROR 💥');
    }
})();

// // METHOD 2: CALLING FUNCTION
// console.log('1: Will get dog pics!');
// getDocPic().then(x => {
//     console.log(x);
//     console.log('3: Done getting dog pics!');
// }).catch(err => {
//     console.error('Error:', err.message);
//     console.log('ERROR 💥');
// });

// console.log('3: Done getting dog pics!');