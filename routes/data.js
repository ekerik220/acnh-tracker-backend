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

router.get("/list", (req, res) => {
  res.send(all_data);
});

// GETs the total amount of items/variations for each data type
router.get("/count", (req, res) => {
  res.send({
    all: all_data.length,
    all_v: totalVariations(all_data),
    accessories: accessories.length,
    accessories_v: totalVariations(accessories),
    housewares: housewares.length,
    housewares_v: totalVariations(housewares),
    bags: bags.length,
    bags_v: totalVariations(bags),
    bottoms: bottoms.length,
    bottoms_v: totalVariations(bottoms),
    dressup: dressup.length,
    dressup_v: totalVariations(dressup),
    flooring: flooring.length,
    flooring_v: totalVariations(flooring),
    fossils: fossils.length,
    fossils_v: totalVariations(fossils),
    headwear: headwear.length,
    headwear_v: totalVariations(headwear),
    misc: misc.length,
    misc_v: totalVariations(misc),
    music: music.length,
    music_v: totalVariations(music),
    rugs: rugs.length,
    rugs_v: totalVariations(rugs),
    shoes: shoes.length,
    shoes_v: totalVariations(shoes),
    socks: socks.length,
    socks_v: totalVariations(socks),
    tops: tops.length,
    tops_v: totalVariations(tops),
    umbrellas: umbrellas.length,
    umbrellas_v: totalVariations(umbrellas),
    wallmounted: wallmounted.length,
    wallmounted_v: totalVariations(wallmounted),
    wallpaper: wallpaper.length,
    wallpaper_v: totalVariations(wallpaper),
  });
});

const totalVariations = (data) => {
  let count = 0;
  data.forEach((ele) => {
    count += ele.variations.length;
  });
  return count;
};

// TODO: Consider removing these functions.
// // Search by search term (req.query.s)
// router.get("/search", (req, res) => {
//   const data = all_data.filter((ele) => ele.name.includes(req.query.s));
//   res.send(data);
// });

// // GETs desired category (req.params.category)
// router.get("/:category", (req, res) => {
//   const data = eval(req.params.category);
//   res.send(data);
// });

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
