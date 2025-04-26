const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

// middleware for handling incoming json data
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// hardcoded json array
let yarnstash = [
  {
    "name": "7 Brothers",
    "brand": "Novita",
    "colour": "#d85a8f",
    "colourName": "510 caramel, dye lot 3430",
    "weight": "Aran",
    "length": "200",
    "skeinweight": "100",
    "fiber": "80% Wool, 20% Polyamide",
    "skeinsOwned": "2",
    "notes": "Maybe for some socks",
    "variegation": false
  },
  {
    "name": "Nalle",
    "brand": "Novita",
    "colour": "#2ea853",
    "colourName": "347 saniainen",
    "weight": "Sport",
    "length": "260",
    "skeinweight": "100",
    "fiber": "80% Wool, 20% Nylon",
    "skeinsOwned": "3",
    "notes": "Boot socks for dad",
    "variegation": false
  },
  {
    "name": "Isoveli",
    "brand": "Novita",
    "colour": "#404040",
    "colourName": "044 graphite, dye lot 2290",
    "weight": "Chunky",
    "length": "130",
    "skeinweight": "100",
    "fiber": "80% Wool, 20% Nylon",
    "skeinsOwned": "3",
    "notes": "Hat for grandma",
    "variegation": false
  },
  {
    "name": "Karisma",
    "brand": "Drops",
    "colour": "#ce97a2",
    "colourName": "84 desert rose",
    "weight": "Aran",
    "length": "200",
    "skeinweight": "100",
    "fiber": "100% wool",
    "skeinsOwned": "12",
    "notes": "Sweater for myself, which pattern though?",
    "variegation": false
  },
  {
    "name": "Peo 30",
    "brand": "Silke",
    "colour": "#38180a",
    "colourName": "0247 dark brown",
    "weight": "Aran",
    "length": "200",
    "skeinweight": "100",
    "fiber": "100% merino wool",
    "skeinsOwned": "20",
    "notes": "Sweaters for the nephews for Christmas",
    "variegation": false
  },
  {
    "name": "7 Brothers Nummi",
    "brand": "Novita",
    "colour": "#deeaf7",
    "colourName": "945 frost",
    "weight": "Aran",
    "length": "200",
    "skeinweight": "100",
    "fiber": "76% Wool, 20% Polyamide, 4% Viscose",
    "skeinsOwned": "2",
    "notes": "Warm hat for winter",
    "variegation": true
  }
];


// function to generate a unique ID for each type of yarn to allow searching for a specific yarn (instead of just the first on the list)
// -> finds the yarn's brand + name + colour, normalizes letters like ä/ö to a/o, converts to lowercase, then generates the ID by 
//    removing everything except letters a-z and numbers 0-9 
function generateId(skein) {
  return (
    skein.brand.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '') +
    '_' +
    skein.name.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '') +
    '_' +
    skein.colourName.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '')
  );
}

// add the generated IDs to each yarn entry in the array
yarnstash = yarnstash.map(skein => ({
  ...skein,
  id: generateId(skein)
}));

// create method to initialize handlebars engine
const hbs = exphbs.create();

// set handlebars as view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// route to render the products on the page with handlebars
app.get('/products', (req, res) => {
  res.render('products', { yarnstash: yarnstash });
});


/* API ROUTES */

// route to get all products
app.get('/api/products', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: yarnstash.length,
    data: yarnstash
  });
});

// route to get one product based on brand - only returns the first one of said brand!
app.get('/api/product/:brand', (req, res) => {
  const brand = req.params.brand.toLowerCase();
  const product = yarnstash.find(product => product.brand.toLowerCase() === brand);

    if (!product) {
      return res.status(404).json({ msg: "No products found for this brand." });
    }

  res.json(product);

});

// route to get one product based on unique ID
app.get('/api/productid/:id', (req, res) => {
  const id = req.params.id;
  const product = yarnstash.find(product => product.id === id);

    if (!product) {
      return res.status(404).json({ msg: "No products found with this ID." });
    }

  res.json(product);

});

// route to get all the products of a specific brand
app.get('/api/products/:brand', (req,res) => {
  const brand = req.params.brand.toLowerCase();
  const products = yarnstash.filter(product => product.brand.toLowerCase() === brand);

    if (!products || products.length === 0) {
      return res.status(404).json({ msg: "No products found for this brand." });
    }

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: products
  });
});


// route to delete a product based on unique ID
app.delete('/api/products/:id', (req, res) => {
  const id = req.params.id;
  const product = yarnstash.find(product => product.id === id);

    if (product) {
      yarnstash = yarnstash.filter(product => product.id !== id);
      res.status(200).json({ msg: "Successfully deleted the item.", id: id});
    } else {
      res.status(404).json({ msg: "No product found with this ID." });
    }

});


// route to add a product
app.post('/api/post', (req,res) => {
  const newProduct = {
    name: req.body.name,
    brand: req.body.brand,
    colour: req.body.colour,
    colourName: req.body.colourName,
    weight: req.body.weight,
    length: req.body.length,
    skeinweight: req.body.skeinweight,
    fiber: req.body.fiber,
    skeinsOwned: req.body.skeinsOwned,
    notes: req.body.notes,
    variegation: req.body.variegation,
  };

  // add a unique ID for the new product, using the generateId function from  before
  const newId = generateId(newProduct);
  newProduct.id = newId;

  yarnstash.push(newProduct);
  res.location('http://localhost:5100/api/products/' + newId);
  res.status(201).json({msg: "Successfully added the new yarn entry.", newProduct});

});


// route to update the number of skeins owned 
app.patch('/api/productupdate/:id', (req, res) => {
  const idUpdate = req.params.id;
  const newSkeinsOwned = req.body.skeinsOwned;
  const product = yarnstash.find(product => product.id === idUpdate);

    if (product) {
      product.skeinsOwned = newSkeinsOwned;
      res.status(200).json({ msg: "Successfully updated the number of skeins owned.", product: product });
    } else {
      res.status(404).json({ msg: "No product found with this ID." });
    }

});


const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));