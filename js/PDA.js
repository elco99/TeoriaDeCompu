function ProbarCadena(field) {
    if (field.value != '') {
        var pda = new PDA(nodes, links);
        if (Validacion(pda)) {
            pda.posiblePaths = [];
            var accepted = false;
            var allPaths = pda.Camino({
                input: document.getElementById('input_textPDA').value,
                branches: {},
                conecciones: []
            }, pda.estado_inicial.text);
            if (pda.posiblePaths.length > 0) {
                pda.evaluarCadena(document.getElementById('input_textPDA').value, pda.posiblePaths[0], 0);
            }
        }
    } else {
      $("#cambio").text ("No ingreso texto");
    }
};

function Validacion(pda) {
    console.log("entre");
    if (pda.estados.length == 0) {
        $("#cambio").text ("La máquina esta indefinida");
    } else {
        var Eetiquetas = true;
        for (index = 0; index < pda.estados.length; index++) {
            if (pda.estados[index].text == "") {
                $("#cambio").text ("Los estados no tienen etiqueta");
                Eetiquetas = false;
                break;
            }
        }
        if (Eetiquetas) {
            var differ = true;
            for (index = 0; index < pda.estados.length - 1; index++) {
                for (index2 = index + 1; index2 < pda.estados.length; index2++) {
                    if (pda.estados[index].text == pda.estados[index2].text) {
                        $("#cambio").text ("Los estados tiene etiquetas similares"); ;
                        differ = false;
                        break;
                    }
                }
                if (!differ)
                    break;
            }
            if (differ) {
                if (pda.transition_table.length == 1) {
                    $("#cambio").text ("No existen transiciones");
                } else if (pda.alphabet.length == 0) {
                    $("#cambio").text ("Las transiciones deben tener la forma \'input,pop->push\' para que haya un alfabeto valido");
                } else if (pda.estado_inicial == null) {
                    $("#cambio").text ("Debe existir un estado incial");
                } else if (pda.estados_finales.length == 0) {
                    $("#cambio").text ("Debe tener un estado final");
                } else {
                    return true;
                }
            }
        }

    }
}

function PDA(nodes, links) {
    this.estados = nodes.slice();
    this.conecciones = links.slice();
    this.estados_finales = [];
    if (this.getInicial() != null) {
        this.estado_inicial = this.getInicial().node;
    }


    for (var i = 0; i < this.estados.length; i++) {
        if (this.estados[i].isAcceptState) {
            this.estados_finales.push(this.estados[i]);
        }
    }

    this.transition_table = this.Tabla_Conecciones();
    this.alphabet = this.defineAlphabet();
    this.alphabetStack = this.D_alfabeto();
    this.posiblePaths = [];
    this.waitTime = 0;
    this.stack = new Array();
}


PDA.prototype.defineAlphabet = function() {
    var alphabet = [];
    for (var index = 1; index < this.transition_table.length; index++) {
        var simbolfound = false;
        for (var indexalphabet = .0; indexalphabet < alphabet.length; indexalphabet++) {
            if (alphabet[indexalphabet] == this.transition_table[index][0][1]) {
                simbolfound = true;
                break;
            }

        }
        if (!simbolfound) {
            if (this.transition_table[index][0][1] != undefined && this.transition_table[index][0][1] != "") {
                alphabet.push(this.transition_table[index][0][1]);
            } else {
                alphabet = [];
                break;
            }
        }
    }
    return alphabet;
};

PDA.prototype.D_alfabeto = function() {
    var alphabetStack = [];
    for (var index = 1; index < this.transition_table.length; index++) {
        var simbolfound = false;
        for (var indexalphabetStack = .0; indexalphabetStack < alphabetStack.length; indexalphabetStack++) {
            if (alphabetStack[indexalphabetStack] == this.transition_table[index][0][2]) {
                simbolfound = true;
                break;
            }

        }

        if (!simbolfound) {
            if (this.transition_table[index][0][2] != "" && this.transition_table[index][0][2] != undefined) {
                alphabetStack.push(this.transition_table[index][0][2]);
            } else {
                alphabetStack = [];
                break;
            }

        }
    }
    for (var index = 1; index < this.transition_table.length; index++) {
        var simbolfound = false;
        for (var indexalphabetStack = .0; indexalphabetStack < alphabetStack.length; indexalphabetStack++) {
            if (alphabetStack[indexalphabetStack] == this.transition_table[index][0][3]) {
                simbolfound = true;
                break;
            }

        }
        if (!simbolfound) {
            if (this.transition_table[index][0][3] != "" && this.transition_table[index][0][3] != undefined) {
                alphabetStack.push(this.transition_table[index][0][3]);
            } else {
                alphabetStack = [];
                break;
            }

        }
    }
    return alphabetStack;
};

