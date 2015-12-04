#!/usr/bin/perl -w


use strict;
use Gtk2 '-init';
require "./bin/limpiar.pl";
require "./bin/Contar.pl";
require "./bin/CrMatriz.pl";
require "./bin/graba_dirs.pl";
require "./bin/indexa.pl";


use constant TRUE  => 1;
use constant FALSE => 0;

#################################################################################
#  ALGORITMOS DE CONTEO DE TEXTOS Y MATRIZ DE CO-OCURRENCIA DE PALABRAS		#
#										#
#	CREADO POR EL LABORATORIO DE NEUROCIENCIA INTEGRATIVA			#
#			Contacto: meliascosta@gmail.com				#
#										#
#################################################################################


my $window = Gtk2::Window->new;
$window->set_title ('Consola de conteo');
$window->signal_connect (destroy => sub { Gtk2->main_quit; });
$window->set_border_width(3);


my $vbox = Gtk2::VBox->new(FALSE, 6); # Creamos la ventana
$window->add($vbox);

# Creamos la parte del conteo de los textos, botones y labels.
my $frame = Gtk2::Frame->new('Textos');
$vbox->pack_start($frame, TRUE, TRUE, 0);
$frame->set_border_width(3);
my $hbox = Gtk2::HBox->new(FALSE, 6);
$frame->add($hbox);
$hbox->set_border_width(3);

my @archivos = <./Textos/*.txt>; 
my $count = @archivos; # Contamos cuantos textos hay

my $l_text = Gtk2::Label->new('Nro. de textos: '.$count);
$hbox->pack_start($l_text, FALSE, FALSE, 0);
my $limpiar_button = Gtk2::Button->new('Limpiar');
$hbox->pack_start($limpiar_button, FALSE, FALSE, 0);
$limpiar_button->signal_connect( clicked => \&Limpieza);
my $contar_button = Gtk2::Button->new('Contar Nuevos');
$hbox->pack_start($contar_button, FALSE, FALSE, 0);
$contar_button->signal_connect( clicked => \&Conteo);
my $recontar_button = Gtk2::Button->new('Recontar todos');
$recontar_button->signal_connect( clicked => \&reConteo);
$hbox->pack_start($recontar_button, FALSE, FALSE, 0);

# ------------------------------------------------------------



# Ahora la parte de crear matriz con las cajas de texto para decirle los indices y sobre que textos crear la matriz
my $frame2 = Gtk2::Frame->new('Crear Matriz');
$vbox->pack_start($frame2, TRUE, TRUE, 0);
$frame2->set_border_width(3);
my $hbox2 = Gtk2::HBox->new(FALSE, 6);
$frame2->add($hbox2);
$hbox2->set_border_width(3);
my $index_button = Gtk2::Button->new('Indexar');
$hbox2->pack_start($index_button, FALSE, FALSE, 0);
$index_button->signal_connect( clicked => \&Indexar);
my $generar_button = Gtk2::Button->new('Generar directorios');
$hbox2->pack_start($generar_button, FALSE, FALSE, 0);
$generar_button->signal_connect( clicked => \&Generar);
my $crear_button = Gtk2::Button->new('Crear Matriz');
$hbox2->pack_start($crear_button, FALSE, FALSE, 0);
$crear_button->signal_connect( clicked => \&Crear);
#-----------------------------------------------------------------------------------------------------------------

$window->show_all;
Gtk2->main;


# A PARTIR DE ACA SUBRUTINAS QUE CORREN LOS BOTONES, USAN LOS ARCHIVOS EN /BIN

sub reConteo{
#cuenta todos los textos.
my @textos = <./Textos/*.txt>;
foreach my $texto (@textos){
$texto =~ m/\/([^\/]*).txt/;
Contar($1,9); #Cambiar aca si se quiere el tamaño maximo de la ventana (en este caso 9)
print "Termine con $texto\n";
}
print "FIN DEL CONTEO\n";
}

sub Conteo{
#cuenta solo los nuevos.
my @textos = <./Textos/*.txt>;
	foreach my $texto (@textos){
		$texto =~ m/\/([^\/]*).txt/;
		$texto = $1;
		if (-e "./Textos/$texto/$texto.m0"){
			print "Salteo $texto\n";
		}else{
			Contar($texto,9); #Cambiar aca si se quiere el tamaño maximo de la ventana (en este caso 9)
			print "Termine con /Textos/$texto\n";
		}
	}
print "FIN DEL CONTEO\n";
}

sub Limpieza{

my @files = <./Textos/*.txt>;
my $file;
foreach $file (@files){
$file =~ m/\/([^\/]*).txt/;
$file = $1;
Limpiar($file);
}
print "Limpieza terminada\n";

}

sub Crear{
	CrMatriz("9","textos_tot.txt","indices.txt"); # Aca se puede cambiar el tamaño de la ventana de palabras (en este caso 9)
}

sub Generar{
	&Dires;
	print "Las direcciones de todos los textos estan ahora en textos_tot.txt\n";
}

sub Indexar{
	&Index;
}

