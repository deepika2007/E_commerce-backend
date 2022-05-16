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
          { description: { $regex: this.queryStr.search, $options: 'i' } },
          { category: { $regex: this.queryStr.search, $options: 'i' } }
        ]
      } : []
    this.query = this.query.find({ ...keyword })
    return this;
  }

  // filter api
  filter() {
    const queryCopy = { ...this.queryStr }
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