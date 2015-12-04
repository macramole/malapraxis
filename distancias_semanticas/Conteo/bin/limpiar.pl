#!/usr/bin/perl -w

use Encode;
use LWP::UserAgent;
use HTTP::Request;




sub Limpiar{

	my ($TxtID) = @_;

	open (COM,"./Textos/$TxtID.txt") or die "No archivo $TxtID.txt";
	my @lineas = <COM>;
	close COM;
	
	
	my $flag = 0;
	my $nl = 0;
	my $total="";
	mkdir("./Textos/$TxtID");
	open (OUT,">./Textos/$TxtID/$TxtID.lim") or die "No archivo Textos/$TxtID/$TxtID.lim";

	foreach my $linea(@lineas){
		$nl++;
		chomp($linea);
		Encode::from_to($linea,'iso-8859-15','utf-8');
# Esta parte sirve para cortar encabezados o finales si el archivo los tuviera, las condiciones son los dos IF que siguen
# Si no se quieren usar, descomentar la linea marcada
		
		if ($linea =~ m/\*\*\*\s*START\sOF/) {
			$flag=1; my $finENC = $nl;
			
		} #corta el encabezado

		$flag = 1;   #  <------------ Descomentarme para no cortar nada		 

		if ($linea =~ m/\Q***END OF THE PROJECT\E/) {
		$flag = 2;
		
		} #corta el final			



		if ($flag==1){
			$linea =~ tr/[A-Z]/[a-z]/;
			$linea =~ s/Ñ/ñ/g;
			$linea =~ s/Á/a/g;
			$linea =~ s/É/e/g;
			$linea =~ s/Í/i/g;
			$linea =~ s/Ó/o/g;
			$linea =~ s/Ú/u/g;	#cambia los acentos y mayusculas (no se pq no anda 
			$linea =~ s/á/a/g;	# tr para esto)
			$linea =~ s/é/e/g;
			$linea =~ s/í/i/g;
			$linea =~ s/ó/o/g;
			$linea =~ s/ú/u/g;
			$linea =~ s/ü/u/g;
			$linea =~ s/Ü/u/g;			
			$linea =~ s/[^ a-z 0-9 ñ]/ /g; #saca lo que molesta
										
			
			if ($linea !~ m/^\W*$/){
			Encode::from_to($linea,'utf-8','iso-8859-15');
			print OUT $linea."\n";
			}
		}
		
		
			
		
		



	}
			
	close OUT;

	


}

1;





