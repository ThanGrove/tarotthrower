// Another try at a tarot thrower js rewrite
/*
var deckJSON = decksbase + 'waite-smith/waite-smith-deck.json';
var layoutsbase = '../layouts/';
var layoutJSON = layoutsbase + 'celticcross.json';
*/

var sitebase = window.location.href.split('index.html')[0];
var decksbase = sitebase + '/decks/'.replace('//decks', '/decks');
var drawnTop = 500;
var drawnLeft = 1130;

// Document ready function initializes Deck and Layout objects
$(document).ready(function() {
  
  // Set Global variables for positioning
  drawnTop = $('#drawn').offset().top;
  drawnLeft = $('#drawn').offset().left;
  
  // Get Deck and Layout information
  Deck.init(wsdeckinfo);                       // initialize the Deck
  Layout.init(cclayout);                        // initialize Layout
  Layout.setPositionOutlines();

  // Set the event to fade out intro when showing
  $('#intro, #main').click(function() { $('#intro').fadeOut(); });
  
  // Set the Date
  var dstr = getDate();
  $("#qdate").attr("value",dstr);
  $("#date-cell span.txt").text(dateToString(dstr));
  
});

// the Deck Object 
var Deck = {
  name : '',
  imageLoc : '',
  imageType : '',
  revSuffix : '_down',
  horzSuffix : '_side',
  cardHeight : 0,
  cardWidth : 0,
  deckImage : '',
  numberOfCards : 0,
  cards : [],
  ready: false,
  
  // Set the initial information for the tarot deck from the data object given
  init : function(data) {
    if(typeof(data) != "object") {
      alert("Initialization data is not an object!");
      return;
    }
    this.name = data.name;
    this.imageLoc = data.imageLoc;
    this.imageType = data.imageType;
    this.deckImage = data.deckImage;
    this.cardHeight = data.cardHeight;
    this.cardWidth = data.cardWidth;
    this.numberOfcards = data.numberOfCards;
    // Iterate through data.cards array and create card objects
    for (var i in data.cards) {
      this.cards.push(this.makeCard(i, data.cards[i]));
    }
    this.shuffle();
    this.setClick(true);
    writedata('deckname', this.name);
    this.ready = true;
  },
  
  // Create a card object from the data 
  makeCard : function(n, cdata) {
    title = cdata[0];
    if(cdata[2] == 'Trumps') {
      title = cdata[1].toRomanNumeral() + '. ' + cdata[0];
    } else {
      title = cdata[0] + ' of ' + cdata[2];
    }
    return {
      "id" : n,
      "title" : title,
      "number" : cdata[1],
      "suit" : cdata[2],
      "upright" : true,
      "meaning" : cdata[3],
      "image" : decksbase + this.name.toLowerCase() + '/' + this.imageLoc + '/' + cdata[4]
    };
  },
  
  setClick : function(doit) {
    if(doit) {
      $("#deck").click(function() {
        Deck.drawCard();
      });
    } else {
      $("#deck").unbind('click');
    }
  },
  
  shuffle : function(seed) {
    // Need to check out http://davidbau.com/encode/seedrandom.js for the random number generator.
    var rnd = new MRG32k3a(); // Random number generator
    /*if(typeof(seed) == "undefined") {
      Math.seedrandom();
    } else {
      Math.seedrandom(seed);
    }*/
    var tempdeck = $.extend([],this.cards);
    this.cards = [];
    var cardnum = tempdeck.length;
    for(var i=0; i < cardnum; i++) {
      // take a random card from the remaining cards
      var rnum = Math.floor(rnd() * tempdeck.length); // Math.random() is rnd() with MRG32k3a
      var acard = tempdeck.splice(rnum,1)[0];
      // determine its orientation
      acard.upright = (Math.floor(rnd() * 2) == 1) ? true : false;
      acard.sideImage = (acard.image).replace('.' + this.imageType, this.horzSuffix + '.' + this.imageType);
      acard.sideImage = acard.sideImage.replace('_down','');
      if (!acard.upright && acard.image.indexOf('_down') == -1) {
        acard.image = (acard.image).replace('.' + this.imageType, this.revSuffix + '.' + this.imageType);
      } else if(acard.upright) {
        acard.image = acard.image.replace('_down','');
      }
      // add it to the deck
      this.cards.push(acard);
    }
  },
  
  drawCard : function() {
    if( $('#startbubble, #instructions').is(":visible")) {
      if(Layout.querent == '') { processForm(); }
      $('#startbubble, #instructions').fadeOut();
    }
    var card = this.cards.shift();
    $('#drawn img').attr('src', card.image);
    Layout.placeCard(card);
  },
  
  hide : function() {
    $('#deck, #drawn').hide();
    $('#deck').unbind('click');
    $('#readings').height( $('#readings').height() + this.cardHeight);
    // add a reset button
  }
};

