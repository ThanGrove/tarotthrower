use LWP::Simple; 

$majorUrl="http://www.learntarot.com/maj";
$minorUrl = "http://www.learntarot.com/";
$dataout = "carddata.htm";
@suits = ("w", "c", "s", "p");
@pips = ("a", "2", "3", "4", "5", "6", "7", "8", "9", "10", "pg", "kn", "qn","kg");
open OUT, ">$dataout" or die "Can't open $dataout for writing!";

print OUT '<html><head><title>Tarot Data</title></head><body>';

for($n=0; $n<22; $n++) {
    $pgUrl = ($n<10) ? $majorUrl . '0' . $n : $majorUrl . $n;
    $pgUrl .= '.htm';
    $cid = ($n<10) ? 'card0' . $n : 'card' . $n;
    $out = "\n<div id=\"$cid\">\n";
    $out = &getPageData($pgUrl);
    $out .= "\n</div>\n";
    print OUT $out;
}

@cards = ();
for($s = 0; $s < 4; $s++) {
    for($c = 0; $c < 14; $c++) {
        push(@cards, $suits[$s] . $pips[$c] . '.htm');
    }
}
for($n=22; $n<78; $n++) {
    $cardPage = $minorUrl . shift(@cards);
    $out = "\n<div id=\"card$n\">\n";
    $out = &getPageData($cardPage);
    $out .= "\n</div>\n";
    print OUT $out;
}

print OUT '</body></html>';
close OUT;
exit;

sub getPageData() {
    my $pgUrl = shift;
    print "Getting $pgUrl \n";
    $data = get($pgUrl);
    if ($data =~ /(<h1>.+<\/h1>)/i) {
        $out .= $1;
    }
    $start = index($data,'<UL>');
    $end = index($data,'</UL>');
    if($start > 0 && $end > $start) {
        $out .= substr($data,$start, $end - $start + 5);
    }
    if ($data =~ m/(<dl>[\s\S]+<\/dl>)/i) {
        $out .=  $1 ;
    }
    return $out;
}

