var epsilon = "\\epsilon"
var empty_set = "\\phi"
var max_depth = 0;
function prueba_cadena(){
    //console.log(this.links[0].nodeB)
    var input = document.getElementById('input_chain').value;
	//console.log(this.nodes) 
    //console.log(this.links);
   // console.log(input)
    var StartLink_position = -1;
    var cont =0 ;
    for (var i = 0; i < this.links.length; i++) {
        if(this.links[i] instanceof StartLink){

            StartLink_position = i;
            cont++;
            
        }

    }
    if(StartLink_position === -1){
        console.log("SE NECESITA UN ESTADO INICIAL")
        return false;
    }
    if(cont > 1){
        console.log("SOLO DEBE DE TENER UN ESTADO INICIAL")
        return false;
    }
    

    if(is_DFA()){
        console.log("SI ES UN DFA")
        DFA_probar_cadena(input,StartLink_position)
    }else{
        console.log("ES NFA")
        NFA_probar_cadena(input,StartLink_position)

    }
    
}
function contains(arreglo, value){
    for (var i = 0; i < arreglo.length; i++) {
        if(arreglo[i] === value )
            return true;
    }
    return false;
}

function is_DFA(){
    var accepted_names =true;
    for (var i = 0; i < this.nodes.length; i++) {
        if(this.nodes[i].text == "")
            accepted_names = false;
    }
    if(!accepted_names){
        console.log("NOMBRES DE NODOS INCOMPLETOS")
        return false;
    }

    var alfabeto = [];
    for (var i = 0; i < this.links.length; i++) {
        var current_link_text = this.links[i].text.split(',')
        for (var k = 0; k < current_link_text.length; k++) {
            if(!contains(alfabeto,current_link_text[k]) && current_link_text != ""){
                alfabeto.push(current_link_text[k])
            }
        }
    }
    var current_node;
    var acceptable_nodes = 0;
    for (var i = 0; i < this.nodes.length; i++) {
        var alfabeto_check = [];
        current_node = this.nodes[i];
        for (var j = 0; j < this.links.length; j++) {

            var current_link_text = this.links[j].text.split(',')
            for (var k = 0; k < current_link_text.length; k++) {
                if(!contains(alfabeto_check,current_link_text[k]) && current_link_text[k] != "" ){
                    if(this.links[j].nodeA == undefined){
                        if(this.links[j].node.text === current_node.text){
                            alfabeto_check.push(current_link_text[k])
                        }
                    }else if(this.links[j].node == undefined){
                        if(this.links[j].nodeA.text == current_node.text){
                            alfabeto_check.push(current_link_text[k])
                        }
                    }
                }                
            }
            //(this.links.node === current_node.text || this.links.nodeA.text == current_node.text)
        }
        /*console.log(alfabeto_check)
        console.log(alfabeto)*/
        if(alfabeto_check.length == alfabeto.length)
            acceptable_nodes++;

    }
    if(acceptable_nodes == this.nodes.length)
        return true
    return false;

}
function DFA_probar_cadena(input,StartLink_position){
        var current_node = this.links[StartLink_position].node;
        for (var i = 0; i < input.length; i++) {
            var current_link = -1;
            for (var j = 0; j < this.links.length; j++) {
                var current_link_text = this.links[j].text.split(',')
                for (var k = 0; k < current_link_text.length; k++) {
                    if(current_link_text[k] === input[i]){
                        //console.log(current_node.text)
                        if(this.links[j].nodeB != undefined && this.links[j].nodeA.text === current_node.text){
                            current_node = this.links[j].nodeB;
                            j = this.links.length // para salirse del ciclo de j que break solo saldra de k
                            break;
                        }
                        
                    }
                }

            }
        }
        //  console.log(current_node)
        if(current_node.isAcceptState){
            console.log("LA CADENA ES ACEPTADA")
            return true;
        }
        console.log("LA CADENA ES RECHAZADA")
        return false;
}
function NFA_probar_cadena(input,StartLink_position){
    //construir el arbol
    /*console.log("E(&(1 a):  ",E(delta("1","a")))
    console.log("E(&(2 a):  ",E(delta("2","a")))
    console.log("E(&(3 a):  ",E(delta("3","a")))
    console.log("E(&(1 b):  ",E(delta("1","b")))
    console.log("E(&(2 b):  ",E(delta("2","b")))
    console.log("E(&(3 b):  ",E(delta("3","b")))


    console.log("&^(1 a):  ",delta_gorrito(["1"],"a"))
    console.log("&^(1,2 a):  ",delta_gorrito(["1","2"],"a"))
    console.log("&^(1,3 a):  ",delta_gorrito(["1","3"],"a"))
    console.log("&^(1,2,3 a):  ",delta_gorrito(["1,","2","3"],"a"))
    console.log("&^(2 a):  ",delta_gorrito(["2"],"a"))
    console.log("&^(2,3 a):  ",delta_gorrito(["2","3"],"a"))
    console.log("&^(3 a):  ",delta_gorrito(["3"],"a"))

    console.log("&^(1 b):  ",delta_gorrito(["1"],"b"))
    console.log("&^(1,2 b):  ",delta_gorrito(["1","2"],"b"))
    console.log("&^(1,2,3 b):  ",delta_gorrito(["1","2","3"],"b"))
    console.log("&^(2 b):  ",delta_gorrito(["2"],"b"))
    console.log("&^(2,3 b):  ",delta_gorrito(["2","3"],"b"))
    console.log("&^(3 b):  ",delta_gorrito(["3"],"b"))
    console.log("&^(1,3 b):  ",delta_gorrito(["1","3"],"b"))*/


    var current_node = this.links[StartLink_position].node;
    var tree=construct_tree(input,0,current_node)
    //console.log(tree);
    get_tree_depht(tree,1,input.length)
    // console.log(max_depth);
    if(check_if_leaf_nodes_isAcceptState(tree,1)) {
            console.log("LA CADENA ES ACEPTADA")
            return true;
    }
    console.log("LA CADENA ES RECHAZADA")
    return false;
}
function construct_tree(input,position_on_input,current_node){
    var tree ={
        'text': current_node.text,
        'children': [],
        'isAcceptState':current_node.isAcceptState
    }
    if(position_on_input < input.length ){
       
        for (var i = 0; i < this.links.length; i++) {
            var current_link_text = this.links[i].text.split(',')
            for (var k = 0; k < current_link_text.length; k++) {
                // console.log(position_on_input, this.links[i])
                if(current_link_text[k] === input[position_on_input] ){// si el link tiene el input
                   
                    if(this.links[i] instanceof Link){// si no es un self-link o start-link
                        if(this.links[i].nodeA.text === current_node.text){// si el link contiene el input y sale del nodo actual                                
                           
                            if(!tree_contains(tree.children,this.links[i].nodeB))
                                    tree.children.push(construct_tree(input,position_on_input+1,  this.links[i].nodeB))
                            
                        }
                    }else if(this.links[i] instanceof SelfLink){
                        if(this.links[i].node.text === current_node.text){// si el link contiene el input y sale del nodo actual
                            

                            if(!tree_contains(tree.children,this.links[i].node))
                            tree.children.push(construct_tree(input,position_on_input+1, current_node)) 
                           

                        }
                    }                
                }else if (current_link_text[k] === epsilon){// slatarse a la siguiente
                    if(this.links[i] instanceof Link){// si no es un self-link o start-link
                        if(this.links[i].nodeA.text === current_node.text){// si el link contiene el input y sale del nodo actual                                
                            

                            if(!tree_contains(tree.children,this.links[i].nodeB))
                                    tree.children.push(construct_tree(input,position_on_input,  this.links[i].nodeB))
                           
                        }
                    }else if(this.links[i] instanceof SelfLink){
                        if(this.links[i].node.text === current_node.text){// si el link contiene el input y sale del nodo actual
                            
                            if(!tree_contains(tree.children,this.links[i].node)) 
                                    tree.children.push(construct_tree(input,position_on_input, current_node))

                           
                        }
                    }

                }
            }
        }
    }
   
    return tree;

}
function convert_nfa_to_dfa(){
    console.log(this.links)
    // primero creamos Q del dfa a partir de los nodos del nfa
    var Q_dfa = [];// conjunto de estados de el dfa
    var alfabeto_dfa = [];//el alfabeto del dfa
    var q0_nfa; // estado inicial del nfa
    var q0_dfa; // estado inicial del dfa
    var F_nfa = []; // estados finales del nfa
    var backup = {// estructura que contendra el dfa antes de ser dibujado
        'nodes': [],
        'links': [],
    };

    for (var i = 0; i < this.nodes.length; i++) {
        Q_dfa.push(this.nodes[i].text);
        if(this.nodes[i].isAcceptState)
            F_nfa.push(this.nodes[i].text)
    }
    Q_dfa = combinations(Q_dfa);
    Q_dfa.unshift(empty_set);// se le agrega el conjunto vacio al inicio, en este caso representado por phi
    console.log(Q_dfa)

    // conseguimos el alfabeto del nfa, sin tomar en cuenta epsilon, este sera el alfabeto del dfa y aprovechamos
    // para conseguir el estado inicial del nfa para luego calcular el del dfa
    for (var i = 0; i < this.links.length; i++) {
        var link_text_split = this.links[i].text.split(',')
        if(this.links[i] instanceof StartLink){// es el inicial
            q0_nfa = this.links[i].node.text;
            console.log(q0_nfa)
        }
        for (var j = 0; j < link_text_split.length; j++) {
            if(!contains(alfabeto_dfa,link_text_split[j]) && link_text_split[j] !== epsilon && link_text_split[j] !== ""){
                alfabeto_dfa.push(link_text_split[j])
            }
        }
    }
    alfabeto_dfa.sort();
    console.log(alfabeto_dfa)

    

    var espacio_entre_nodos = 150
    var x_position = espacio_entre_nodos, y_position = espacio_entre_nodos;// se incrementara cada vez que un nodo se dibuje
                                                                            //para que no queden montados

    // construimos los nodos de Q_dfa
    for(var i = 0; i < Q_dfa.length; i++) {
        var random = Math.floor( (Math.random()*50) );
        var node = new Node(x_position ,y_position);// random para que los nodos no esten exactamente en el mismo lugar 
                                                          // en el eje y asi ciertas transiciones no se superposicionan
                                                          // por que da mucha weba calcular los datos de los links
        node.text = Q_dfa[i]; 
        if(x_position + espacio_entre_nodos >=750){
            x_position = espacio_entre_nodos;
            y_position +=espacio_entre_nodos;
            if(y_position >= 550){
                document.getElementById("canvas").height += 150
            }
        }else{
            x_position += espacio_entre_nodos
        }
        // verificamos si el nodo es final
        if(contains_for_final_states(F_nfa, node.text ))
            node.isAcceptState = true;

        backup.nodes.push(node);    

    }  

    // construimos los links 
    var was_empty_set_node_reached = false;
    for (var i = 0; i < backup.nodes.length; i++) {
        for (var j = 0; j < alfabeto_dfa.length; j++) {// creamos un link por cada valor en el alfabeto
            var next_node_name = delta_gorrito(backup.nodes[i].text.split(','),alfabeto_dfa[j]).toString();
            if(next_node_name === ""){// el link debe ir a el conjunto vacio
                next_node_name = empty_set                
            }
            for (var k = 0; k < backup.nodes.length; k++) {// buscamos la posicion del next_node_name en el arreglo de nodos
                if(backup.nodes[k].text === next_node_name){
                    var link;
                    if(backup.nodes[i].text === next_node_name){// es un selfLink
                        link = new SelfLink(backup.nodes[i]);
                        link.anchorAngle = -2.5;//con -2.5 aparece en la parte superior izquierda del nodo donde no estorba
                        link.text = alfabeto_dfa.toString();
                    }else{// es un link normal a otro estado
                        var link = new Link(backup.nodes[i], backup.nodes[k]);
                        link.perpendicularPart =  0;
                        link.parallelPart = 0;
                        
                        var anchorPoint = calcularAnchorPoint(backup,i,k);
                        link.setAnchorPoint(anchorPoint.x,anchorPoint.y);
                    }

                    link.text = alfabeto_dfa[j];
                    backup.links.push(link)
                    break;

                }
            }
        }
    }

    // ahora creamos el nodo inicial con su startlink
    q0_dfa = E(q0_nfa).toString();
    console.log(q0_nfa);
    console.log(q0_dfa)
    for (var i = 0; i < backup.nodes.length; i++) {
        if(backup.nodes[i].text === q0_dfa){
            var start_link = new StartLink(backup.nodes[i]);
            start_link.deltaX = -100; // -100 pixeles de separacion hacia la izquierda con su centro
            start_link.deltaY = 0;  
            backup.links.push(start_link)
        }
        if(i>0)// ya que el 0 es phi y phi ya representa el conjunto vacio, no son necesarios los {}
         backup.nodes[i].text = "{"+backup.nodes[i].text+"}"
        
    }
    // por ultimo, si hay varios links saliendo de un estado y entrando al mismo estado los consolidaremos dentro de uno solo
    // separando cada valor de la transicion por comas
    for (var i = 0; i < backup.nodes.length; i++) {

        // for (var j = 0; j < alfabeto_dfa.length; j++) {

            for (var j = 0; j < backup.links.length; j++) {

                for (var k = 0; k < backup.links.length; k++) {
                   if(backup.links[j].node === backup.links[k].node && backup.links[j].nodeA === backup.links[k].nodeA
                        && backup.links[j].nodeB === backup.links[k].nodeB && j !== k 
                        && backup.links[j].text !== backup.links[k].text && !(backup.links[k] instanceof StartLink)
                        && !(backup.links[j] instanceof StartLink)){
                        console.log(j,k)
                        //si todas se cumplen tienen los mismos objetivos pero no son el mismo link
                        //deben tener los mismos nodos y los mismos undefined indpenedientemente del tipo de link
                        backup.links[j].text +=","+backup.links[k].text
                        backup.links.splice(k,1)
                        j = 0;
                        break;
                   }
                }
                
            }

        // }


    }
    console.log(backup.links)
    

    this.nodes = backup.nodes;
    this.links = backup.links;
    draw();
}
function delta(nodeName, input){
    //recibe el nombre de un nombre y el valor para la transicion y retorna un arreglo con los nombres de los 
    //nodos a los que puede llegar con dicha transicion desde el nodo proporcionado
    var array = [];    
    for (var j = 0; j < this.links.length; j++) {
        var link_text_split = this.links[j].text.split(',')
        if(this.links[j] instanceof Link){
            if(this.links[j].nodeA.text === nodeName && contains(link_text_split, input)){                        
                array.push(this.links[j].nodeB.text)
            }
        }else if(this.links[j] instanceof SelfLink){
            if(this.links[j].node.text === nodeName && contains(link_text_split, input)){                        
                array.push(this.links[j].node.text)
            }
        }                
    }
    return array
}

