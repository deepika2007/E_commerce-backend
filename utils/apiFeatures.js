class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // search api 
  search() {
    const keyword = this.queryStr.search
      ? {
        "$or": [
          { name: { $regex: this.queryStr.search, $options: 'i' } },
          { slug: { $regex: this.queryStr.search, $options: 'i' } },
          { description: { $regex: this.queryStr.search, $options: 'i' } },
        ]
      } : []
    this.query = this.query.find({ ...keyword })
    return this;
  }

  // filter api
  filter() {
    const queryCopy = { ...this.queryStr }
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    // filter for price and rating
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }


  // pagination api
  pagination() {
    // limit- 10/20/30
    // page- offset 0/1/2
     this.query = this.query.limit(this.queryStr.limit).skip(this.queryStr.page) 
    return this;
  }
}
module.exports = ApiFeature