var Layout = {
  name: '',
  numberOfCards: 0,
  laytop: 0,
  layside: 0,
  xdiff: 0,
  ydiff: 0,
  chgt: 0,
  cwdt: 0,
  outlinePadding: 5,
  positions: [],
  querent: '',
  qdate: '',
  question: '',
  
  init: function(data) {
    this.name = data.name;
    this.numberOfCards = data.numberOfCards;
    this.laytop = data.laytop;
    this.layside = data.layside;
    this.xdiff = data.xdiff;
    this.ydiff = data.ydiff;
    this.chgt = data.chgt;
    this.cwdt = data.cwdt;
    this.posIndex = 0;
    
    for(var i in data.positions) {
      var pos = data.positions[i];
      pos.top = eval(pos.top);
      pos.left = eval(pos.left);
      this.positions.push(pos);
    }
    writedata('layout', this.name);
  },
  
  setMetadata: function(q,d,qst) {
    if(typeof(q) == "undefined" || q == "") { q = "Anonymous"; }
    if(typeof(d) == "undefined" || d == "") { d = getDate(); }
    if(typeof(qst) == "undefined" || qst == "") { qst = "A general throw about the state of things."; }
    this.querent = q;
    this.qdate = d;
    this.question = qst;
    $('#throwspecs').append('<table>' +
      '<tr><td class="label">Querent:</td><td>' + q + '</td></tr>' +
      '<tr><td class="label">Date:</td><td>' + dateToString(d) + '</td></tr>' +
      '<tr><td class="label">Question:</td><td>' + qst + '</td></tr>' +
      '</table>'
    );
  },
  
  setPositionOutlines : function() {
    for(var i in this.positions) {
      var pos = this.positions[i];
      $('#canvas').append('<div id="' + pos.name + '" class="cardpos"></div>');
      var cssOpts = {
        top:(pos.top - this.outlinePadding) + "px",
        left:(pos.left - this.outlinePadding) + "px",
        height:(this.chgt) + "px",
        width:(this.cwdt) + "px"
      };
      if(pos.orientation == "horizontal") {
        cssOpts.height = (this.cwdt) + "px";
        cssOpts.width = (this.chgt) + "px";
      }
      $("div#" + pos.name).css(cssOpts);
      pos.selector = '#' + pos.name;
    }
  },
  
  placeCard : function(card) {
    Deck.setClick(false);
    var pos = this.positions[this.posIndex];
    pos.card = card;
    var oval = (!pos.card.upright)? "R":"";
    writedata('pos' + this.posIndex, card.id + oval); 
    $('#drawn').animate({
        top : "-=" + (drawnTop - pos.top) + "px",
        left : "-=" + (drawnLeft - pos.left) + "px"
      }, 2000, function() {
        $('#drawn').find('img').appendTo(pos.selector);
        if(pos.orientation == "horizontal") {
          var src = pos.card.sideImage;
          $(pos.selector + ' img').attr('src', src);
          $(pos.selector + ' img').css({
            height: Layout.cwdt + 'px',
            width: Layout.chgt + 'px'
          });
        } else {
          $(pos.selector + ' img').css({
            height: Layout.chgt + 'px',
            width: Layout.cwdt + 'px'
          });
        }
        Layout.setCardClick(pos);
        $(pos.selector).css('border','none');
        Layout.writeInterpretation(pos);
        $('#drawn').css({
          top: drawnTop,
          left: drawnLeft
        }).append('<img src="images/cardpad.png" />');
        // If total number of cards drawn hide the deck
        if(Layout.posIndex == Layout.numberOfCards) {
          setTimeout('Deck.hide()',5000);
          $("#deck").unbind('click');
          $("#savethrowlink").show();
        }
        Deck.setClick(true);
    });
    this.posIndex++;
  },
  
  setCardClick : function(pos) {
    if(pos.orientation == "upright") {
      $(pos.selector + ' img').click(function() {
        if($(this).height() == Layout.chgt) {
          $(this).css({
            height: Deck.cardHeight + 'px',
            width: Deck.cardWidth + 'px'
          });
          $(this).parent('div').css('z-index',1000);
        } else {
          $(this).css({
            height: Layout.chgt + 'px',
            width: Layout.cwdt + 'px'
          });
          $(this).parent('div').css('z-index',0);
        }
      });
    } else {
      $(pos.selector + ' img').click(function() {
        if($(this).height() == Layout.cwdt) {
          $(this).css({
            height: Deck.cardWidth + 'px',
            width: Deck.cardHeight + 'px'
          });
        } else {
          $(this).css({
            height: Layout.cwdt + 'px',
            width: Layout.chgt + 'px'
          });
        }
      });
    }
  },
  
  writeInterpretation: function(pos) {
    var li = '<li id="' + pos.name + '-desc"><span class="position" title="' + pos.meaning + '">' + pos.title + ':</span> <span class="card">' + pos.card.title;
    if(!pos.card.upright) {  li += ' (<a title="A reversed card can indicate:  1. a negative or unhealthy manifestation of the cards meaning, 2. one is unconscious of the cards energy, 3. the energy or force represented by the card is imperfectly manifested, or 4. the opposite of the cards normal meaning.">rev</a>)'; }
    li += ' </span> = ' + pos.card.meaning + '</li>';
    $('#readings ol').append(li);
    document.getElementById('readings').scrollTop=$('#readings').height();
  },
  /*
  writePositions: function() {
    for (var i in this.positions) {
      console.info(this.positions[i]);
    }
  }*/
};

