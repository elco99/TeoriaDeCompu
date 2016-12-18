var epsilon = "\\epsilon"
function prueba_cadena(){

	var expresion = document.getElementById('expresion').value;
	var cadena = document.getElementById('cadena').value;
	regex = new RegExp(expresion, 'i');
	regex_exec = regex.exec(cadena)
	//console.log(this.nodes)
	//console.log(this.links)
	convertir(expresion);
	if(regex_exec != undefined){

		if(regex_exec[0] === regex_exec.input)
			console.log("EL REGEX ACEPTA LA CADENA")
		else
			console.log("EL REGEX NO ACEPTA LA CADENA")

	}else
	console.log("EL REGEX NO ACEPTA LA CADENA")
}

function getNodePosition(array,value){// recibe el arreglo de todos los dfa individuales
	//console.log(array)
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array[i].nodes.length; j++) {
			if(array[i].nodes[j].text.contains(value)){
				return i;
			}			
		}
	}
	return -1;
}
String.prototype.contains = function(value){
	for (var i = 0; i < this.length; i++) {
		if(this[i] === value)
			return true;
	}
	return false;
}
function convertir(expresion){
	this.nodes = [];
	this.links = [];
	var espacio_entre_nodos = 150
	var clean_input = expresion.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "")
	var unrepeated_input = clean_input.split("").filter(function(x, n, s) { return s.indexOf(x) == n }).join("")
	var contador = 0
	var individual_dfas = [];
	var backup = {
		'nodes': [],
		'links': [],
	};
	var x_position = espacio_entre_nodos, y_position = espacio_entre_nodos;
	for(var i = 0; i < clean_input.length; i++) {
		var dfa = {
			'text': "",
			'nodes': [],
			'links': []
		}
        var backupNodeA = new Node(x_position,y_position);
        backupNodeA.text = clean_input[i]+contador;
        var start_link = new StartLink(backupNodeA);
        start_link.deltaX = -50;
    	start_link.deltaY = -50;
		contador++;
		if(x_position + espacio_entre_nodos >=750){
			x_position = espacio_entre_nodos;
			y_position +=espacio_entre_nodos;
		}else
			x_position += espacio_entre_nodos


        var backupNodeB = new Node(x_position,y_position);
        backupNodeB.text = clean_input[i]+contador;
        backupNodeB.isAcceptState = true;
        var link = new Link(backupNodeA, backupNodeB);
        link.perpendicularPart = 0;
        link.text = clean_input[i];
		if(x_position + espacio_entre_nodos  >=750){
			x_position = espacio_entre_nodos;
			y_position +=espacio_entre_nodos;
		}else
			x_position += espacio_entre_nodos
		
		contador++;
		backup.nodes.push(backupNodeA);		
		backup.nodes.push(backupNodeB);
		backup.links.push(start_link);		
		backup.links.push(link);

		dfa.text = clean_input[i];
		dfa.nodes.push(backupNodeA);		
		dfa.nodes.push(backupNodeB);
		dfa.links.push(start_link);		
		dfa.links.push(link);
		individual_dfas.push(dfa)	

	}	
	alfabeto_aceptable = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*|+";
	expresion = expresion.replaceAll("(","")
	var parentesis_found_in_position = -1;// en esta posicion debemos volver a reiniciar i, este valor es para que
										  // una vez se haya resuelto todo dentro del parentesis este tome lo que 
										  // estaba adentro y ejecute lo que sea debe
	for (var i = 0; i < expresion.length; i++) {
		

		console.log(expresion,i)
		if(alfabeto_aceptable.contains(expresion[i])){// es una letra/numero		
			if(i +1 < expresion.length){// que no se salga del tamano max	
				var node_position1 = getNodePosition(individual_dfas,expresion[i]);
				if(expresion[i+1] === "*"){// estrella
					console.log("entro")
					var dfa_despues_de_estrella = estrella(individual_dfas[node_position1]);	
					// console.log(dfa_despues_de_estrella)				
					expresion = expresion.remove(i+1)
					individual_dfas.splice(i,1,dfa_despues_de_estrella) 
					//console.log(JSON.stringify(individual_dfas))

				}else if(expresion[i+1] === "|"){
					
				}else if(alfabeto_aceptable.contains(expresion[i+1])){//concatenacion
					var node_position2 = getNodePosition(individual_dfas,expresion[i+1]);
					
					var concatenados = concatenacion(individual_dfas[node_position1], 
								  individual_dfas[node_position2])
					expresion = expresion.remove(i+1)

					individual_dfas.splice(i,2,concatenados) 
					i--;


				}

				// i = -1;// no 0 porque al volver a correr el ciclo le suma 1
			}
		}else if(expresion[i] === ")"){// si se encuentra volvemos al inicio 
			expresion = expresion.remove(i)
			parentesis_found_in_position = i-1;//ya que eliminamos el parentesis reducimos 1
			//console.log(i,expresion[i])
			i = -1;
		}
		if(i === expresion.length -1 && expresion.length >1){
			i = -1;
		}
	}
	backup_done = {
		'nodes': [],
		'links': [],
	};	
	console.log(individual_dfas)
	for (var i = 0; i < individual_dfas.length; i++) {
		for (var k = 0; k < individual_dfas[i].nodes.length; k++) {
			if(!is_node_or_link_contained(backup_done.nodes,individual_dfas[i].nodes[k]))
				backup_done.nodes.push(individual_dfas[i].nodes[k])
		}
		for (var j = 0; j < individual_dfas[i].links.length; j++) {
			// if(!is_node_or_link_contained(backup_done.links,individual_dfas[i].links[j]) 
			// 		||(individual_dfas[i].links[j] instanceof StartLink) || individual_dfas[i].links[j] ===epsilon)
				backup_done.links.push(individual_dfas[i].links[j])
		}
	}
	// console.log(backup_done)
	// console.log(expresion)
	//restoreBackup(JSON.stringify(backup))
	this.nodes = backup_done.nodes;
	this.links = backup_done.links;
	// console.log(this.nodes)
	// console.log(this.links)
	draw();


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
function estrella(dfa){
	//console.log(dfa)
	var start_state = {};//el estado inicial	
	for (var i = 0; i < dfa.links.length; i++) {//obtenenmos nodo inicial
		if(dfa.links[i] instanceof StartLink){
			start_state = dfa.links[i].node
			break;
		}
	}
	var start_state_position =  get_node_or_link_position(dfa.nodes,start_state);//posicion dentro del start_state dentro del
																			     //arreglo de dfa.nodes

	for (var i = 0; i < dfa.nodes.length; i++) {
		dfa.nodes[i]
	}
	for (var i = 0; i < dfa.nodes.length; i++) {// obtenemos nodos finales
		if(dfa.nodes[i].isAcceptState){//ahora debemos crear una transicion epsilon entre el estado final y el estado inicial
			var link;
			if(dfa.nodes[i].text === start_state.text){// hay que hacer un self link
                link = new SelfLink(start_state);
                link.anchorAngle = -2.5;//con -2.5 aparece en la parte superior izquierda del nodo donde no estorba
			}else{
				link = new Link(dfa.nodes[i], dfa.nodes[start_state_position]);
                link.perpendicularPart = 0;
                link.text = epsilon;
                var anchorPoint = calcularAnchorPoint(dfa, i,start_state_position);
                console.log(dfa.nodes[i], start_state_position)
                console.log("=" , i,get_node_or_link_position(dfa.nodes,start_state), dfa.nodes[get_node_or_link_position(dfa.nodes,start_state)])
                link.setAnchorPoint(anchorPoint.x,anchorPoint.y);
                link.parallelPart = 0.5;
			}
			dfa.links.push(link)
            //console.log(link)
		}
	}
	return dfa;
	
	
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
	//nombremos el nuevo dfa con la letra inicial de el nodo inicial de el dfa left
	for (var i = 0; i < left.links.length; i++) {
		if(left.links[i] instanceof StartLink){
			console.log("entro a left link start")
			new_nfa.text = left.links[i].node.text[0];
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
                link.text = "\\epsilon";
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
            /*anchorPointX = (nodeAX - nodeBX)/2 + nodeBX
            anchorPointY = backup.nodes[i].y - 30*/
        }
    }
    var point = {
        'x': anchorPointX,
        'y': anchorPointY
    }
    return point;

}
Array.prototype.clean = function() {
	for(var i = 0; i < this.length; i++) {
	    if(this[i] === "") {
	        this.splice(i, 1);
	    }
	}
	return this;
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