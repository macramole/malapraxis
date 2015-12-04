var encabezados = ["plata","barrio","ropa","domingo","sarmiento","esquema","mapa","facebook","profesor","martillo","cocina","rezo"];
var duplas = ["plata - compañero","barrio - bandera","ropa - abuelo/a","domingo - vereda","sarmiento - pelos","esquema - zapatilla","mapa - ecuación","facebook - pizarrón","profesor - pizza","martillo - genes","cocina - diploma","rezo - celular"];
var width = window.screen.availWidth * 0.9;
var height = window.screen.availHeight * 0.9;

var colors = d3.scale.category10();
var selectedNode = null;

var link = null;
var node = null;

var isDragging = false;

function showInfo(nodeData) {
    var mainNode = selectedNode ? selectedNode : nodeData;
    var relatedNode = selectedNode ? nodeData : null;

    var relatedInfo = [];

    if ( relatedNode != null ) {
        link.data().forEach(function(unLink) {
            if ( unLink.source.id == mainNode.id && unLink.target.id == relatedNode.id ) {
                relatedInfo = unLink.palabras;
            }
        });
    }

    if ( relatedInfo.length == 0 ) {
        relatedNode = null;
    }

    //console.log(relatedInfo);

    $("#info").html("");
    var $ul = $("<ul></ul>");
    var $liId = $("<li class='id'></li>").text(mainNode.id);
    if ( relatedNode ) {
        $liId.html( mainNode.id + "<br>" + relatedNode.id );
    }
    var $liComienzo = $("<li class='comienzo'></li>").text(mainNode.comienzo);

    $ul.append($liId).append($liComienzo);
    //console.log(d);
    mainNode.puente.forEach(function (palabra) {
        var liPuenteText = palabra;
        var $liPuente = $("<li class='puente'></li>").text(liPuenteText);
        relatedInfo.forEach(function(palabraRelacionada) {
            if ( palabraRelacionada.palabra == palabra && palabraRelacionada.relacion.relacion == 1 ) {
                if ( liPuenteText.indexOf("~") === -1 ) {
                    liPuenteText += " ~";
                }
                liPuenteText += " <span class='relacion1'>" + palabraRelacionada.palabra + "</span>";
                $liPuente.html(liPuenteText);
            }
            if ( palabraRelacionada.relacion.observacion == palabra ) {
                if ( liPuenteText.indexOf("~") === -1 ) {
                    liPuenteText += " ~";
                }
                var liPuenteClass = "relacion" + palabraRelacionada.relacion.relacion;

                liPuenteText += " <span class='" + liPuenteClass + "'>" + palabraRelacionada.palabra + "</span>";
                $liPuente.addClass().html(liPuenteText);
            }
        });
        $ul.append($liPuente);
    });

    var $liFinal = $("<li class='final'></li>").text(mainNode.final);
    var $liRelaciones = $("<li class='relaciones'></li>").text("Relaciones: " + mainNode.cantRelaciones);

    if ( relatedInfo.length ) {
        $liRelaciones.text("Relaciones: " + relatedInfo.length);
    }

    $ul.append($liFinal).append($liRelaciones);

    $("#info").append($ul);
    $("#info").addClass("active");
}

function highlightRelations(nodeData) {
    node.transition().style("opacity", function( unNode ) {
        if ( unNode == nodeData ) {
            return 1;
        }
        var linkData = link.data();

        for ( i in linkData ) {
            var oLinkData = linkData[i];
            if ( oLinkData.source.id == nodeData.id && oLinkData.target.id == unNode.id ) {
                return 1;
            }
            if ( oLinkData.target.id == nodeData.id && oLinkData.source.id == unNode.id ) {
                return 1;
            }
        }

        return 0.1;
    });

    link.transition().style("stroke-width", function( oLinkData ) {
        if ( oLinkData.source.id == nodeData.id || oLinkData.target.id == nodeData.id ) {
            return Math.pow(oLinkData.strength,2.5);
        }
        return 1;
    })
    .style("opacity", function( oLinkData ) {
        if ( oLinkData.source.id == nodeData.id || oLinkData.target.id == nodeData.id ) {
            return 1;
        }
        return 0.1;
    });
}

