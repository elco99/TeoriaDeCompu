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


}

TM.prototype.getStartTransition = function() { // metodo que devuelve el nodo inicial
    for (var i = 0; i < this.transitions.length; i++) //recorre todas las transiciones y devuelve la que llega a 1 nodo pero no sale de otro
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


function load() {
    nodes = [];
    links = [];
    draw();
    restoreBackup(document.getElementById("load_inpupt").value)
}

function save(){
    console.log(saveBackup())
}
