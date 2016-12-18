var node_amount = 0;
var order_of_nodes_and_links_to_travel_through = []

function TM(nodes, links, user_input) {
    this.states = nodes.slice(); // obtiene todos los nodos
    this.transitions = links.slice(); // obtiene todas las transiciones
    this.user_input = user_input;
    this.tape = "_" + this.user_input + "_"; // adecua el tape de entradas

    this.transition_table = this.tabla_transiciones();

    this.input_alphabet = this.getInputAlphabet(false);
    this.tape_alphabet = this.getInputAlphabet(true);

    this.initial_state = this.getInitialState();
    this.accept_state = this.getAcceptState();
    this.reject_state = this.getRejectState();

    this.configurations = [];
    this.states_path_text = [];
    this.states_path = [];
    this.transitions_path_text = [];
    this.transitions_path = [];

}


TM.prototype.getStartTransition = function() { // metodo que devuelve el nodo inicial
    for (var i = 0; i < this.transitions.length; i++) //recorre todas las transiciones y devuelve el que tenga el StartLink
        if (this.transitions[i] instanceof StartLink)
            return this.transitions[i];

    return null;
};

TM.prototype.tabla_transiciones = function() {
    var transition_table = [];
    var start_transition = this.getStartTransition();

    var current_transition = null,
        transition_input_and_movement = null;
    for (var i = 0; i < this.transitions.length; i++) { //for que recorre todas las transiciones

        current_transition = this.transitions[i]; //asigno la transicion correspondiente
        if (!(current_transition instanceof StartLink)) { // si es distinta a la inicial

            if (current_transition instanceof Link) // verifica si la transicion es de 1 nodo a otro
                transition_nodes = [current_transition.nodeA.text, current_transition.nodeB.text];
            else if (current_transition instanceof SelfLink) // verifica si la transicion es a si mismo
                transition_nodes = [current_transition.node.text, current_transition.node.text];

            transition_input_and_movement = this.getDelta(current_transition);

            new_transition = {
                start_state: transition_nodes[0], //agrega el nodo inicial
                input_symbol: transition_input_and_movement[0], //agrega lo que mira
                set_in_tape: transition_input_and_movement[1], // agrega lo que hace
                move_to: transition_input_and_movement[2], // agrega el movimiento
                final_state: transition_nodes[1] //agrega el nodo final
            };

            transition_table.push(new_transition);
        }
    }
    return transition_table;
};

TM.prototype.getDelta = function(current_transition) { // metodo que devuelve la info que lleva la transicion
    var input_and_tape_data = current_transition.text.split("->"); // separa la cadena en 2, 1 lo que mira 2 lo que hace
    var tape_symbol_and_movement_data = input_and_tape_data[1].split(","); // separa lo que debe hacer y el movimiento
    return [input_and_tape_data[0], tape_symbol_and_movement_data[0], tape_symbol_and_movement_data[1]];
};

TM.prototype.getInputAlphabet = function(add_blank) {
    var alphabet = new Set(); // arreglo que garantiza que sean diferentes esa es la funcion del set()
    for (var i = 0; i < this.transition_table.length; i++)
        if (!alphabet.has(this.transition_table[i].input_symbol)) { // verifica que el lo que ve no este en el arreglo
            alphabet.add(this.transition_table[i].input_symbol); //agrega al alfabeto lo que mira

            if (this.transition_table[i].input_symbol.localeCompare("_")) //verifica  si debe agregar el espacio vacio para la cinta de la tm
                add_blank = !add_blank
        }

    if (add_blank)
        alphabet.add("_");

    return alphabet;
};



TM.prototype.getInitialState = function() {
    return this.getStartTransition().node;
};

TM.prototype.getAcceptState = function() {
    for (var i = 0; i < this.states.length; i++)
        if (this.states[i].isAcceptState)
            return this.states[i];

    return null;
};

TM.prototype.getRejectState = function() {
    for (var i = 0; i < this.states.length; i++)
        if (this.states[i].isRejectState)
            return this.states[i];

    var ret_val = new Node(0, 0);
    ret_val.isRejectState = true;
    ret_val.text = "qr";

    return ret_val;
};