function E(nodeNames){
    //recibe un arreglo de nombres de nodos (que generalmente han sido retornados por la funcion delta) y llena un arreglo
    //con los nodos a los que los 'nodeNames' pueden llegar con 0 o mas trasiciones epsilon
    var array =[];
    for (var i = 0; i < nodeNames.length; i++) {
        //se inserta nodeNames[i] al array ya que siempre llegara a si mismo con 0 transiciones epsilon
        if(!contains(array,nodeNames[i]))
            array.push(nodeNames[i])
        for (var j = 0; j < this.links.length; j++) {
            var link_text_split = this.links[j].text.split(',')            
            if(this.links[j] instanceof Link){
                if(this.links[j].nodeA.text === nodeNames[i] && contains(link_text_split, epsilon)){      
                    if(!contains(array, this.links[j].nodeB.text)){
                        array.push(this.links[j].nodeB.text)
                        var next_node_E_transitions = E(this.links[j].nodeB.text)
                        for (var k = 0; k < next_node_E_transitions.length; k++) {
                            if(!contains(array, next_node_E_transitions[k])){
                                array.push(next_node_E_transitions[k])
                            }
                        }
                    }               
                }
            }else if(this.links[j] instanceof SelfLink){
                if(this.links[j].node.text === nodeNames[i] && contains(link_text_split, epsilon)){       
                    if(!contains(array, this.links[j].node.text)){
                        array.push(this.links[j].node.text)                
                        var next_node_E_transitions = E(this.links[j].node.text)
                        for (var k = 0; k < next_node_E_transitions.length; k++) {
                            if(!contains(array, next_node_E_transitions[k])){
                                array.push(next_node_E_transitions[k])
                            }
                        }
                    }                    
                }
            }                
        }        
    }
    return array.sort();

}

