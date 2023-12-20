class APIFeatures {
    constructor(query, queryString){ // query: mongoose query object // queryString: query string object
        this.query = query;
        this.queryString = queryString;
    }
    // FILTERING //
    filter(){
        const queryObj = {...this.queryString}; // destructuring: create a shallow copy of the query object 
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // fields to exclude from the query object
        excludedFields.forEach(el => delete queryObj[el]); // delete the fields (key) from the query object

        // Advanced Filtering //
        let queryStr = JSON.stringify(queryObj); // convert the query object to a string
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace the operators with $<operator>// \b: word boundary // g: global // 
        console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr)); // find all documents in the database
        return this; // return the entire object
    }
    // SORTING //
    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' '); // replace the commas with spaces
            this.query = this.query.sort(sortBy); // sort by the sortBy field
            // sort.('-price -ratingsAverage') -> 'price ratingsAverage' // syntax for multiple sorting fields // - for descending order
        }
        else{
            this.query = this.query.sort('-createdAt'); // default sorting by createdAt field descending order
        }
        return this;
    }
    // FIELD LIMITING //
    limitFields(){
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' '); // replace the commas with spaces
            this.query = this.query.select(fields); // select the fields
        }
        else {
            this.query = this.query.select('-__v'); // exclude the __v field
        }
        return this;
    }
    // PAGINATION //
    paginate(){
        const page = this.queryString.page * 1 || 1; // convert string to number // default page 1
        const limit = this.queryString.limit * 1 || 100; // default limit 100
        const skip = (page - 1) * limit; // number of documents to skip
        this.query = this.query.skip(skip).limit(limit); // skip the first skip documents and limit the number of documents to limit
        return this;
    }
}

module.exports = APIFeatures;