TM.prototype.probar_cadena = function() {
    for (var i = 0; i < this.states.length; i++) { //limpia todo los colores
        this.states[i].animate("white");
    }
    draw();
    order_of_nodes_and_links_to_travel_through = []; 
    node_amount = 0;
    var current_tape_index = 1;
    var current_state = this.initial_state.text, current_transition = null,temp_tape = this.tape, state_change = false;
    while (current_state != this.accept_state.text && current_state != this.reject_state.text) { //controla hasta que llegue a un estado de aceptacion o rechazo

        for (var i = 1; i < temp_tape.length - 1; i++) { // recorre la copia del tape
            state_change = false;

            for (var j = 0; j < this.transition_table.length; j++) { // for que controla las transiciones
                current_transition = this.transition_table[j]; // la transicion sub j
                if ((current_transition.start_state == current_state) && (current_transition.input_symbol == temp_tape.charAt(current_tape_index))) {  //verifica hasta encontrar el nodo de inicio
                    current_state = current_transition.final_state.valueOf(); //  a current le asigna  a lo que debe de pasar
                    this.states_path_text.push(current_state); //agrega el estado al arreglo
                    this.transitions_path_text.push(current_transition); //agrega la transicion

                    state_change = true;
                    temp_tape = temp_tape.substr(0, current_tape_index) + current_transition.set_in_tape + temp_tape.substr(current_tape_index + 1);

                    console.log(temp_tape.substr(0, current_tape_index) + "<" + current_state + ">" + temp_tape.substr(current_tape_index));
                    this.configurations.push(temp_tape.substr(0, current_tape_index) + "<" + current_state + ">" + temp_tape.substr(current_tape_index)); //agrega el cambio que hubo en tape

                    if (current_transition.move_to === "R" || current_transition.move_to === "r") // realiza el movimiento a la derecha en el tape
                        current_tape_index++;
                    else if (current_transition.move_to === "L" || current_transition.move_to === "l") // realiza el movimiento a la izquierda del tape
                        current_tape_index--;

                    break;
                }

            }

        }

        if (current_state == this.accept_state.text || current_state === this.reject_state.text) // verifica que llego a un estado ya sea de aceptacion o rechazo
            state_change = true;

        if (!state_change)
            current_state = this.reject_state.text;
    }

    if (current_state == this.accept_state.text) {
        swal({
          title: "Aceptado!",
          text: "La cadena es aceptada!",
          type: "success",
          confirmButtonText: "Ok"
        },function(isConfirm){
          if (isConfirm) {
            animation();
          }
        });
    } else {
        swal({
          title: "Rechazado!",
          text: "La cadena es rechazada!",
          type: "error",
          confirmButtonText: "Ok"
        },function(isConfirm){
          if (isConfirm) {
            animation();
          }
        });
    }

    this.states_path = this.getStatesFromText();
    this.transitions_path = this.getTransitionsFromText();
    for (var i = 0; i < links.length; i++){
        if (links[i] instanceof StartLink){
            order_of_nodes_and_links_to_travel_through.push(links[i])
            order_of_nodes_and_links_to_travel_through.push(links[i].node)
            break;
        }
    }

    for (var i = 0; i < this.transitions_path.length; i++) {//mete las transiciones para poder hacer el cambio de color
        if (this.transitions_path[i] instanceof SelfLink) {
            order_of_nodes_and_links_to_travel_through.push(this.transitions_path[i]);
            order_of_nodes_and_links_to_travel_through.push(this.transitions_path[i].node)
        }else if(this.transitions_path[i].nodeB !== undefined){
            order_of_nodes_and_links_to_travel_through.push(this.transitions_path[i]);
            order_of_nodes_and_links_to_travel_through.push(this.transitions_path[i].nodeB)
        };
    };
};


TM.prototype.getStatesFromText = function() {  // devuelve el arreglo de el nombre de los nodos
    var ret_val = [];
    for (var i = 0; i < this.states_path_text.length; i++)
        for (var j = 0; j < this.states.length; j++)
            if (this.states[j].text === this.states_path_text[i]) {
                ret_val.push(this.states[j]);
                break;
            }
    return ret_val;
};

TM.prototype.getTransitionsFromText = function() {
    var ret_val = [],
        current_transition = null,
        current_text_trans = null,
        transition_input_and_movement = null;
    for (var i = 0; i < this.transitions_path_text.length; i++) // recorre el texto de las transiciones
        for (var j = 0; j < this.transitions.length; j++) { // recorre transiciones
            current_transition = this.transitions[j];
            current_text_trans = this.transitions_path_text[i];
            if (!(current_transition instanceof StartLink)) { //verifica que no sea la transicion de inicio

                if (current_transition instanceof Link) // verifica que sea una transicion de un nodo a otro
                    transition_nodes = [current_transition.nodeA.text, current_transition.nodeB.text];
                else if (current_transition instanceof SelfLink) // verifica que sea una transicion asi mismo
                    transition_nodes = [current_transition.node.text, current_transition.node.text];

                transition_input_and_movement = this.getDelta(current_transition); // devuelve la info de la transicion

                new_transition = { //crea la nueva transicion, con la info obtenida
                    start_state: transition_nodes[0],
                    input_symbol: transition_input_and_movement[0],
                    set_in_tape: transition_input_and_movement[1],
                    move_to: transition_input_and_movement[2],
                    final_state: transition_nodes[1]
                };

                if (new_transition.start_state == current_text_trans.start_state &&
                    new_transition.final_state == current_text_trans.final_state &&
                    new_transition.input_symbol == current_text_trans.input_symbol &&
                    new_transition.set_in_tape == current_text_trans.set_in_tape &&
                    new_transition.move_to == current_text_trans.move_to) { // verifica que sea la misma que se encontro
                    ret_val.push(this.transitions[j]);
                    break;
                }
            }
        }

    return ret_val;
};

