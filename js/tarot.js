var backgroundSongUrl = "http://paganpresence.com/sndsmple/SequoiaRecords/PPMSQUX204-ST02A.mp3";
var deckName = "waite-smith";
var imgBase = "decks/" + deckName + "/images/";
var imgExt = ".jpg";
var cardDataFile = "decks/" + deckName + "/carddata.htm";
var cardNumber = 0;
var picked = new Array();
var rng = new MRG32k3a(); // Random number generator
var laytop = 25; // top of topmost card
var layside = 50; // left side of leftmost card
var ydiff = 20; // vertical difference between cards
var xdiff = 75; // horizontal difference between cards
var chgt = 170; // height of card image to resize to
var cwdt = 100; // width of card image to resize to
var deckFromBottom = 30; // how far from bottom is deck placed
var diff = -5; // difference between actual card width/height and outline
var card1full = false; // has the card in position 1 been put
var cardPositions = new Array(
  { "name":"position1", "top": laytop + chgt + ydiff, "left": layside + cwdt + xdiff,
        "height": chgt, "width": cwdt, "desc": "Where You Are Right Now"},
  { "name":"position2", "top": laytop + chgt + ydiff + ((chgt - cwdt)/2), "left": layside + cwdt + xdiff - ((chgt - cwdt)/2),
        "height": cwdt, "width": chgt, "desc": "What Crosses Your Path"},
  { "name":"position3", "top": laytop + (chgt + ydiff) * 2, "left": layside + cwdt + xdiff,
        "height": chgt, "width": cwdt, "desc": "The Basis of the Situation"},
  { "name":"position4", "top": laytop + chgt + ydiff, "left": layside,
        "height": chgt, "width": cwdt, "desc": "What is Behind"},
  { "name":"position5", "top": laytop, "left": layside + cwdt + xdiff,
        "height": chgt, "width": cwdt, "desc": "What is Hovering Above You"},
  { "name":"position6", "top": laytop + chgt + ydiff, "left": layside + (cwdt + xdiff) * 2,
        "height": chgt, "width": cwdt, "desc": "What is Ahead"},
  { "name":"position7", "top": laytop + (chgt + ydiff) * 3, "left": layside + (cwdt + xdiff) * 3,
        "height": chgt, "width": cwdt, "desc": "Your Attitude"},
  { "name":"position8", "top": laytop + (chgt + ydiff) * 2, "left": layside + (cwdt + xdiff) * 3,
        "height": chgt, "width": cwdt, "desc": "Your House"},
  { "name":"position9", "top": laytop + chgt + ydiff, "left": layside + (cwdt + xdiff) * 3,
        "height": chgt, "width": cwdt, "desc": "Hopes & Fears"},
  { "name":"position10", "top": laytop, "left": layside + (cwdt + xdiff) * 3,
        "height": chgt, "width": cwdt, "desc": "The Outcome or Key"}
);

var revExp = '<div id="revmean">An upside down or reversed card can mean anyone of the following: <ul>' +
            '<li>a negative or unhealthy manifestation of the card\'s meaning</li>' +
            '<li>one is unconscious what the card represents</li>' +
            '<li>the energy or force represented by the card is imperfectly or partially manifested</li>' +
            '<li>the opposite of the card\'s normal meaning</li>' +
            '</ul></div>';
            
$(document).ready(function() {
    $("#jquery_jplayer_1").jPlayer({
        ready: function() {
          $(this).jPlayer("setMedia", {
            mp3: backgroundSongUrl
          }).jPlayer("play");
          var click = document.ontouchstart === undefined ? 'click' : 'touchstart';
          var kickoff = function () {
            $("#jquery_jplayer_1").jPlayer("play");
            document.documentElement.removeEventListener(click, kickoff, true);
          };
          document.documentElement.addEventListener(click, kickoff, true);
        },
        loop: true,
        swfPath: "js/"
    });
    $("#soundctrl").data("muted", false);
    $("#soundicon").click(function() {
       toggleMute();
    });
    setTimeout(doTarotIntro(throwInit),1000);
    setTimeout(function() { if( !$("#soundctrl").data("muted")) {toggleMute();}}, 180000);
});

function doTarotIntro(callback) {
    $("#main").hide();
    $("#splash .imgdiv img").css({height: '0', width: '0'});
    $("#splash .imgdiv").show();
    $("#splash img").animate({height: '90%', width: '90%'},3000, function() {
        setTimeout(function() { $("#splash img").fadeOut(1000);},1000);
        $("#splash").slideUp(2000, function() {$("#main").fadeIn(500, callback)});
    });
}

