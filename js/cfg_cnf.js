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
  eliminar_vacio();
  elim_U();
  console.log("termino");

}

elim_E = function (){

  for (var i = unitarias.length-1; i > 0; i--) {
    var str_epsilon = String(complemento[i]);//convierto el complemento en cadena
    var n=false  ;
    for (var d = 0; d < str_epsilon.length; d++) { //verifica si esta la e en el complemento
      if (str_epsilon.charAt(d)=="e") {
        var str_sin_epsilon = str_epsilon.replace(/e/g,""); // al encontrar e la cambio por espacio vacio
        complemento[i] = str_sin_epsilon;//aqui lo mete al arreglo
        n=true;
      }
      if (n) {
        var temp="";
        var temp2="";
        for (var l = i-1; l > 0; l--) {
          var str_to_split = String(complemento[l]);// split de conjunto que esta antes
          var str_split = str_to_split.split("|");
            //solo falta validar cuando es de 3
          //  console.log(complemento[l]+ " antes del proceso ");
          for (var j = 0; j < str_split.length; j++) {// for que controla los conjuntos
            temp2=str_split[j];
            for (var k = 0; k < temp2.length; k++) {//for que controla las letras
              if (temp2.charAt(k) === String(unitarias[i]).charAt(0)) {
                //  console.log(temp + " temp");
                temp=temp2.replace(String(unitarias[i]).charAt(0),"e");
                complemento[l]=complemento[l].concat("|"+temp);
              }
            }
          }

          //console.log(complemento[l]+ " despues del proceso ");
        }
        break;
      }

    }

      console.log(unitarias);
      console.log(complemento);

  }
  }

eliminar_vacio = function  () {

  var str_complemento;
  var str_sin_espacio;
  for (var i = 0; i < complemento.length; i++) {
    str_complemento= complemento[i]
    str_sin_espacio = str_complemento.replace(/ /g,"");
    complemento[i]= str_sin_espacio;

  }

  console.log(complemento);
}


elim_U = function(){

  for (var i = 1; i < unitarias.length; i++) {
    var cont_unit = String(complemento[i]);
    var cont_unit_split = cont_unit.split("|");
    //console.log(cont_unit_split + " yo soy la str split ");
    var contador=-1;
    var remplazo="";
    for (var j = 0; j < cont_unit_split.length; j++) { // recorre el complemento
      if (cont_unit_split[j].length === 1 && cont_unit_split[j] === cont_unit_split[j].toUpperCase()) { //evalua si la letra es mayuscula
        if ( cont_unit_split[j] === String(unitarias[i]).charAt(0)   ) {
            console.log("letra igual");
            contador++;
        } else {
          for (var k = 1; k < unitarias.length; k++) { //for para recorrer el arreglo de unitarias para encontrar la misma
            if (cont_unit_split[j] === String(unitarias[k]).charAt(0) ) {
              complemento[i]=complemento[i].concat("|"+complemento[k]); // donde concatena lo que tiene uno del otro
              remplazo=remplazo.concat(complemento[k]+"|");
              contador++;
            }
          }
        }
      }else{
        if (contador != j) {
          contador++;
          remplazo=remplazo.concat(cont_unit_split[j] +"|");
        }
      }

    }
complemento[i]=remplazo;
  }

  complemento[0]=complemento[1]; // al s0 le mete el primero


  console.log(unitarias);
  console.log(complemento);

}
