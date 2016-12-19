var epsilon = "\\epsilon"
var alfabeto_aceptable = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*|+.";
var nombres_aceptables = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.";
var nombres_aceptables_position_for_nfa = 0;
var espacio_entre_nodos = 150, x_position = espacio_entre_nodos, y_position = espacio_entre_nodos;
function prueba_cadena(){
	var expresion = document.getElementById('expresion').value;
	var cadena = document.getElementById('cadena').value;
	regex = new RegExp(expresion, 'i');
	regex_exec = regex.exec(cadena)
	convertir(expresion);
	if(regex_exec != undefined){

		if(regex_exec[0] === regex_exec.input){
			swal({
	          title: "Aceptada!",
	          text: "EL REGEX ACEPTA LA CADENA",
	          type: "success",
	          confirmButtonText: "Ok"
	        });
		}else{
			swal({
	          title: "Rechazada!",
	          text: "EL REGEX NO ACEPTA LA CADENA",
	          type: "error",
	          confirmButtonText: "Ok"
	        });
		}

	}else{
		swal({
          title: "Rechazada!",
          text: "EL REGEX NO ACEPTA LA CADENA",
          type: "error",
          confirmButtonText: "Ok"
        });
	}
}

function convertir(expresion){
	this.nodes = [];
	this.links = [];
	espacio_entre_nodos = 150, x_position = espacio_entre_nodos, y_position = espacio_entre_nodos;
	nombres_aceptables_position_for_nfa = 0;
	var contador = 0
	var individual_nfas = [];
	var backup = {
		'nodes': [],
		'links': [],
	};
	var previous_expresion_for_transitions = expresion;
	for(var i = 0; i < expresion.length; i++) {
		if(nombres_aceptables.contains(expresion[i])){
			var nfa = {
				'text': "",
				'nodes': [],
				'links': []
			}
		   
			expresion = expresion.replaceChar(i, nombres_aceptables[nombres_aceptables_position_for_nfa]);
			
	        var backupNodeA = new Node(x_position,y_position);
	        backupNodeA.text = nombres_aceptables[nombres_aceptables_position_for_nfa];
	        var start_link = new StartLink(backupNodeA);
	        start_link.deltaX = 0;
	    	start_link.deltaY = -60;
			contador++;
			if(x_position + espacio_entre_nodos >=750){
				x_position = espacio_entre_nodos;
				y_position +=espacio_entre_nodos;
			}else
				x_position += espacio_entre_nodos


	        var backupNodeB = new Node(x_position,y_position);
	        backupNodeB.text = nombres_aceptables[contador];
	        backupNodeB.isAcceptState = true;
	        var link = new Link(backupNodeA, backupNodeB);
	        link.perpendicularPart = 0;
	        link.text = previous_expresion_for_transitions[i];
			if(x_position + espacio_entre_nodos  >=750){
				x_position = espacio_entre_nodos;
				y_position +=espacio_entre_nodos;
			}else
				x_position += espacio_entre_nodos
			
			contador++;
			backup.nodes.push(backupNodeA);		
			backup.nodes.push(backupNodeB);
			backup.links.push(start_link);

	        var anchorPoint = calcularAnchorPoint(backup,get_node_or_link_position(backup.nodes,backupNodeA) 
    											,get_node_or_link_position(backup.nodes,backupNodeB));
            link.setAnchorPoint(anchorPoint.x,anchorPoint.y);		
			backup.links.push(link);

			nfa.text = nombres_aceptables[nombres_aceptables_position_for_nfa]
			nombres_aceptables_position_for_nfa+=2;
			nfa.nodes.push(backupNodeA);		
			nfa.nodes.push(backupNodeB);
			nfa.links.push(start_link);		
			nfa.links.push(link);
			individual_nfas.push(nfa)	

		}

	}	
	expresion = expresion.replaceAll("(","")
	var parentesis_found_in_position = -1;// en esta posicion debemos volver a reiniciar i, este valor es para que
										  // una vez se haya resuelto todo dentro del parentesis este tome lo que 
										  // estaba adentro y ejecute lo que sea debe
  	var termino_estrella = false, termino_union =false, termino_mas = false;
  	var prioridad = 0; //0 = estrella, 1 = mas(+) , 2 =  union, 3 = concatenacion, 4 = parentesis

  	for (var i = 0; i < expresion.length; i++) {//primero hacemos todas las operaciones estrella
  		if(nombres_aceptables.contains(expresion[i])){// i es aceptable
			if(i +1 < expresion.length){
				var node_position1 = getNodePosition(individual_nfas,expresion[i]);
				if( (expresion[i+1] === "*" ||expresion[i+1] === "+") && prioridad === 0){// estrella

					

					var tipo = false;
					if(expresion[i+1] === "+")
						tipo = true;
					var nfa_despues_de_estrella_o_mas = estrella_o_mas(individual_nfas[node_position1],tipo);
					expresion = expresion.remove(i+1)
					var symbols_counter  = 0;
					for (var j = 0; j < i; j++) {// debemos contar cuantos +)| hay antes de este punto
												// para saber donde debemos reemplazar la letra de expresion
						if("|)+".contains(expresion[j]))
							symbols_counter++;
					}
					individual_nfas.splice(i-symbols_counter,1,nfa_despues_de_estrella_o_mas) // no es i por que i incluye los |

					

				}else if(expresion[i+1] === "|" && prioridad ===1){
					var node_position2 = getNodePosition(individual_nfas,expresion[i+2]);
					var unidos = union(individual_nfas[node_position1],individual_nfas[node_position2])
					expresion = expresion.remove(i+1).remove(i+1)
					individual_nfas.splice(i,2,unidos) 
					i--;

				}else if(nombres_aceptables.contains(expresion[i+1]) && prioridad === 2){//concatenacion
					//se puede concatenar ***NOTA:prioridad debe ser 3, pero por el momento para probar es 1

					//primero vemos si nuestro objetivo de concatenacion no tiene ninguna operacion pendiente
					//por ejemplo ab* primero deberiamos hacer b* antes de proceder con ab
						
						var node_position2 = getNodePosition(individual_nfas,expresion[i+1]);
						
						var concatenados = concatenacion(individual_nfas[node_position1], individual_nfas[node_position2])
						expresion = expresion.remove(i+1)

						individual_nfas.splice(i,2,concatenados) 
						i--;


				}	
			}
		//fin i es aceptable
  		}else if(")" === expresion[i] && prioridad === 3){//prioridad debe ser 4 al final
  			expresion = expresion.replaceAll(")","")
  			i = -1;
  			prioridad = 0;// se reinicia todo el ciclo luego de eliminar los parentesis
  		}
		if(i === expresion.length -1 && expresion.length >1 && prioridad <3){// <4 cuando todo este listo
			prioridad++
			i = -1;
		}

  	}
	backup_done = {
		'nodes': [],
		'links': [],
	};	
	for (var i = 0; i < individual_nfas.length; i++) {
		for (var k = 0; k < individual_nfas[i].nodes.length; k++) {
			if(!is_node_or_link_contained(backup_done.nodes,individual_nfas[i].nodes[k]))
				backup_done.nodes.push(individual_nfas[i].nodes[k])
		}
		for (var j = 0; j < individual_nfas[i].links.length; j++) {
				backup_done.links.push(individual_nfas[i].links[j])
		}
	}
	this.nodes = backup_done.nodes;
	this.links = backup_done.links;
	draw();


}
function union(left,right){
	var new_nfa = {
		'text': "",
		'nodes': [],
		'links': []
	}
	new_nfa.text = left.text;
	new_nfa.nodes = mergeArrays(left.nodes,right.nodes)
	new_nfa.links = mergeArrays(left.links,right.links)
	// se creara un nuevo estado el cual sera el nuevo estado inicial y se unira a los estados iniciales previos

	var left_start_state, right_start_state, new_start_state;


	var start_state = new Node(x_position ,y_position)	// el nuevo estado inicial	
	start_state.isAcceptState= true;
	start_state.text = nombres_aceptables[nombres_aceptables_position_for_nfa]
	nombres_aceptables_position_for_nfa++;
	new_nfa.nodes.splice(0,0,start_state);// insertamos al inicio
	if(x_position + espacio_entre_nodos  >=750){//movemos las posiciones para los siguientes nodos
		x_position = espacio_entre_nodos;
		y_position +=espacio_entre_nodos;
	}else
		x_position += espacio_entre_nodos


	var left_start_state_position = -1,right_start_state_position = -1;
	for (var i = 0; i < new_nfa.links.length; i++) {
		if(new_nfa.links[i] instanceof StartLink){//eliminaremos los links iniciales
			//debido a que al hacer merge de los arrays los datos del left quedan primero, sabemos que left_start_state
			// se encontrara primero
			if(!left_start_state){
				left_start_state = new_nfa.links[i].node;
				new_nfa.links.splice(i,1)
				i--;
			}else{
				right_start_state = new_nfa.links[i].node;// este no lo borraremos, lo aprovecharemos para hacerlo
														//el start link del nuevo nodo
				new_nfa.links[i].node = start_state;
				break;
			}

		}
	}
	
	var left_link = new Link(start_state, left_start_state);
	left_link.perpendicularPart = 0;
    left_link.text = epsilon;    
    var anchorPoint = calcularAnchorPoint(new_nfa, 0,get_node_or_link_position(new_nfa.nodes,left_start_state));
    left_link.setAnchorPoint(anchorPoint.x,anchorPoint.y);
    left_link.parallelPart = 0.5;

	var right_link = new Link(start_state, right_start_state);
	right_link.perpendicularPart = 0;
    right_link.text = epsilon;    
    var anchorPoint = calcularAnchorPoint(new_nfa, 0,get_node_or_link_position(new_nfa.nodes,right_start_state));
    right_link.setAnchorPoint(anchorPoint.x,anchorPoint.y);
    right_link.parallelPart = 0.5;

	new_nfa.links.push(left_link)
	new_nfa.links.push(right_link)

	return new_nfa;

}

