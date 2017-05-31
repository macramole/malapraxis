#!/usr/bin/perl -w

use Encode;
use LWP::UserAgent;
use HTTP::Request;


sub Contar{

	# Cuenta que pares de palabras y cuantas veces aparecen de distancia 0 hasta $DistMAX. (NOTA: Distancia 0 da la cantidad de veces que aparece una palabra)

	my ($TxtID,$DistMAX) = @_;
		
	open (COM,"./Textos/$TxtID/$TxtID.lim") or die "ERROR: No hay archivo /$TxtID/$TxtID.lim"; 
	my @lineas = <COM>;
	close COM;
	
	my @Distancias;
	my @PalLine;
	my @PalAntes;
	my $Juntas;
	my $n = 0;

	foreach my $linea(@lineas){
		
		chomp($linea);
		Encode::from_to($linea,'iso-8859-15','utf-8');
		@PalLine= split(/[\s \t \b]+/,$linea);
		foreach my $pal(@PalLine){	

			next if !($pal=~ m/^[a-z 0-9 ñ]+$/); # saca cosas raras.

			if ($n>$DistMAX){			
				shift(@PalAntes);	
				push(@PalAntes,$pal);	#almacena palabras anteriores
							

			}else{					
				push(@PalAntes,$pal);		
							
								
			}	

			my $len = @PalAntes;
			for (my $i=0;$i<$len;$i++){ #cuenta para cada distancia
				
				$Juntas = join("-",($PalAntes[$len-$i-1],$pal));		
				if (exists $Distancias[$i]->{$Juntas}){			
					$Distancias[$i]->{$Juntas}=$Distancias[$i]->{$Juntas}+1; 									 			
				}else{						
					$Distancias[$i]->{$Juntas}=1;
				
				}
			
	
			}
			$n++;
			

				
			
		}
	}

	for ($i=0;$i<=$DistMAX;$i++){ #lo guarda en archivos .m(distancia)
		open (FRP,">./Textos/$TxtID/$TxtID.m$i") or die "No hay archivo ./$TxtID/$TxtID.m$i";
		
	
		foreach $pal (sort(keys %{ $Distancias[$i] })){
	
			print FRP "$pal\t$Distancias[$i]->{$pal}\n";
		}
		close FRP;
	}
	
}


1;