function delta_gorrito(nodeNames, input){
    //recibe un arreglo de nombres de nodos y un input(para transicion)
    //utiliza la funcion delta con el input y cada uno de los nodos del arreglo y cada salida de la funcion delta
    //se pasa a la funcion E para sacar las transiciones epsilon
    var array = [];
    for (var i = 0; i < nodeNames.length; i++) {
        var E_value = E(delta(nodeNames[i], input))
        for (var j = 0; j < E_value.length; j++) {
            if(!contains(array,E_value[j]))
                array.push(E_value[j])
        }
        
    }
    return array.sort();
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

function combinations(str) {
    var result = [];
    var f = function(prefix, str) {
        for (var i = 0; i < str.length; i++) {
          result.push(prefix + str[i] + ",");
          f(prefix+ str[i] + "," , str.slice(i + 1));
        }
    }
    f('', str);
    for (var i = 0; i < result.length; i++) {// eliminar la ultima coma
        result[i] = result[i].replace(/,\s*$/, "");
    }
    return result.sort();
}


function check_if_leaf_nodes_isAcceptState(tree, current_depth){
    var leaf_isAcceptState = false;
    if(tree.children.length === 0 ){// es hoja
        if(tree.isAcceptState && current_depth === max_depth)
            return true;

    }else{
        for (var i = 0; i < tree.children.length; i++) {
            leaf_isAcceptState= check_if_leaf_nodes_isAcceptState(tree.children[i],current_depth+1)
            if(leaf_isAcceptState)
                return true;
        }
    }
    return leaf_isAcceptState
}
function e_transitions_for_testing_strings(current_node){
    var states = []
    for (var i = 0; i < this.links.length; i++) {
        if(this.links[i] instanceof Link){// si no es un self-link o start-link
            if(this.links[i].nodeA.text === current_node.text && this.links[i].text === epsilon){// si el link contiene el input y sale del nodo actual                                
                //console.log("entra",current_node)
                states.push(this.links[i].nodeB)
                var temp = e_transitions_for_testing_strings(this.links[i].nodeB)
                // console.log(temp)
                for (var k = 0; k < temp.length; k++) {                   
                    states.push(temp[k])
                }
                //ahora tengo que saber si el nodo al que me movi tiene transiciones epsilon
            }
        }
    }
    return states;

}

function get_tree_depht(tree,current_depth){
    if(tree.children.length  === 0 ){//es hoja
        if(current_depth > max_depth){
            max_depth = current_depth;
        }
    }
    for (var i = 0; i < tree.children.length; i++) {//no es hoja asi que nos movemos dentro de sus hijos
        get_tree_depht(tree.children[i],current_depth+1)
    }
}
function contains(array,value){
    for (var i = 0; i < array.length; i++) {
        if(array[i] === value)
            return true
    }
    return false;

}
function tree_contains(children, node){
    for (var i = 0; i < children.length; i++) {

    // console.log(children[i])

        if(children[i].text === node.text){
            return true
        }
    }
    return false;
}
function contains_for_final_states(dfa_array, nfa_state_name){
    nfa_state_name_split = nfa_state_name.split(',')
    for (var i = 0; i < dfa_array.length; i++) {
        
        for (var j = 0; j < nfa_state_name_split.length; j++) {
            if(dfa_array[i] === nfa_state_name[j])
                return true;
        }
    }
    return false;

}
function save(){
    console.log(saveBackup())
}
function load(){
    restoreBackup(document.getElementById("load_inpupt").value)
}
