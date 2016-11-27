var unitarias = [];
var complemento = [] ;
//var complemento2 = complemento;

 Agregar_cfg = function(){
  var unita = document.getElementById("unita").value;
  var comple = document.getElementById("comple").value;
  if (unitarias.length === 0) {
    unitarias.push("So");
    unitarias.push(unita);
    complemento.push(unita);
    complemento.push(comple);
    document.getElementById("unita").value = " ";
    document.getElementById("comple").value = " ";
  }else{
    unitarias.push(unita);
    complemento.push(comple);
    //console.log(complemento);
    //console.log(unitarias);
    document.getElementById("unita").value = " ";
    document.getElementById("comple").value = " ";
  }

}

Conventir_cnf = function(){
  //console.log("entre al metodo ");
  elim_E();

}


elim_E = function (){

  for (var i = unitarias.length-1; i > 0; i--) {
    // console.log(String(unitarias[i])+ "unitarias en strig");
     //console.log(String(unitarias[i]).charAt(1)+ "unitarias en char");

    //console.log(unit + " es unita");
    var str_epsilon = String(complemento[i]);//convierto el complemento en cadena
    var n=false  ;
   for (var d = 0; d < str_epsilon.length; d++) { //verifica si esta la e en el complemento

      if (str_epsilon.charAt(d)=="e") {
      var str_sin_epsilon = str_epsilon.replace(/e/g," "); // al encontrar e la cambio por espacio vacio
      complemento[i] = str_sin_epsilon;//aqui lo mete al arreglo
      n=true;
      }
      if (n) {
      var temp="";
      var temp2="";
      for (var l = i-1; l > 0; l--) {
        //console.log("entre al pinchge for 1 " + l );
          var str_to_split = String(complemento[l]);// split de conjunto que esta antes
          var str_split = str_to_split.split("|");

          //solo falta validar cuando es de 3
          for (var j = 0; j < str_split.length; j++) {// for que controla los conjuntos
            temp2=str_split[j];
          for (var k = 0; k < temp2.length; k++) {//for que controla las letras
              if (temp2.charAt(k) === String(unitarias[i]).charAt(1)) {
                temp=temp2.replace(String(unitarias[i]).charAt(1),"e");
                complemento[l]=complemento[l].concat("|"+temp);
              }
            }
          }


        }
      }
      }

    console.log(unitarias);
    console.log(complemento);

  }

}

elim_U = function(){
  for (var i = 0; i < unitarios.length; i++) {
    var cont_unit = String(complemento[i]);
    var cont_unit_split = cont_unit.split("|");
    for (var j = 0; j < cont_unit_split.length; j++) {
      if (cont_unit_split[j].length === 1 && cont_unit_split[j] === cont_unit_split[j].toUpperCase()) { //evalua si la letra es mayuscula

      }
    }
  }
}
