const { default: slugify } = require("slugify");
const Category = require("../models/category");
const { RequestSuccess, RequestFailure } = require("../utils/Status");

const createCategories = (categories, parentId = null) => {

  const categoryList = [];
  let category;
  if (parentId == null) {
    category = categories.filter(cat => cat.parentId == undefined);
  } else {
    category = categories.filter(cat => cat.parentId == parentId);
  }
  for (let cat of category) {
    categoryList.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      ...(createCategories.length && { subCategory: createCategories(categories, cat._id) })
    })
  }
  return categoryList
}


exports.addCategory = async (req, res, next) => {
  const { name, parentId } = req.body;
  const categoryObj = {
    name,
    slug: slugify(name)
  }
  if (parentId) { categoryObj.parentId = parentId };
  const cat = new Category(categoryObj);
  await cat.save((err, category) => {
    if (err) RequestFailure(res, 400, err?.message || 'Bad request')
    if (category) RequestSuccess(res, 200, category);
  })
}

exports.getCategory = async (req, res, next) => {
  await Category.find().exec((err, categories) => {
    if (err) RequestFailure(res, 400, err?.message || 'Bad request')
    if (categories) {
      const categoryList = createCategories(categories)
      RequestSuccess(res, 200, categoryList);
    }
  });
}