/* Helper Functions */
function getDate() {
  var d = new Date();
  return (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate());
}

String.prototype.toRomanNumeral = function() {
  if(isNaN(this) || parseInt(this) == 0) {return this;}
  var s = parseInt(this);
  var rn = "";
  var tens = parseInt(s/10);
  for (var n = 0; n < tens; n++) {
    rn += "X";
    s -= 10;
  }
  if (s == 9 ) {
    rn += "IX";
    s = 0;
  }
  if(s > 4) {
    rn += "V";
    s -= 5;
  }
  if(s == 4) {
    rn += "IV";
    s = 0;
  }
  for (var n = 0; n < s; n++) {
    rn += "I";
  }
  return rn;
};

// assumed yyyy-mm-dd format
function dateToString(s) {
  var months = ["none", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var pts = s.split('-');
  if(pts.length < 3 || pts[1] > 12 || pts[1] < 1) { return "Not a date!";}
  return months[parseInt(pts[1])] + ' ' + pts[2] + ', ' + pts[0];
}

function processForm() {
  var qname = $("#qname").val();
  var qdate = $("#qdate").val();
  var qtext = $("#qtext").val();
  Layout.setMetadata(qname,qdate,qtext);
  writedata('qname', qname);
  writedata('qdate', qdate);
  writedata('qtext', qtext);
  Deck.shuffle(qname + qdate + qtext);
  $('#instructions, #ulinks').fadeOut();
  $('#startbubble, #throwspecs, #resetlink').fadeIn();
}

function writedata(k, v) {
  $('#datastore').append('<input class="tdata" type="text" name="' + k + '" value="' + v + '" />');
}

