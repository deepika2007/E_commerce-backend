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
  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1)
    if (!isNaN(skip)) { this.query = this.query.limit(resultPerPage).skip(skip) }
    return this;
  }
}
module.exports = ApiFeature