TM.prototype.not_tm = function() { 
    var trans_text = nodes_text = accept_state = false;
    var error_message = "";

    if (accept_state = (this.accept_state == null))
        error_message += "\n* La máquina requiere de un estado de aceptación\n";
    if (!(trans_text = this.validate_transitions()))
        error_message += "\n* Las transiciones tienen que tener la forma a->b,c\n"
    if (!(nodes_text = this.validate_nodes()))
        error_message += "\n* Todos los estados tienen que tener nombre\n";

    if (!trans_text || !nodes_text || accept_state) {
       swal({
          title: "Error!",
          text: error_message,
          type: "error",
          confirmButtonText: "Ok"
        });
        return false;
    }

    return true;
};

TM.prototype.validate_transitions = function() { 
    var pattern = /^[a-zA-Z0-9_#]->[a-zA-Z0-9_#],(R|r|L|l)$/;
    for (var i = 0; i < this.transitions.length; i++) {
        if (!pattern.test(this.transitions[i].text) && !(this.transitions[i] instanceof StartLink))
            return false;
    }
    return true;
};

TM.prototype.validate_nodes = function() {
    for (var i = 0; i < this.states.length; i++)
        if (this.states[i].text == null || this.states[i].text == "")
            return false;
    return true;
};

function validations() { 
    var has_errors = false,
        error_message = "";

    if (nodes.length == 0) {
        error_message += "\n* La máquina ocupa estados\n";
        has_errors = true;
    }
    if (!is_startLink()) {
        error_message += "\n* La máquina ocupa estado inicial\n";
        has_errors = true;
    }
    if (links.length == 0) {
        error_message += "\n* La máquina ocupa transiciones\n";
        has_errors = true;
    } else if (!Links_has_text()) {
        error_message += "\n* Las transiciones ocupan texto\n";
        has_errors = true;
    }

    return {
        has_errors: has_errors,
        error_message: error_message
    };
};

function is_startLink() { 
    for (var i = 0; i < links.length; i++)
        if (links[i] instanceof StartLink)
            return true;
    return false;
}

function Links_has_text() {
    for (var i = 0; i < links.length; i++)
        if ((links[i].text == null || links[i].text == "") && !(links[i] instanceof StartLink))
            return false;
    return true;
}


function starting_color() { 
    for (var i = 0; i < nodes.lenght; i++)
        nodes[i].strokeStyle = "white";
    for (var i = 0; i < links.length; i++)
        links[i].strokeStyle = "white";
}

function start_probar_cadena() { 
    var generic_validations = validations();
    
    if (!generic_validations.has_errors) {
        starting_color();
        var tm = new TM(nodes, links, document.getElementById('cadena').value);
        if (tm.not_tm()) {
            tm.probar_cadena();
        }
    } else {
        swal({
          title: "Error!",
          text: generic_validations.error_message,
          type: "error",
          confirmButtonText: "Ok"
        });
    }
};

function animation(){
    if(node_amount < order_of_nodes_and_links_to_travel_through.length){
        if(node_amount > 0){
            order_of_nodes_and_links_to_travel_through[node_amount-1].animate("white")
        }
            
        order_of_nodes_and_links_to_travel_through[node_amount].animate("blue")
        node_amount++;
        if(node_amount === order_of_nodes_and_links_to_travel_through.length){
            if(order_of_nodes_and_links_to_travel_through[node_amount-1].isAcceptState){
                order_of_nodes_and_links_to_travel_through[node_amount-1].animate("#58FA58")

            }else{            
                order_of_nodes_and_links_to_travel_through[node_amount-1].animate("red")
            }
        }
       
        draw();
        setTimeout(animation, 500);        
    }else{
    }

}

function load() {
    this.nodes = [];
    this.links = [];
    restoreBackup(document.getElementById("load_inpupt").value)
}

function save(){
    swal({
      title: "Copy&Paste!",
      text: saveBackup(),
      type: "success",
      confirmButtonText: "Ok"
    });
}