function estrella_o_mas(nfa,tipo){//
	// si tipo es false, se hace estrella, si es true, se hace mas 
	//se necesita crear un nodo inicial que sea tambien final, eliminar el nodo final actual y
	//debido a que actualmente la implementacion ya llevo creados y posicionados los estados,
	//habra que reposicionarlos todos o simplemente tirar el nuevo estado al final
	//(lo cual es mucho mas facil pero se vera del asco)
	
	var start_state = new Node(x_position ,y_position)	// el nuevo estado inicial	
	if(!tipo)
		start_state.isAcceptState = true;
	else
		start_state.isAcceptState = false;
	start_state.text = nombres_aceptables[nombres_aceptables_position_for_nfa]
	nombres_aceptables_position_for_nfa++;
	nfa.nodes.splice(0,0,start_state);// insertamos al inicio
	if(x_position + espacio_entre_nodos  >=750){//movemos las posiciones para los siguientes nodos
		x_position = espacio_entre_nodos;
		y_position +=espacio_entre_nodos;
	}else
		x_position += espacio_entre_nodos
	

	var start_state_position  = -1, previous_start_state ={},previous_start_state_position= -1;
	for (var i = 0; i < nfa.links.length; i++) {
		if(nfa.links[i] instanceof StartLink){
			previous_start_state = nfa.links[i].node;
			nfa.links[i].node = start_state;
			break; 
		}
	}
	//creamos el link entre el nuevo estado inicial y el anterior
	previous_start_state_position = get_node_or_link_position(nfa.nodes, previous_start_state);

    var new_link = new Link(start_state, previous_start_state);
	new_link.perpendicularPart = 0;
    new_link.text = epsilon;
    var anchorPoint = calcularAnchorPoint(nfa, 0,previous_start_state_position);
    new_link.setAnchorPoint(anchorPoint.x,anchorPoint.y);
    new_link.parallelPart = 0.5;

	nfa.links.push(new_link)

	start_state_position =  0;//posicion dentro del start_state dentro del arreglo de nfa.nodes
	for (var i = 0; i < nfa.nodes.length; i++) {// obtenemos nodos finales
		if(nfa.nodes[i].isAcceptState){//ahora debemos crear una transicion epsilon entre el estado final y el estado inicial
			var link;
			link = new Link(nfa.nodes[i], nfa.nodes[start_state_position]);
            link.perpendicularPart = 0;
            link.text = epsilon;
            var anchorPoint = calcularAnchorPoint(nfa, i,start_state_position);
            link.setAnchorPoint(anchorPoint.x,anchorPoint.y);
            link.parallelPart = 0.5;
			nfa.links.push(link)
		}
	}

	return nfa;
	
	
}


