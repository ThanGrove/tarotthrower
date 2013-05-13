/*
 *   Tarot2.js : a javascript library for creating a tarot throw
 *
 */

var laytop = 25; // top of topmost card
var layside = 50; // left side of leftmost card
var ydiff = 20; // vertical difference between cards
var xdiff = 75; // horizontal difference between cards
var chgt = 170; // height of card image to resize to
var cwdt = 100; // width of card image to resize to
var deckFromBottom = 30; // how far from bottom is deck placed
var diff = -5; // difference between actual card width/height and outline

// Object that represents a card [TODO: MAKE ALL OBJECT Names Capitalized 1st letter]
function card(index, side, imgurl) {
  this.name = index + "";
  this.side = side;
  this.imgurl = imgurl;
  this.cardNum = 0;
  this.position = 0;
  this.div = null;
  this.makeDiv = function() {
    return $('<div id="card' + this.cardNum + 'div" class="carddiv"><img id="card' + this.cardNum +
              '" class="card" src="CARDSRC" /><canvas id="canvas' + 
              this.cardNum + '" class="cardCanvas" style="display: none;"></canvas></div>');
  };
  this.setCardNum = function(n) {
    this.cardNum = n;
    this.div = this.makeDiv();
  };
}

// Object that represents a specific deck
function deck(name, imgpath, imgext) {
  this.name = name;
  this.imgpath = imgpath;
  this.imgext = imgext;
  this.cardDataFile = "decks/" + this.name + "/carddata.htm";
  this.currentCard = 0;
  this.pickedCard = null;
  this.cards = new Array();
  this.init = function() { // called at end of deck object definition
    // this should be in document.ready() and get rid of this init
     $("div#deck, div#deck *, div#drawncards, div#drawncards *") // TODO: Change to 'drawncard'
          .css({"height": + chgt + "px !important", "width": + cwdt + "px !important"});
      this.shuffle();
  };
  
  this.shuffle = function() {
    var temp = new Array(78);
    for (var n=0; n<78; n++) { temp[n] = n; }
    for (var n=78; n>0; n--) {
      var ind = Math.floor(rng()*n);
      var side = Math.floor(rng()*2);
      var myindex = temp.splice(ind,1);
      var myimg = this.imgpath + this.ind + ((side == 1)?"_down.":".") + this.imgext;
      deck.cards.push(new card(myindex, side, myimg)); // Add ,imgurl parameter with path to image
    }
  };
  
  this.pick = function() {
    if(this.cards.length > 0 ) {
      this.currentCard++;
      this.pickedCard = this.cards.shift();
      this.pickedCard.cardNum = this.currentCard;
    } else {
      this.pickedCard = null;
    }
    return this.pickedCard;
  };
  
  this.check = function() {
    var temp = new Array();
    var noerrors = true;
    for(var n in this.cards) {
      var c = this.cards[n];
      var nm = c.name;
      if(typeof(temp[nm])=="undefined") {
        temp[nm] = 1;
      } else {
        temp[nm]++;
        console.log("Duplicate Card (" + nm + " : " + temp[nm] + ")!");
        console.log(c);
        noerrors = false;
      }
    }
    if(noerrors) { console.info("All cards are unique in this deck!");}
  };
  
  this.init();
};

// Object that represents a position of a card in a layout
var position = function(t, l, h, w) {
  this.top = t;
  this.left = l;
  this.height = h;
  this.width = w;
  this.card = null;
  this.divid = "";
};

// A layout is an arrangement of tarot carots
var layout = function(name, positions) {
  this.name = name; // name of the layout
  this.positions = positions; // an array of positions in the array
  this.pos = function(n) {
    if(typeof(this.positions) == "array" && n > 0 && n < this.positions.length + 1 ) {
      return this.positions[n-1];
    } else {
      return false;
    }
  }
}

// Definition of Celtic Cross spread
var celtic = new layout("Celtic Cross Spread", [
  new position(laytop + chgt + ydiff, layside + cwdt + xdiff, chgt, cwdt),
  new position(laytop + chgt + ydiff + ((chgt - cwdt)/2), layside + cwdt + xdiff - ((chgt - cwdt)/2), cwdt, chgt),
  new position(laytop + (chgt + ydiff) * 2, layside + cwdt + xdiff, chgt, cwdt),
  new position(laytop + chgt + ydiff, layside, chgt, cwdt),
  new position(laytop, layside + cwdt + xdiff, chgt, cwdt),
  new position(laytop + chgt + ydiff, layside + (cwdt + xdiff) * 2, chgt, cwdt),
  new position(laytop + (chgt + ydiff) * 3, layside + (cwdt + xdiff) * 3, chgt, cwdt),
  new position(laytop + (chgt + ydiff) * 2, layside + (cwdt + xdiff) * 3, chgt, cwdt),
  new position(laytop + chgt + ydiff, layside + (cwdt + xdiff) * 3, chgt, cwdt),
  new position(laytop, layside + (cwdt + xdiff) * 3, chgt, cwdt)
]);

// Object that reprsents a spread. A spread is a particular "throw" of the tarot cards in a particular layout.
var spread = function(deckname, layout) {
  this.deckname = deckname;
  this.layout = layout;
  // set the outlines of a card
  this.setOutlines = function() {
    for(var n in this.layout.positions) {
      var cardPos = this.layout.positions[n];
      var cssOpts = {
        top:(cardPos.top + diff) + "px",
        left:(cardPos.left + diff) + "px",
        height:(cardPos.height ) + "px",
        width:(cardPos.width) + "px"
      };
      cardPos.divid = "#position" + (n + 1);
      if($(cardPos.divid).length == 0) {
        $("#canvas").append('<div id="' + cardPos.divid.replace('#','') + '" class="cardpos"></div>');
      }
      $(cardPos.divid).css(cssOpts).click(function() {
          $(this).addClass(".fillme");
          showPopup($(this).find("div.carddiv"));
      });
    }
  }
  this.setOutlines();
};

// initiate current tarot throw (create current thread)
var mythrow = new spread("Waite Smith", celtic);