PDA.prototype.Camino = function(path, fromNode) {
    for (var j = 0; j < this.conecciones.length; j++) {
        var transitionFrom, transitionTo, isAcceptState;
        if (this.conecciones[j] instanceof SelfLink || this.conecciones[j] instanceof StartLink) {
            transitionFrom = this.conecciones[j].node.text;
            transitionTo = this.conecciones[j].node.text;
            isAcceptState = this.conecciones[j].node.isAcceptState;
        } else {
            transitionFrom = this.conecciones[j].nodeA.text;
            transitionTo = this.conecciones[j].nodeB.text;
            isAcceptState = this.conecciones[j].nodeA.isAcceptState;
        }
        if (transitionFrom === fromNode) {
            var simbols = this.conecciones[j].text.split(";");
            for (var k = 0; k < simbols.length; k++) {
                if (simbols[k].split(",")[0] === "E") {

                    var coneccionesTemp = jQuery.extend(true, [], path.conecciones);
                    coneccionesTemp.push(this.conecciones[j]);
                    path.branches[transitionTo + ";" + k] = this.Camino({
                        input: path.input,
                        branches: {},
                        conecciones: coneccionesTemp
                    }, transitionTo);
                    path.branches[transitionTo + ";" + k].conecciones = coneccionesTemp;

                } else {
                    if (path.input !== "") {
                        if (simbols[k].split(",")[0] === path.input[0]) {
                            var coneccionesTemp = jQuery.extend(true, [], path.conecciones);
                            coneccionesTemp.push(this.conecciones[j]);
                            path.branches[transitionTo + ";" + k] = this.Camino({
                                input: path.input.substr(1),
                                branches: {},
                                conecciones: coneccionesTemp
                            }, transitionTo);

                            path.branches[transitionTo + ";" + k].conecciones = coneccionesTemp;
                        }
                    }
                }
            }
        }
    }
    path.hasBranches = Object.keys(path.branches).length > 0;
    if (!path.hasBranches && path.input === "") {
        this.posiblePaths.push(path.conecciones);
    }
    return path;

}

function Palindrom(str) {
    return str == str.split('').reverse().join('');
}

