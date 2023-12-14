module.exports = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); // replace all (/regex/g = global)
    output = output.replace(/{%IMAGE%}/g, product.image); // replace all
    output = output.replace(/{%PRICE%}/g, product.price); // replace all
    output = output.replace(/{%FROM%}/g, product.from); // replace all
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients); // replace all
    output = output.replace(/{%QUANTITY%}/g, product.quantity); // replace all
    output = output.replace(/{%DESCRIPTION%}/g, product.description); // replace all
    output = output.replace(/{%ID%}/g, product.id); // replace all

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); // replace all
    return output;
}