#!/usr/bin/perl -w

#esto simplemente le pone el numero de orden a cada linea de un archivo de texto y la separa por un tab. Toma como entrada idnices_sin.txt y guarda la salida en indices.txt
sub Index{
open(INP, "indices_sin.txt") or die ("No exite el archivo de entrada indices_sin.txt");
my @lineas = <INP>;
close(INP);

open(OUT, ">indices.txt");
my $i=1;
foreach $linea (@lineas){
print OUT "$i\t$linea";
$i++;
}
close OUT;
print "Ya indexe todos las palabras que estaban en indices_sin.txt y lo guarde en indices.txt\n";
}
1;
