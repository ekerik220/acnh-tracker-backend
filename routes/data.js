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

// Search by search term (req.query.s)
router.get("/search", (req, res) => {
  const search = all_data.filter((ele) => ele.name.includes(req.query.s));
  res.send(search);
});

// GETs desired page (req.query.p) of desired data (/:data)
router.get("/:data", (req, res) => {
  const data = eval(req.params.data);
  const startIndex = (req.query.p - 1) * ITEMS_PER_PAGE;
  const endIndex = req.query.p * ITEMS_PER_PAGE;
  const page = data.slice(startIndex, endIndex);
  res.send(page);
});

module.exports = router;
