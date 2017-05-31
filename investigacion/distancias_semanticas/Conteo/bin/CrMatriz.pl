#!/usr/bin/perl -w

sub CrMatriz{

	my ($Dists,$TxtINDSfile,$PalINDSfile)=@_;
	my %Matriz;
	my ($DistMIN,$DistMAX);
	if ($Dists=~ m/(\d+)-(\d+)/){
		$DistMIN = $1;
		$DistMAX = $2;
	}else{
		$DistMIN = 0;
		$DistMAX = $Dists;	
	}
	
	open (COM,$TxtINDSfile) or die "No archivo $TxtINDSfile";
	my @TxtINDS = <COM>;
	close COM;
	chomp(@TxtINDS);
	open (COM,$PalINDSfile) or die "No archivo $PalINDSfile";
	my @PalINDS = <COM>;
	close COM;
	chomp(@PalINDS);
	
	for (my $i=0;$i<=(@PalINDS)-1;$i++){
		($ind,$pal)=split("\t",$PalINDS[$i]);
		$indice{$pal}=$ind;
		print "$pal ---> $ind\n";
	}
	$num= @PalINDS;
	for $x (0 .. $num) {                       # For each row...
    		for $y (0 .. $num) {                   # For each column...
 		       $matriz[$x][$y] = 0;    # ...set that cell
  		  }
	}
	print "Cargue palabras!\n";
	foreach $Txt (@TxtINDS){
		for ($i=$DistMIN;$i<=$DistMAX;$i++){
			$Txt =~m/\/([^\/]+$)/;
			open (COM,"$Txt/".$1.".m$i") or die "No archivo $Txt/".$1."m$i";
			@lineas = <COM>;
			close COM;
			
			foreach $linea (@lineas){
				my ($linTXT,$linFREC)=split("\t",$linea);
				($pal1,$pal2)=split("-",$linTXT);
				if (exists $indice{$pal1} & exists $indice{$pal2}){
					$matriz[$indice{$pal1}][$indice{$pal2}]=$matriz[$indice{$pal1}][$indice{$pal2}]+$linFREC;
				}
				
			}
		}
		print "Procesando ... $Txt\n";

	}
	print "Termine\n";


	open (OUT,">Matriz.txt");
	for($i=1;$i<=(@PalINDS);$i++){
		for($j=1;$j<=(@PalINDS);$j++){
			if ($matriz[$i][$j]>0) {print OUT "$i\t$j\t$matriz[$i][$j]\n";}
			#poné los ceros
			#print OUT "$i\t$j\t$matriz[$i][$j]\n";
		}
	}
	close OUT;
}
1;

