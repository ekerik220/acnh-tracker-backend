const router = require("express").Router();
const ITEMS_PER_PAGE = 20;

// DATA
// Storing the data locally on the backend since asking
// the DB for it takes about 1.5 seconds. Data is too
// big to realistically store front end, too.
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

// Search by search term (req.query.s), and use pagination (req.query.p)
router.get("/search", (req, res) => {
  const data = getDataBySearchTerm(req.query.s, req.query.p);
  res.send(data);
});

// GETs desired page (req.query.p) of desired category (req.params.category)
router.get("/:category", (req, res) => {
  const data = getDataByCategory(req.params.category, req.query.p);
  res.send(data);
});

const getDataBySearchTerm = (searchTerm, pageNumber) => {
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
};

module.exports = router;
