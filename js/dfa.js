
function prueba_cadena(){
    //console.log(this.links[0].nodeB)
    var input = document.getElementById('input_chain').value;
	//console.log(this.nodes) 
    //console.log(this.links);
   // console.log(input)

    

    if(is_DFA()){
        console.log("SI ES UN DFA")
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


        var current_node = this.links[StartLink_position].node;
        for (var i = 0; i < input.length; i++) {
            var current_link = -1;
            for (var j = 0; j < this.links.length; j++) {
                if(this.links[j].text === input[i]){
                    if(this.links[j].nodeB != undefined && this.links[j].nodeA === current_node){
                        current_node = this.links[j].nodeB;
                        break;
                    }

                    
                }
            }
        }
        //console.log(current_node)
        if(current_node.isAcceptState){
            console.log("LA CADENA ES ACEPTADA")
            return true;
        }
        console.log("LA CADENA ES RECHAZADA")
        return false;
    }else
        console.log("NO ES UN DFA")
    
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

    for (var i = 0; i < this.links.length; i++) {
        this.links[i]
    }
    var alfabeto = [];
    for (var i = 0; i < this.links.length; i++) {
        if(!contains(alfabeto,this.links[i].text) && this.links[i].text != ""){
            alfabeto.push(this.links[i].text)
        }
    }
    var current_node;
    var acceptable_nodes = 0;
    for (var i = 0; i < this.nodes.length; i++) {
        var alfabeto_check = [];
        current_node = this.nodes[i];
        for (var j = 0; j < this.links.length; j++) {
            if(!contains(alfabeto_check,this.links[j].text) && this.links[j].text != "" ){
                if(this.links[j].nodeA == undefined){
                    if(this.links[j].node.text === current_node.text)
                        alfabeto_check.push(this.links[j].text)
                }else if(this.links[j].node == undefined){
                    if(this.links[j].nodeA.text == current_node.text)
                        alfabeto_check.push(this.links[j].text)
                }
            }
            //(this.links.node === current_node.text || this.links.nodeA.text == current_node.text)
        }
        if(alfabeto_check.length == alfabeto.length)
            acceptable_nodes++;

    }
    console.log(acceptable_nodes+ " --")
    if(acceptable_nodes == this.nodes.length)
        return true
    return false;

}
