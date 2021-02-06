var cclayout = {
  "name" : "Celtic Cross Spread",
  "numberOfCards" : 10,
  "laytop" : 25, 
  "layside" : 50,
  "ydiff" : 20,
  "xdiff" : 75,
  "chgt" : 170,
  "cwdt" : 100,
  "positions" : [
    {
      "name" : "position1",
      "number" : 1,
      "title" : "The Querent",
      "meaning" : "Where you are presently with the situation",
      "top" : "this.laytop + this.chgt + this.ydiff",
      "left" : "this.layside + this.cwdt + this.xdiff",
      "orientation" : "upright"
    },
    {
      "name" : "position2",
      "number" : 2,
      "title" : "What Crosses You",
      "meaning" : "Where you happen to find yourself regarding the situation or a crosswind to the situation",
      "top" : "this.laytop + this.chgt + this.ydiff + ((this.chgt - this.cwdt)/2)",
      "left" : "this.layside + this.cwdt + this.xdiff - ((this.chgt - this.cwdt)/2)",
      "orientation" : "horizontal"
    },
    {
      "name" : "position3",
      "number" : 3,
      "title" : "The Basis of the Situation",
      "meaning" : "The foundation or basis upon which the present situation is grounded",
      "top" : "this.laytop + (this.chgt + this.ydiff) * 2",
      "left" : "this.layside + this.cwdt + this.xdiff",
      "orientation" : "upright"
    },
    {
      "name" : "position4",
      "number" : 4,
      "title" : "What is Behind You",
      "meaning" : "The events immediately preceding and leading up to the situation",
      "top" : "this.laytop + this.chgt + this.ydiff",
      "left" : "this.layside",
      "orientation" : "upright"
    },
    {
      "name" : "position5",
      "number" : 5,
      "title" : "What Crowns You and Could Come into Being",
      "meaning" : "Your conscious thoughts on the situation or what hover over as a potential",
      "top" : "this.laytop",
      "left" : "this.layside + this.cwdt + this.xdiff",
      "orientation" : "upright"
    },
    {
      "name" : "position6",
      "number" : 6,
      "title" : "What is Before You",
      "meaning" : "The near future, what is soon to manifest",
      "top" : "this.laytop + this.chgt + this.ydiff",
      "left" : "this.layside + (this.cwdt + this.xdiff) * 2",
      "orientation" : "upright"
    },
    {
      "name" : "position7",
      "number" : 7,
      "title" : "Your Attitude to the Situation",
      "meaning" : "Where you are at presently regarding the question asked",
      "top" : "this.laytop + (this.chgt + this.ydiff) * 3",
      "left" : "this.layside + (this.cwdt + this.xdiff) * 3",
      "orientation" : "upright"
    },
    {
      "name" : "position8",
      "number" : 8,
      "title" : "Your House",
      "meaning" : "Your environment or those you live with",
      "top" : "this.laytop + (this.chgt + this.ydiff) * 2",
      "left" : "this.layside + (this.cwdt + this.xdiff) * 3",
      "orientation" : "upright"
    },
    {
      "name" : "position9",
      "number" : 9,
      "title" : "Hopes and Fears",
      "meaning" : "Your greatest hope and/or worst fear",
      "top" : "this.laytop + this.chgt + this.ydiff",
      "left" : "this.layside + (this.cwdt + this.xdiff) * 3",
      "orientation" : "upright"
    },
    {
      "name" : "position10",
      "number" : 10,
      "title" : "The Outcome or Key",
      "meaning" : "The final outcome or the key to the situation",
      "top" : "this.laytop",
      "left" : "this.layside + (this.cwdt + this.xdiff) * 3",
      "orientation" : "upright"
    }
  ]
};