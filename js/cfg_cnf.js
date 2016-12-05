var unitarias = [];
var complemento = [] ;
var mis_unitarias= ["A","B","C","D","E","F","G","H","I","J","K","L,","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
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
  eliminar_vacio();
  cfn_mul();
  console.log(unitarias);
  console.log(complemento);
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
  var str_comple;
  var str_sin_barra;
  for (var i = 0; i < complemento.length; i++) {
    str_comple= complemento[i]
    str_sin_barra = str_comple.replace(/||/g,"");
    complemento[i]= str_sin_barra;
    console.log("entro");
  }


  var str_complemento;
  var str_sin_espacio;
  for (var i = 0; i < complemento.length; i++) {
    str_complemento= complemento[i]
    str_sin_espacio = str_complemento.replace(/ /g,"");
    complemento[i]= str_sin_espacio;

  }

  console.log(complemento);
  console.log("salio de limpiar");
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

cfn_mul =function(){

  for (var i = 0; i < unitarias.length; i++) { //for que recorre las unitarias
    var a_cambiar="";
    var a_cambiar2="";

    var cambio="";

    var antigua="";

    var nueva_unitaria="";

    var str_comple= complemento[i];

    var cont_complet_split = str_comple.split("|");
    for (var k = 0; k < cont_complet_split.length; k++) { // for que recorre los conjuntos del complemento
      if (cont_complet_split[k].length >= 3) { // valida que tenga 3 o mas
        console.log(cont_complet_split[k])
        var avanza=true;
        var nueva_unitaria="";
        while (avanza) {
          var random = Math.floor(Math.random() * mis_unitarias.length);
          //console.log(random);
          //console.log(mis_unitarias);
          nueva_unitaria=mis_unitarias[random];

          var contador=0;
          for (var w = 0; w < unitarias.length; w++) {
            if (nueva_unitaria != String(unitarias[w].charAt[0])) {
              contador++;
            }
          }
          if (contador=== unitarias.length) {
            avanza=false;
          }
        }//valida que la nueva letra no haya sido utilizada

        console.log(nueva_unitaria);
        antigua= cont_complet_split[k]; // como era el conjunto
        cambio =cont_complet_split[k].slice(0,2); // saco lo que agregare de complemento
        a_cambiar = str_comple.replace(cambio,nueva_unitaria); // es lo que me queda de complemento
        complemento[i]=a_cambiar;
        //console.log(complemento[i]+ " el complemento como quedo con i=  " +i);

        unitarias.push(nueva_unitaria);// agrego la unitarias
        complemento.push(cambio); // agrego lo nuevo acomplemento
      //  console.log("entro al if y agrego nuevo")

        for (var j = i; j < unitarias.length-1; j++) { // for que debe recorrer para encontrar las unitarias
          var str_comple2= complemento[j];
          var cont_complet_split2 = str_comple2.split("|");
          for (var m = 0; m < cont_complet_split2.length; m++) { // recorre los conjuntos
            if (cont_complet_split2[m].includes(cambio) ) {
              a_cambiar2 = str_comple2.replace(cambio,nueva_unitaria);
              complemento[j]=a_cambiar2;
            }
          }

        }

      }
    }
    console.log("termino el ciclo")
  }
}