function concatenacion(left,right){
	var end_nodes = [];
	var new_nfa = {
		'text': "",
		'nodes': [],
		'links': []
	}
	//primero obtenemos los estados finales de left y el estado inicial de right 
	for (var i = 0; i < left.nodes.length; i++) {
		if(left.nodes[i].isAcceptState){
			left.nodes[i].isAcceptState = false;
			end_nodes.push(left.nodes[i])
		}
		new_nfa.nodes.push(left.nodes[i]);

	}
	//nombremos el nuevo dfa con la letra inicial de el nodo inicial de el nfa left
	for (var i = 0; i < left.links.length; i++) {
		if(left.links[i] instanceof StartLink){
			new_nfa.text = left.links[i].node.text;
		}
	}
	for (var i = 0; i < right.links.length; i++) {
		if(right.links[i] instanceof StartLink){
			for (var j = 0; j < right.nodes.length; j++) {
				new_nfa.nodes.push(right.nodes[j])
			}
			for (var k = 0; k < end_nodes.length; k++) {
                link = new Link(end_nodes[k], right.links[i].node);
                link.perpendicularPart = 0;
                link.text = epsilon;              
			    var anchorPoint = calcularAnchorPoint(new_nfa, get_node_or_link_position(new_nfa.nodes,end_nodes[k])
			    	,get_node_or_link_position(new_nfa.nodes,right.links[i].node));
			    link.setAnchorPoint(anchorPoint.x,anchorPoint.y);
			    link.parallelPart = 0.5;
			    right.links.push(link)			    
			}

			right.links.splice(i,1)

			for (var j = 0; j < right.links.length; j++) {
				new_nfa.links.push(right.links[j])
			}
			for (var j = 0; j < left.links.length; j++) {
				new_nfa.links.push(left.links[j])
			}
			break;
		}
	}
	return new_nfa;
}

