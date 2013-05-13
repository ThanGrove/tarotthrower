<?php
    $domain = $_SERVER['SERVER_NAME'];
    $home = (strpos($domain, 'virginia.edu') > -1)? "http://people.virginia.edu/~ndg8f/" : "/";
		include '../lib/php/db_connect.php';
		include 'functions.php';
		tarot_session_start();
  ?>
	<html lang="en">
  <head>
  	<meta charset="UTF-8">
    <title>Tarot Thrower</title>
    <link href="css/tarot.css" rel="stylesheet" media="all" />
    <script type="text/javascript" src="js/jquery-1.8.3.min.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.8.17.min.js"></script>
		<script type="text/javascript" src="js/jquery.jplayer.min.js"></script>
    <script type="text/javascript" src="js/MRG32k3a.js" ></script> <!-- random number generator see http://baagoe.org/en/wiki/Better_random_numbers_for_javascript -->
    <!--<script type="text/javascript" src="js/seedrandom.js" ></script>-->
		<script type="text/javascript" src="js/tarotui.js" ></script>
		<script type="text/javascript" src="js/tarot3.js" ></script>
		<script type="text/javascript" src="js/sha512.js" ></script>
    
<!-- Files for zoomer jquery plugin 
<script type="text/JavaScript" src="js/zoomer.js"></script>-->

  </head>
  <body>
	 <div id="icons">
			<a href="<?php echo $home; ?>" title="Back to Than's Web Page"><img src="images/home.png"/></a>
			<a onclick="javascript: $('#intro').toggle();" title="Help" style="link"><img src="images/help-wht-circle.png" class="help-img" /></a>
	 </div>
		<div id="main">
			<div id="intro" style="display: none;">
				 <h2>The Tarot, This Page, and How to Use It</h2>
				 <p class="close">Close</p>
				 <p>The origins of the Tarot deck are obscure. People have always enjoyed playing cards, and
				 the Tarot deck evolved out of this tradition. It probably achieve its current form of 78 cards with
				 four regular suits and a set of "trumps" sometime in the 13th
				 century. It is unclear whether it was used for divination at this early period. It may well have been
				 just a game to pass the time. It was the interest of the 
				 occulist movements of the late 19th and early 20th century that leant the tarot its common reputation of
				 being a means for divination and spiritual seeking. It was in this period that the most commonly known
				 tarot deck was created, the Waite-Smith Deck (also known as the Rider Deck).
				 It was based on the earlier, archetypal Marseille deck from the 14th century enhanced with Theosophical
				 symbolism. This Waite-Smith Deck in-turn was "rediscovered" with the burgeoning spirituality of the 1960s. The psychoanalyst
				 Carl Jung also took an interest in the tarot in the post WW II era, and his writings have been the source
				 for many of the psychological interpretations of the Tarot cards.</p>
				 <p>This page provides a means to do a tarot "throw" using the Waite-Smith Deck. A throw is a particular
				 layout of the cards that is meant to aid in understanding the past, present and future with regard to a
				 particular question one has in mind. The layout represented here is the most commonly used one, called the
				 Celtic Cross Spread. This is a series of 10 cards with the first two crossed in the middle. When you close
				 this introduction page, you will see the outlines of the cards for this layout and a form into which you can enter your question. 
				 If you wish to save your throws, then you need to login using the link in the upper-right corner. (Create an account, if 
				 you do not already have one.) Enter your question and click "Begin!". You will then be instructed to click on the 
				 deck in the bottom right hand corner of the screen, and a card will be flipped over and will float to the
				 place in the spread where it belongs. The name of the position of the card, the cards title, and a brief
				 interpretation will then appear in the box above the deck. Clicking on the deck thus ten times will fill out
				 the spread and interpretations and the deck with then vanish.</p>
			</div>
      <div id="canvas">
      </div>
			<div id="readings">
				<div id="login"><a onclick="javascript: toggleLoginForm();">Login</a></div>
			  <div id="instructions">
				 <!--<p>Welcome to Than&rsquo;s Tarot Thrower. This page will help you to do a Tarot &ldquo;throw&rdquo;, or spread, in
				    response to a question of your choice. The default deck used is the <a href="http://en.wikipedia.org/wiki/Rider-Waite_tarot_deck"
						target="_blank">Waite-Smith tarot deck</a>, also known as the Rider-Waite tarot deck. The default layout for the spread is
				    the <a href="http://www.learntarot.com/ccross.htm"
						target="_blank">Celtic Cross Spread</a>. (In the future, I hope to add other decks and layouts.) Initially, one poses a question and
						then lays out the cards. The interpretation of the cards should address one&rsquo;s question. It is best to ask more
						general questions or seek advice from the tarot, as it is usually difficult to interpret throws for questions seeking
						a specific type of answer, such as yes or no and so forth.
				 </p>-->
				 <div style="text-align: center;">
				 <h2 class="title">Welcome to the Tarot Thrower</h2>
				 <p>Enter your question or concern in the space below. Then, press the begin button:</p>
				 <ul class="dlinfo">
						<li><strong>Deck: </strong> <a href="http://en.wikipedia.org/wiki/Rider-Waite_tarot_deck"
						target="_blank">Waite-Smith</a></li>
						<li><strong>Layout: </strong> <a href="http://www.learntarot.com/ccross.htm"
						target="_blank">Celtic Cross Spread</a></li>
				 </ul></div>
				 <?php
						$qname = "Anonymous";
						if (isset($_SESSION['username'])) {
								$qname = $_SESSION['username'];
						}
				 ?>
				 <form id="metadataform" action="savedata.php" method="POST">
						<table>
							 <tr>
									<td class="label">Querent&rsquo;s Name:</td>
									<td><span class="txt"><? echo $qname; ?></span>
												<input type="hidden" size="50" name="querent" id="qname"
														 value="<?php echo $qname; ?>"
														/>
									</td>
							 </tr>
							 <tr>
									<td class="label">Date:</td>
									<td id="date-cell">
										 <span class="txt"></span>
										 <input type="hidden" name="qdate" value="" id="qdate" />
									</td>
							 </tr>
							 <tr>
									<td class="label">Question:</td>
									<td><textarea cols="44" rows="10" name="qtext" id="qtext" ></textarea></td>
							 </tr>
							 <!-- Hidden Row for Card info -->
							 <tr style="display: none;">
								<td colspan="2">
										<ul id="datastore"></ul>
								</td>
							 </tr>
							 <tr>
										<td>&nbsp;</td>
									<td >
										 <table class="buttons">
												<tr>
														<td><input type="button" value="Begin!"
																			 onclick="javascript: processForm();" class="btn"/>&nbsp;
														<input type="reset" value="Reset" class="btn"/></td>
														<!--<td><input type="button" value="Load"/></td>-->
														<td>&nbsp;</td>
												</tr>
										 </table>
									</td>
							 </tr>
						</table>
						
						
				 </form>
				</div>
				<div id="throwspecs" style="display: none;"></div>
				<ol>
						
				</ol>
			</div>
			<div id="startbubble" style="display: none;"><img src="images/tarot-start-bubble2.png" /></div>
			<div id="drawn"><img src="images/cardpad.png" /></div>
      <div id="deck" ></div>
			<div id="overlay" style="display: none;"></div>
  </body>
  </html>