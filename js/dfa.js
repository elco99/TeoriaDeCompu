var epsilon = "\\epsilon"
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
function delta(nodeName, input){
    var array = [];
    for (var j = 0; j < this.links.length; j++) {
        var link_text_split = this.links[j].text.split(',')
        if(this.links[j] instanceof Link){
            if(this.links[j].nodeA.text === nodeName && contains(link_text_split, input)){                        
                array.push(this.links[j].nodeB)
            }
        }else if(this.links[j] instanceof SelfLink){
            if(this.links[j].node.text === nodeName && contains(link_text_split, input)){                        
                array.push(this.links[j].node)
            }
        }                
    }
    return array
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
function save(){
    console.log(saveBackup())
}
function load(){
    restoreBackup(document.getElementById("load_inpupt").value)
}
