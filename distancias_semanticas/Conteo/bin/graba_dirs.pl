#!/usr/bin/perl -w
use Cwd;
sub Dires{
my $dir = getcwd;
open(OUT, ">textos_tot.txt");
my @files = <./Textos/*.txt>;
foreach $file (@files){
$file =~ m/\/([^\/]*).txt/;
print OUT "$dir/Textos/$1\n";

}

close OUT;
}
1;