PDA.prototype.evaluarCadena = function(input, pathTransitions, index) {
    $("#stack-row").empty();
    var temp = this.estado_inicial;
    var nodePath = [];
    var transitionPath = [];
    var S_acciones = [];
    var S_Alfabeto = []
    var termina = false;
    var rechazo = false;

    for (var currentLetter = 0; currentLetter < input.length; currentLetter++) {
        var salirFor = false;
        var recorridoTransiciones = 0;
        for (var i = 0; i < pathTransitions.length; i++) {
            var current_transition = pathTransitions[i];
            if (current_transition instanceof StartLink)
                continue;
            var simbols = current_transition.text.split(';');
            for (var searchsimbol = 0; searchsimbol < simbols.length; searchsimbol++) {
                var firstTransitionDivision;
                if (current_transition instanceof Link)
                    firstTransitionDivision = [current_transition.nodeA.text, simbols[searchsimbol], current_transition.nodeB.text];
                else
                    firstTransitionDivision = [current_transition.node.text, simbols[searchsimbol], current_transition.node.text];
                var currentDividedTransition = this.dividirConecciones(firstTransitionDivision);
                currentDividedTransition = currentDividedTransition[0];

                if (currentDividedTransition[1] == input.charAt(currentLetter) || currentDividedTransition[1] == 'E') {
                    if (!(current_transition instanceof StartLink)) {
                        var current_transitionNodeText;
                        if (current_transition instanceof SelfLink) {
                            current_transitionNodeText = current_transition.node.text;
                        } else {
                            current_transitionNodeText = current_transition.nodeA.text;
                        }
                        if (current_transitionNodeText == temp.text) {
                            if (currentDividedTransition[2] != 'E') {
                                if (currentDividedTransition[2] == this.stack[this.stack.length - 1]) {

                                    nodePath.push(temp);
                                    transitionPath.push(current_transition);
                                    S_acciones.push("pop");
                                    this.stack.pop();

                                    if (currentDividedTransition[3] !== 'E') {
                                        this.stack.push(currentDividedTransition[3]);
                                        S_Alfabeto.push(currentDividedTransition[3]);
                                        S_acciones.push("push");
                                    } else {
                                        S_acciones.push("nothing")
                                    }
                                    if (current_transition instanceof Link) {
                                        temp = current_transition.nodeB;
                                    } else {

                                    }
                                    if (currentDividedTransition[1] == 'E')
                                        currentLetter--;
                                    salirFor = true;
                                    break;
                                } else {
                                    salirFor = true;
                                    termina = true;
                                    rechazo = true;
                                }
                            } else {
                                S_acciones.push("nothing");
                                nodePath.push(temp);
                                transitionPath.push(current_transition);
                                if (currentDividedTransition[3] != 'E') {
                                    this.stack.push(currentDividedTransition[3]);
                                    S_Alfabeto.push(currentDividedTransition[3]);
                                    S_acciones.push("push");
                                } else {
                                    S_acciones.push("nothing");
                                }
                                if (current_transition instanceof Link) {
                                    temp = current_transition.nodeB;
                                }
                                if (currentDividedTransition[1] == 'E')
                                    currentLetter--;
                                salirFor = true;
                                break;
                            }
                        }
                    }
                }
                if (salirFor)
                    break;
            }
            if (salirFor)
                break;
            recorridoTransiciones++;
            if (recorridoTransiciones == pathTransitions.length) {
                termina = true;
            }
        }
        if (termina)
            break;
    }
    if (!rechazo) {
        var hayTransicionE = true;
        while (hayTransicionE) {
            var salirFor = false;
            for (var i = 0; i < pathTransitions.length; i++) {
                var current_transition = pathTransitions[i];
                if (current_transition instanceof StartLink)
                    continue;
                var simbols = current_transition.text.split(';');
                for (var searchsimbol = 0; searchsimbol < simbols.length; searchsimbol++) {
                    var firstTransitionDivision;
                    if (current_transition instanceof Link)
                        firstTransitionDivision = [current_transition.nodeA.text, simbols[searchsimbol], current_transition.nodeB.text];
                    else
                        firstTransitionDivision = [current_transition.node.text, simbols[searchsimbol], current_transition.node.text];
                    var currentDividedTransition = this.dividirConecciones(firstTransitionDivision);
                    currentDividedTransition = currentDividedTransition[0];
                    if (currentDividedTransition[1] == 'E') {
                        if (!(current_transition instanceof StartLink)) {
                            var current_transitionNodeText;
                            if (current_transition instanceof SelfLink) {
                                current_transitionNodeText = current_transition.node.text;
                            } else {
                                current_transitionNodeText = current_transition.nodeA.text;
                            }
                            if (current_transitionNodeText == temp.text) {
                                if (currentDividedTransition[2] != 'E') {
                                    if (currentDividedTransition[2] == this.stack[this.stack.length - 1]) {
                                        nodePath.push(temp);
                                        transitionPath.push(current_transition);
                                        this.stack.pop();
                                        S_acciones.push("pop");
                                        if (currentDividedTransition[3] != 'E') {
                                            this.stack.push(currentDividedTransition[3]);
                                            S_Alfabeto.push(currentDividedTransition[3]);
                                            S_acciones.push("push");
                                        } else {
                                            S_acciones.push("nothing");
                                        }
                                        if (current_transition instanceof Link) {
                                            temp = current_transition.nodeB;
                                        }
                                        salirFor = true;
                                        break;
                                    }
                                } else {
                                    S_acciones.push("nothing");
                                    nodePath.push(temp);
                                    transitionPath.push(current_transition);
                                    if (currentDividedTransition[3] != 'E') {
                                        this.stack.push(currentDividedTransition[3]);
                                        S_acciones.push("push");
                                        S_Alfabeto.push(currentDividedTransition[3]);
                                    } else {
                                        S_acciones.push("nothing")
                                    }
                                    if (current_transition instanceof Link) {
                                        temp = current_transition.nodeB;
                                    }
                                    salirFor = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (salirFor)
                        break;
                }
                if (salirFor)
                    break;
                recorridoTransiciones++;
                if (recorridoTransiciones == pathTransitions.length) {
                    hayTransicionE = false;
                }
            }
        }
    }
    var count = 0;
    this.waitTime = this.waitTime + 410 * (S_acciones.length + 1) * S_acciones.length / 2;
    var nodeAmount = 0;
    var timeAmount = 0;
    var addAnimation = function(node, time, color, radiusSize) {
        setTimeout(function() {
            node.animate(color, radiusSize);
        }, 300 * time);
    };
    var addTextAnimation = function(index, time) {
        setTimeout(function() {
            $("#input_animation .processed").text(input.substr(0, index + 1));
            $("#input_animation .unprocessed").text(input.substr(index + 1, input.length))
        }, 310 * time);
    };
    var evaluate = function(input, path, time, index, that) {
        setTimeout(function() {
            that.evaluarCadena(input, path, index);
        }, time)
    }

    var addStackAction = function(action, i, isLast, that, index, isAccepted, time) {
        setTimeout(function() {
            if (action === "push") {
                var stackElement = document.createElement("td");
                stackElement.setAttribute("data-id", count);
                if ($("td[data-id='" + count + "']").length === 0) {
                    stackElement.textContent = S_Alfabeto[count];
                    count++;
                    $("#stack-row").append(stackElement);
                }

            } else {
                if (action === "pop") {
                    $("#stack-row").children()[$("#stack-row").children().length - 1].remove();
                }
            }
            if (isLast && !isAccepted) {
                if (that.posiblePaths.length > index + 1)
                    evaluate(input, that.posiblePaths[index + 1], 100, index + 1, that);
            }
        }, 310 * time);
    }
    var count = 0;
    var S_accionesCount = 0;
    var validAmount = 0;
    while (nodeAmount < nodePath.length) {
        addAnimation(nodePath[nodeAmount], timeAmount + 1, "yellow", 31);
        addAnimation(nodePath[nodeAmount], timeAmount + 3, "white", 30);
        addAnimation(transitionPath[nodeAmount], timeAmount + 5, "yellow");
        if (transitionPath[nodeAmount].text[0] !== "E") {
            addTextAnimation(validAmount, timeAmount + 6);
            validAmount++;
        }
        addAnimation(transitionPath[nodeAmount], timeAmount + 7, "white");
        addStackAction(S_acciones[S_accionesCount], S_accionesCount, S_accionesCount === S_acciones.length - 1, this, index, temp.isAcceptState, timeAmount + 5);
        addStackAction(S_acciones[S_accionesCount + 1], S_accionesCount + 1, S_accionesCount + 1 === S_acciones.length - 1, this, index, temp.isAcceptState, timeAmount + 7);
        S_accionesCount += 2;
        nodeAmount++;
        timeAmount += 9;
    }
    nodePath.push(temp);
    if (temp.isAcceptState) {
        $("#cambio").text ("La Cadena es aceptada.");
        document.getElementById("cambio").style.color = "green";
    } else {
        $("#cambio").text ("La Cadena es rechazada.");
    }
}

PDA.prototype.Tabla_Conecciones = function() {
    var transition_table = [];
    var startLink = this.getInicial();
    transition_table.push([
        ['A', 'input', 'pop', 'push', 'B']
    ]);
    var new_transition = null;
    var current_transition = null;
    for (var index = 0; index < this.conecciones.length; index++) {
        current_transition = this.conecciones[index];
        if (!(current_transition instanceof StartLink)) {
            if (current_transition instanceof Link)
                new_transition = this.getConecciones(current_transition.text, current_transition.nodeA.text, current_transition.nodeB.text);
            else if (current_transition instanceof SelfLink)
                new_transition = this.getConecciones(current_transition.text, current_transition.node.text, current_transition.node.text);

            if (new_transition.length > 1) {
                for (var indexnew = 0; indexnew < new_transition.length; indexnew++) {
                    var new_transitiondivide = this.dividirConecciones(new_transition[indexnew]);
                    transition_table.push(new_transitiondivide);
                }
            } else {
                var new_transitiondivide = this.dividirConecciones(new_transition[0]);
                transition_table.push(new_transitiondivide);
            }

        }
    }
    return transition_table;
};

PDA.prototype.dividirConecciones = function(transition) {
    var ret_val = [];
    var push = transition[1].split("->");
    var input_pop = push[0].split(",");
    ret_val.push([transition[0], input_pop[0], input_pop[1], push[1], transition[2]]);
    return ret_val;
};

PDA.prototype.getConecciones = function(conecciones_text, nodeA_text, nodeB_text) {
    var ret_val = [];
    var conecciones_symbols = conecciones_text.split(";"); //con punto y coma se separaran (1,1->1;0,0->0)
    for (var index = 0; index < conecciones_symbols.length; index++)
        ret_val.push([nodeA_text, conecciones_symbols[index], nodeB_text]);
    return ret_val;
};

PDA.prototype.getInicial = function() {
    for (var index = 0; index < this.conecciones.length; index++)
        if (this.conecciones[index] instanceof StartLink)
            return this.conecciones[index];

    return null;
};