function contains(arreglo, value){
    for (var i = 0; i < arreglo.length; i++) {
        if(arreglo[i] === value )
            return true;
    }
    return false;
}

function calcularAnchorPoint(backup,i,k){
    //i,k son la posiciones de los nodos izquierdos y derechos respectivamente dentro del arreglo de backup
    //esta funcion calcula el punto central del link para que luego la libreria se encargue de dibujarlo con la
    //curvatura del link correspondiente.
    var nodeAX = backup.nodes[i].x;
    var nodeBX = backup.nodes[k].x;
    var nodeAY = backup.nodes[i].y;
    var nodeBY = backup.nodes[k].y;
    var anchorPointX = 0;
    var anchorPointY = 0;
    if(nodeAX < nodeBX){// si el link sale de izquierda y va a derecha

        if(backup.nodes[i].y === backup.nodes[k].y){
            anchorPointX = (nodeBX - nodeAX)/2 + nodeAX ;
            anchorPointY = backup.nodes[i].y + 30
        }
        else{
            if(nodeAY < nodeBY){// nodo a esta mas arriba que b

                anchorPointX = (nodeBX - nodeAX)/2 + nodeAX+10;
                anchorPointY = (nodeBY - nodeAY)/2 + nodeAY+10;

            }else{//nodo a esta mas abajo que b

                anchorPointX = (nodeBX - nodeAX)/2 + nodeAX-10;
                anchorPointY = (nodeBY - nodeAY)/2 + nodeAY-10;

            }
        }
    }else{//link sale de derecha y va a la izquierda
        if(backup.nodes[i].y === backup.nodes[k].y){
            anchorPointX = (nodeAX - nodeBX)/2 + nodeBX 
            anchorPointY = backup.nodes[i].y - 30
        }
        else{
            if(nodeAY < nodeBY){// nodo a esta mas arriba que b

                anchorPointX = (nodeAX - nodeBX)/2 + nodeBX +10;
                anchorPointY = (nodeBY - nodeAY)/2 + nodeAY +10;

            }else{//nodo a esta mas abajo que b

                anchorPointX = (nodeAX - nodeBX)/2 + nodeBX -10;
                anchorPointY = (nodeBY - nodeAY)/2 + nodeAY -10;

            }
        }
    }
    var point = {
        'x': anchorPointX,
        'y': anchorPointY
    }
    return point;

}

function is_node_or_link_contained(node_or_link_Array, node_or_link){
	//recibe el arreglo de nodos o links (funciona para ambos ya que usaremos el campo text para comparar ambos)
	//y compara si un nodo/link de igual nombre ya existe
	for (var i = 0; i < node_or_link_Array.length; i++) {
		if(node_or_link_Array[i].text === node_or_link.text)
			return true;
	}
	return false

}	
function get_node_or_link_position(node_or_link_Array, node_or_link){
	//recibe el arreglo de nodos o links (funciona para ambos ya que usaremos el campo text para comparar ambos)
	//y compara si un nodo/link de igual nombre ya existe
	for (var i = 0; i < node_or_link_Array.length; i++) {
		if(node_or_link_Array[i].text === node_or_link.text)
			return i;
	}
	return -1;

}

function getNodePosition(array,value){// recibe el arreglo de todos los dfa individuales
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array[i].nodes.length; j++) {
			if(array[i].nodes[j].text.contains(value)){
				return i;
			}			
		}
	}
	return -1;
}
Array.prototype.clean = function() {
	for(var i = 0; i < this.length; i++) {
	    if(this[i] === "") {
	        this.splice(i, 1);
	    }
	}
	return this;
}
function mergeArrays(firstArray,secondArray){
	var new_array = [];
	for (var i = 0; i < firstArray.length; i++) {
		new_array.push(firstArray[i]);
	}
	for (var i = 0; i < secondArray.length; i++) {
		new_array.push(secondArray[i]);
	}
	return new_array;
}

String.prototype.contains = function(value){
	for (var i = 0; i < this.length; i++) {
		if(this[i] === value)
			return true;
	}
	return false;
}
String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
}
String.prototype.remove = function(position){
	return this.slice(0, position) + this.slice(position+1, this.length)

}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};
String.prototype.replaceChar = function(position, replacement) {
    return this.slice(0, position) +replacement+ this.slice(position+1, this.length)
};