const QueryResponce = (model, populate) => async(req, res, next) => {

  let query; 
  //  copy req.query 
  const reqQuery = {...req.query };

  //  fields to exclude from query string because they are not supported by default, we are mutating it
  const removeFields = ['select', 'sort', 'page', 'limit'];
  
  //  remove removeFields from reqQuery
  removeFields.forEach(val => delete reqQuery[val]);
  
  //  query string to make changes
  let queryStr = JSON.stringify(reqQuery);
  
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=> `$${match}`);
  
  //  make query
  query = model.find(JSON.parse(queryStr));

  //  select: 
  if (req.query.select) {
    const selectedFields = req.query.select.replace(/,/g, ' ');
    query = query.select(selectedFields);
  }

  //  sort: 
  if (req.query.sort) {
    const sortingFields = req.query.sort.replace(/,/g, ' ');
    query = query.sort(sortingFields);
  }
  else 
    query = query.sort('-createdAt');

  //  Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20; 
  const startIndex = (page-1) * limit;
  const endIndex = page * limit;
  const total = model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //  fire query
  let resource = await query;
  if(populate)
    resource = await query.populate(populate);

  if (!resource) {
    next(new ErrorResponce(`no resource found`, 404))
  } else {
    let pagination = {};
    if(startIndex>0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }
    if(endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    res.advancedResponce = {
      success: true,
      pagination,
      count: resource.length,
      data: resource
    }
    next();
  }
}

module.exports = QueryResponce;