function toggleMute() {
    var ismuted = $("#soundctrl").data("muted");
    var action = (ismuted)? "unmute" : "mute";
    var img = (ismuted)? "sound-icon.png" : "no-sound-icon.png";
    $("#jquery_jplayer_1").jPlayer(action);
    $("#soundicon").attr('src','images/' +img);
    $("#soundctrl").data("muted", (!ismuted));
}

function throwInit() {
    setCardOutlines();
    setReadingsTable();
    deck.shuffle();
    $("#deck").mousedown(function() {pickNewCard();});
    $('#closebtn').click(function() { $('#popup').hide(); });
}

function card(index, side) {
  this.name = index + "";
  this.side = side;
  this.position = 0;
}

var deck = {
  cards : new Array(),
  
  shuffle : function() {
    var temp = new Array(78);
    for (var n=0; n<78; n++) { temp[n] = n; }
    for (var n=78; n>0; n--) {
      var ind = Math.floor(rng()*n);
      var side = Math.floor(rng()*2);
      var myindex = temp.splice(ind,1);
      deck.cards.push(new card(myindex,side));
    }
  },
  
  pick : function() {
    if(this.cards.length > 0 ) {
      return this.cards.shift();
    } else {
      alert("There are no more cards in the deck!");
      return false;
    }
  },
  
  check : function() {
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
  },
  
  toString : function() {
    var out = "";
    for(var n in this.cards) {
      var c = this.cards[n];
      out += c.name + ", ";
    }
    return out;
  }
  
};

function setCardOutlines() {
  $("div#deck, div#deck *, div#drawncards, div#drawncards *")
  		.css({"height": + chgt + "px !important", "width": + cwdt + "px !important"});
  for(var n in cardPositions) {
    var cardPos = cardPositions[n];
    var debug = card.name + ", ";
    var cssOpts = {
      top:(cardPos.top + diff) + "px",
      left:(cardPos.left + diff) + "px",
      height:(cardPos.height ) + "px",
      width:(cardPos.width) + "px"
    };
    $("div#" + cardPos.name).css(cssOpts);
    $("div#" + cardPos.name).click(function() {
        $(this).addClass(".fillme");
        showPopup($(this).find("div.carddiv"));
    });
  }
}

function setReadingsTable() {
    for(var n in cardPositions) {
        var cardPos = cardPositions[n];
        console.info(cardPos.desc);
        $("#readings table").append('<tr><td><b>' + cardPos.desc + ':</b></td><td></td></tr>');
    }
}

function pickNewCard() {
  var newcard = deck.pick();
  if (newcard) {
  	$('div#deck').css('z-index','0');
    cardNumber++;
    var cardSide = (newcard.side == 1)?"":"_down";
    var cardSrc = imgBase + newcard.name + cardSide + imgExt;
    newcard.src = cardSrc;
    var markup = '<div id="cardNUMdiv" class="carddiv"><img id="cardNUM" class="card" src="CARDSRC" />' +
      '<canvas id="canvasNUM" class="cardCanvas" style="display: none;"></canvas></div>';
    markup = markup.replace(/NUM/g,cardNumber);
    markup = markup.replace('CARDSRC',cardSrc);
    $("#drawncards").append(markup);
    $("#card" + cardNumber + "div img").css({"height": + chgt + "px", "width": + cwdt + "px !important"});
    $("#card" + cardNumber + "div").data("card",newcard);
    $("#card" + cardNumber + "div").draggable({
    	// When Dragging a card
      drag: function(event, ui) {
        var x = event.pageX;
        var y = event.pageY;
        var pos = inPosition(event);
        $(".selected-card").removeClass("selected-card");
        if(pos) {
					$("div#position" + pos).addClass("selected-card");
				}
      },
      
      // When stop dragging, check to see if it is in a position and act appropriately
      stop: function(event, ui) {
        var x = event.pageX;
        var y = event.pageY;
        var pos = inPosition(event);
        if(pos) { 
					if(pos == 1) { card1full = true; }
					if(pos == 2) {
            rotateImage($(this),-90);
          } else {
            $(this).find("canvas").remove();
          }
					$('div#deck').css('z-index','500');
        	$(".selected-card").removeClass("selected-card");
					$("div#position" + pos).addClass("selected-card");
					var cpos = cardPositions[pos - 1];
					var ael = document.createElement('a')
					$(ael).attr('href','#');
					$(ael).append($(this).detach());
					$('#' + cpos.name).append(ael);	
					var carddata = $(this).data("card");
					carddata.position = pos;
					$(this).data("card", carddata);
          $("div#position" + pos).css("border","none");
          $("div#position" + pos).find("div.carddiv").removeClass("ui-draggable");
				}
      }
    });
  }
}

