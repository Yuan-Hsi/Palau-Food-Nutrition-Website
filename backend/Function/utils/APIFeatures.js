class APIFeatures {
  constructor(query, queryString) {
    this.query = query; // The monogoDB model.find() method
    this.queryString = queryString; // The queryString in the URL
  }

  filter() {
    const queryObj = { ...this.queryString };

    // Exclue the words not used for the search query
    const excluedInQuery = ["page", "field", "limit", "sort", "q"];
    excluedInQuery.map((item) => {
      delete queryObj[item];
    });

    // Transform the wrod get  gte, gt, e, lt, lte   ----> $gte, $gt, $e, $lt, $lte
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|e|lt|lte)\b/g,
      (match) => "$" + match
    );
    /*
    console.log(JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr)); // 會返回一個查詢結果的 Promise 來去後面給 await 去拿
*/
    // 轉換回物件
    let filters = JSON.parse(queryStr);

    // 如果有 `q` 參數，則加入全文搜尋
    if (this.queryString.q) {
      filters.$text = { $search: this.queryString.q };
    }

    console.log("🔍 查詢條件:", filters);
    this.query.find(filters);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-timestamp");
    }

    return this;
  }

  limitFields() {
    //exclued the information we don't need
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 4;
    this.query = this.query.skip((page - 1) * limit).limit(limit); // skip means how amount you want to skip, limit is how mount results you want

    return this;
  }
}

module.exports = APIFeatures;