function unhighlightAll() {
    $("#info").removeClass("active");
    link.transition().style("stroke-width", 1).style("opacity", 1);
    node.transition().style("opacity", 1);
}

function selectNode(unNode) {
    if ( unNode == selectedNode ) {
        selectedNode = null;
    } else {
        selectedNode = unNode;

        if ( selectedNode != null ) {
            showInfo(selectedNode);
            highlightRelations(selectedNode);
        } else {
            unhighlightAll();
        }
    }

    node.classed("selected", function(d) {
        return d == selectedNode;
    });
}

function init(categoria) {
    d3.select("body svg").remove();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    var force = d3.layout.force()
        //.gravity(.05)
        .distance(200)
        //.linkDistance(200)
        .charge(0)
        .size([width, height])
        .nodes(dataD3network.nodes[categoria])
        .links(dataD3network.links[categoria])
        .gravity(0)
        .chargeDistance(0)
        .start();

    link = svg.selectAll(".link")
        .data(dataD3network.links[categoria])
        .enter().append("line")
        //.attr("x1", function(d) { return d.source.x; })
        //.attr("y1", function(d) { return d.source.y; })
        //.attr("x2", function(d) { return d.target.x; })
        //.attr("y2", function(d) { return d.target.y; })
        .attr("class", "link")
        .attr("stroke-linecap", "round");

    /*var dragNode = d3.behavior.drag().on("drag", function(d, i) {
        d.x += d3.event.dx;
        d.y += d3.event.dy;

        //d3.select(this).attr("transform", "translate(" + d.x + "," + d.y + ")");
    });*/

    var nodeDrag = force.drag().on("dragstart", function(d) {
        d.fixed = true;
        isDragging = true;
        unhighlightAll();
        console.log("drag");
    }).on("dragend", function(d) {
        isDragging = false;
        console.log("nodrag");
    });

    node = svg.selectAll(".node")
        .data(dataD3network.nodes[categoria])
        .enter().append("circle")
        //.attr("cx", function(d) { return d.x; })
        //.attr("cy", function(d) { return d.y; })
        .attr("class", "node " + categoria)
        .attr("r", function(d) { return Math.pow(d.cantRelaciones,1.3); })
        .on("mouseover", function(d) {
            if ( isDragging ) {
                return;
            }
            showInfo(d);

            if ( selectedNode == null ) {
                highlightRelations(d);
            }
        })
        .on("mouseleave", function(d) {
            if ( isDragging ) {
                return;
            }
            if ( selectedNode == null ) {
                unhighlightAll();
            } else {
                showInfo(selectedNode)
            }
        })
        .on("dblclick", function(d) {
            //d3.event.stopPropagation();
            /*if ( isDragging ) {
                return;
            }*/
            selectNode(d);
        })
        .call(nodeDrag);

    force.on("tick", function(e) {
        // Push different nodes in different directions for clustering.
        if ( force.nodes() ) {
          node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        }

        link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });


        //node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    })/*.on("end", function(e) {
        //force.on("tick", null);
        alert("a");

    })*/;

    /*setTimeout(function() {
        node.each(function(d) {
            d.fixed = true;
        });
    }, 4000);*/

}

function initUI() {

    var $botones = $("#botones");
    encabezados.forEach( function( categoria, index ) {
        var $li = $("<li></li>");
        var $button = $("<button type='button'></button>");
        $button
            .text(duplas[index])
            .attr("data-index", index)
            .click( function() {
                var $this = $(this);
                init( encabezados[ $this.attr("data-index") ] );

                $("#botones li button").attr("disabled", false);
                $this.attr("disabled", true);
            });

        $li.append($button);
        $botones.append($li);
    });

    $("body").click(function() {
        selectNode(null);
    });

    $("#comousar h4 a").click(function() {
        $("#comousar").remove();
    });
};

/*d3.json("d3network.json", function(error, json) {
    if (error) throw error;

    dataD3network = json;
*/
$(function(){
	initUI();
    $("#botones li button").first().click();
});
    
d3.selection.prototype.dblTap = function(callback) {
  var last = 0;
  return this.each(function() {
    d3.select(this).on("touchstart", function(e) {
        if ((d3.event.timeStamp - last) < 500) {
          //Touched element
          console.log(this);
          return callback(e);
        }
        last = d3.event.timeStamp;
    });
  });
}

/*});*/