function inPosition(e) {
	var x = e.pageX;
	var y = e.pageY;
	var inOne = false;
	var inPosition = false;
	for(var n in cardPositions) {
		var card = cardPositions[n];
		var mywidth = (n == 2)? chgt : cwdt;
		var myheight = (n == 2)? cwdt : chgt;
		if(x > card.left && x - card.left < mywidth) {
			if(y > card.top && y - card.top < myheight) {
				inPosition = card.name.replace('position','');
				if(inPosition) { inPosition = parseInt(inPosition); }
				if(inPosition == 1 && !card1full) {inOne = true;}
			}
		}
	}
	if(inOne) { inPosition = 1; }
	return inPosition;
}

function rotateImage(cardDiv, degree)
{
  cardDiv.find("canvas").show();
  var cardImage = cardDiv.find("img");
  var img = document.getElementById(cardImage.attr("id"));
  var canvasId = cardDiv.find("canvas").attr("id");
  if(document.getElementById(canvasId)){
    var canvas = document.getElementById(canvasId);
    var cContext = canvas.getContext('2d');
    var cw = cwdt, ch = chgt, cx = 0, cy = 0;
     
    //   Calculate new canvas size and x/y coorditates for image
    switch(degree){
      case 90:
          cw = chgt;
          ch = cwdt;
          cy = chgt * (-1);
          break;
      case 180:
          cx = cw * (-1);
          cy = ch * (-1);
          break;
      case -90:
          cw = img.height;
          ch = img.width;
          cx = img.width * (-1);
          break;
    }

    //  Rotate image            
    canvas.setAttribute('width', cw);
    canvas.setAttribute('height', ch);
    cContext.rotate(degree * Math.PI / 180);
    cContext.drawImage(img, cx, cy, ch, cw);
    cardImage.hide();
  } else {
    //  Use DXImageTransform.Microsoft.BasicImage filter for MSIE
    switch(degree){
      case 0: image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0)'; break;
      case 90: image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=1)'; break;
      case 180: image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=2)'; break;
      case 270: image.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)'; break;
    }
  }
}

function showPopup(carddiv) {
	var cd = $(carddiv).data('card');
	$("#popcard img").attr('src', cd.src);
  $.ajax({
    type: "GET",
    url: cardDataFile,
    async: false,
    success: function(data) {
        var cname = (cd.name.length == 1)? '0' + cd.name : cd.name;
        var stind = data.indexOf('<div id="card' + cname + '">');
        var endind = data.indexOf('</div>', stind);
        var div = data.substr(stind, endind - stind);
        //alert(cd.name + ":" + $(data).find('#card' + cd.name).length);
        if(cd.side == 0 ) { div = div + revExp; }
        $("#popdesc").html(div);
        $('#popup').fadeIn('slow');
    }
  });
}

// Function to enlarge or shrink back a card
// 	param: 
//		carddiv : the position div containing the image
//		zoom : a boolean whether or not to zoom, if false returns the card to normal size.
function magnifyCard(posnum, zoom) {
	return;
	var carddiv = $('#position' + posnum + ' div.carddiv');
	
	var img = $(carddiv).find('img');
	if(zoom) {
		var mtop = '-' + (chgt /2) + 'px';
		var mleft = '-' + (cwdt /2) + 'px';
		img.animate({
			marginTop: mtop,
			marginLeft: mleft,
			height: chgt * 2,
			width: cwdt * 2
		}, 500);
	} else {
		img.animate({
			marginTop: '0px',
			marginLeft: '0px',
			height: chgt,
			width: cwdt
		}, 500);
	}
}

function checkForZooms(e) {
	return;
	var curpos = inPosition(e);
	if (!curpos) { 
		if(zoomedCard != null ) {
			magnifyCard(zoomedCard, false);
			zoomedCard = null;
		}
		return; 
	}
	zoomedCard = curpos;
	magnifyCard(zoomedCard, false);
}

// showCardReading : A function to display a popup with the cards interpretation
function showCardReading(carddiv) {
	
}
