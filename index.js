const express = require('express');
const path = require('path');

const app = express();

let yarnstash = 
[
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
  ]

// route to get all the objects in yarnStash
app.get('/api/products', (req,res) => {
    res.json(yarnstash);
});


const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));