const router = require("express").Router();
// TODO: if we delete 3 functions below we won't need this either.
//const ITEMS_PER_PAGE = 20;

// DATA
// Storing the data locally on the backend since asking
// the DB for it takes about 1.5 seconds. Data is too
// big to realistically store front end when considering
// mobile devices as well as future plans to increase amount
// of data.
const accessories = require("../data/accessories");
const bags = require("../data/bags");
const bottoms = require("../data/bottoms");
const dressup = require("../data/dressup");
const flooring = require("../data/flooring");
const fossils = require("../data/fossils");
const headwear = require("../data/headwear");
const housewares = require("../data/housewares");
const misc = require("../data/misc");
const music = require("../data/music");
const rugs = require("../data/rugs");
const shoes = require("../data/shoes");
const socks = require("../data/socks");
const tops = require("../data/tops");
const umbrellas = require("../data/umbrellas");
const wallmounted = require("../data/wallmounted");
const wallpaper = require("../data/wallpaper");
const all_data = [].concat(
  accessories,
  bags,
  bottoms,
  dressup,
  flooring,
  fossils,
  headwear,
  housewares,
  misc,
  music,
  rugs,
  shoes,
  socks,
  tops,
  umbrellas,
  wallmounted,
  wallpaper
);

// Search by search term (req.query.s)
router.get("/search", (req, res) => {
  const data = all_data.filter((ele) => ele.name.includes(req.query.s));
  res.send(data);
});

// GETs desired category (req.params.category)
router.get("/:category", (req, res) => {
  const data = eval(req.params.category);
  res.send(data);
});

// TODO: Consider removing these functions.
/*const getDataBySearchTerm = (searchTerm, pageNumber) => {
  const data = all_data.filter((ele) => ele[0].name.includes(searchTerm));
  return paginate(data, pageNumber);
};

const getDataByCategory = (category, pageNumber) => {
  const data = eval(category);
  return paginate(data, pageNumber);
};

const paginate = (data, pageNumber) => {
  const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
  let endIndex = pageNumber * ITEMS_PER_PAGE;
  if (endIndex >= data.length) endIndex = data.length - 1;
  const page = data.slice(startIndex, endIndex);
  return page;
};*/

module.exports = router;
