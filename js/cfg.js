var rules = [];


function addRules(unitario,complemento){
  if(complemento.value.includes("|")){
    var complemento_individual = complemento.value.split("|");
    for (var i = 0; i < complemento_individual.length; i++) {
      if(verifyExistance(unitario.value,complemento_individual[i])){
        return;
      }
      addRule(unitario.value,complemento_individual[i])
      fill_text_area();
    }
  }else{
    if(verifyExistance(unitario.value,complemento.value)){
      return;
    }
    addRule(unitario.value,complemento.value);
    fill_text_area();
  }

  
}

function fill_text_area(){
  document.getElementById("cfg_ta").value = "";
  for (var i in rules) {
    if(rules.hasOwnProperty(i)){
      document.getElementById("cfg_ta").value += "\n";
      document.getElementById("cfg_ta").value += i;
      document.getElementById("cfg_ta").value += "--->";
      var element = rules[i];
      var contador = 0;
      for (var j in element) {
        if(element.hasOwnProperty(j) && contador > 0){
          document.getElementById("cfg_ta").value += "|";  
          document.getElementById("cfg_ta").value += element[j];
        }else if(element.hasOwnProperty(j) && contador === 0){
          document.getElementById("cfg_ta").value += element[j];
          contador++;
        }
      };
    }
  };
}

function verifyExistance(unitario,complemento){
  for (var i in rules) {
    if(rules.hasOwnProperty(i)){
      var element = rules[i];
      for (var j in element) {
        if(i != unitario){
          break;
        }
        if(element.hasOwnProperty(j)){
          if(element[j] === complemento){
            alert("El elemento: " + element[j] +" ya existe dentro de esta regla.")
            return true;
          }
        }
      }
    }
  };
  return false;
}

function addRule(unitario, complemento) {
  if (rules.hasOwnProperty(unitario)) {
    rules[unitario].push(complemento);
  } else {
    rules[unitario] = [complemento];
  }
  console.log(rules)
}


function generate() {
  console.log(rule)
}