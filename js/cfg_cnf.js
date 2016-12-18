  var unitarias = [];
  var complemento = [] ;
  var mis_unitarias= ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
  //var complemento2 = complemento;

   Agregar_cfg = function(){
    var unita = document.getElementById("unita").value;
    var comple = document.getElementById("comple").value;
    if (unitarias.length === 0) {
      unitarias.push("So");
      unitarias.push(unita);
      complemento.push(unita);
      complemento.push(comple);
      document.getElementById("cfg_ta").value += "\n";
      document.getElementById("cfg_ta").value += unita;
      document.getElementById("cfg_ta").value += "--->";
      document.getElementById("cfg_ta").value += comple;
      document.getElementById("cfg_ta").value += "\n";
      document.getElementById("unita").value = " ";
      document.getElementById("comple").value = " ";
    }else{
      unitarias.push(unita);
      complemento.push(comple);
      document.getElementById("cfg_ta").value += unita;
      document.getElementById("cfg_ta").value += "--->";
      document.getElementById("cfg_ta").value += comple;
      document.getElementById("cfg_ta").value += "\n";
      document.getElementById("unita").value = " ";
      document.getElementById("comple").value = " ";
    }

  }

  Conventir_cnf = function(){
    eliminar_vacio();
    elim_E();
    eliminar_vacio();
    elim_U();
    eliminar_vacio();
    cfn_mul();
    eliminar_vacio();
    cfn_minusculas();
    complemento[0]=complemento[1];
    agregar_ta();

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
          var temp = "";
          var temp2 = "";
          var temp3 = "";
          for (var l = i-1; l > 0; l--) {
            var str_to_split = String(complemento[l]);// split de conjunto que esta antes
            var str_split = str_to_split.split("|");
            for (var j = 0; j < str_split.length; j++) {// for que controla los conjuntos
              temp2=str_split[j];
              temp = "";
              temp3 = "";
              var contador_unitarias = 0;
              for (var k = 0; k < temp2.length; k++) {//for que controla las letras
                if (temp2.charAt(k) === String(unitarias[i]).charAt(0)) {
                  contador_unitarias++;
                  if (contador_unitarias === 1) {
                    temp=temp2.replace(String(unitarias[i]).charAt(0),"e");
                    complemento[l]=complemento[l].concat("|"+temp);
                  } else {
                    temp3=temp.replace(String(unitarias[i]).charAt(0),"e");
                    complemento[l] = complemento[l].concat("|"+temp3);
                    temp3 = "";
                    for (var z = temp2.length; z > 0 ; z--) { // le doy vuelta para poder cambiar la ultima letra a combiar
                      temp3=temp3.concat(temp2[z-1]);
                    }
                    temp = temp3.replace(String(unitarias[i]).charAt(0),"e"); // aqui le quito el ultimo letra a cambiar
                    temp3 = "";
                    for (var z = temp.length; z > 0 ; z--) { // le doy vuelta para poder dejarlo como al principio
                      temp3=temp3.concat(temp[z-1]);
                    }
                    complemento[l] = complemento[l].concat("|"+temp3);
                  }
                }
              }
            }
          }
          break;
        }
      }
    }
  }

  eliminar_vacio = function  () {
    var str_comple;
    var str_sin_barra="";
    for (var i = 0; i < complemento.length; i++) {
      var size = complemento[i].length-1;
      if (String(complemento[i]).charAt(size) ==="|") {
        str_comple = String(complemento[i]);
        str_sin_barra = str_comple.slice(0,size);
        complemento[i] = str_sin_barra;

      }
    }


    var str_complemento;
    var str_sin_espacio;
    for (var i = 0; i < complemento.length; i++) {
      str_complemento= complemento[i]
      str_sin_espacio = str_complemento.replace(/ /g,"");
      complemento[i]= str_sin_espacio;

    }


    var str_unitaria2;
    var str_sin_espacio;
    for (var i = 0; i < unitarias.length; i++) {
      str_unitaria2= unitarias[i]
      str_sin_espacio = str_unitaria2.replace(/ /g,"");
      unitarias[i]= str_sin_espacio;

    }

  }


  elim_U = function(){

    for (var i = 1; i < unitarias.length; i++) {
      var cont_unit = String(complemento[i]);
      var cont_unit_split = cont_unit.split("|");
      var contador=-1;
      var remplazo="";
      for (var j = 0; j < cont_unit_split.length; j++) { // recorre el complemento
        if (cont_unit_split[j].length === 1 && cont_unit_split[j] === cont_unit_split[j].toUpperCase()) { //evalua si la letra es mayuscula
          if ( cont_unit_split[j] === String(unitarias[i]).charAt(0)   ) {
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
          var avanza=true;
          var nueva_unitaria="";
          while (avanza) {
            var random = Math.floor(Math.random() * mis_unitarias.length);
            nueva_unitaria=mis_unitarias[random];

            var contador=0;
            for (var w = 0; w < unitarias.length; w++) {
              if (nueva_unitaria != String(unitarias[w].charAt(0))) {
                contador++;
              }
            }
            if (contador === unitarias.length) {
              avanza=false;
            }
          }//valida que la nueva letra no haya sido utilizada

          antigua= cont_complet_split[k]; // como era el conjunto
          cambio =cont_complet_split[k].slice(1,3); // saco lo que agregare de complemento
          a_cambiar = str_comple.replace(cambio,nueva_unitaria); // es lo que me queda de complemento
          complemento[i]=a_cambiar;

          unitarias.push(nueva_unitaria);// agrego la unitarias
          complemento.push(cambio); // agrego lo nuevo acomplemento

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
    }
  }


  cfn_minusculas = function(){

    for (var i = 0; i < unitarias.length; i++) { //for que recorre las unitarias


      var str_complemento= complemento[i];

      var complemento_split = str_complemento.split("|");
      for (var k = 0; k < complemento_split.length; k++) { // for que recorre los conjuntos del complemento
        var letra_a_cambiar="";
        var cambio = "";
        var nueva_unitaria="";
        if (complemento_split[k].length == 2) { // valida que tenga 2
          if (complemento_split[k].charAt(0) === complemento_split[k].charAt(0).toLowerCase() || complemento_split[k].charAt(1) === complemento_split[k].charAt(1).toLowerCase()) { //verifica si 1 es minuscula
            if (complemento_split[k].charAt(0) === complemento_split[k].charAt(0).toLowerCase()) { // devuelve la letra minuscula
              letra_a_cambiar = complemento_split[k].charAt(0);
            } else{
              letra_a_cambiar = complemento_split[k].charAt(1);
            }

            // metodo para dar la nueva unitaria y las agrega al arreglo
              var avanza = true;
              while (avanza) {
                var random = Math.floor(Math.random() * mis_unitarias.length);
                nueva_unitaria=mis_unitarias[random];

                var contador=0;
                for (var w = 0; w < unitarias.length; w++) {
                  if (nueva_unitaria != String(unitarias[w].charAt(0))) {
                    contador++;
                  }
                }
                if (contador === unitarias.length) {
                  avanza=false;
                }
              }


            cambio = str_complemento.replace(letra_a_cambiar,nueva_unitaria); // es lo que me queda de complemento
            complemento[i]=cambio;
            unitarias.push(nueva_unitaria);// agrego la unitarias
            complemento.push(letra_a_cambiar);

            for (var j = i+1; j < unitarias.length; j++) { // for que debe recorrer para encontrar las unitarias
              var str_complemento3 = complemento[j];
              var complemento_split3 = str_complemento3.split("|");
              for (var l = 0; l < complemento_split3.length; l++) { // recorre los conjuntos

                if (String(unitarias[j]).charAt(0)!= nueva_unitaria && complemento_split3[l].length === 2 ) {
                  if (complemento_split3[l].includes(letra_a_cambiar) ) {
                    cambio = str_complemento3.replace(letra_a_cambiar,nueva_unitaria);
                    complemento[j]=cambio;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  agregar_ta = function() {
    for (var i = 0; i < unitarias.length; i++) {
      document.getElementById("cnf_ta").value += unitarias[i];
      document.getElementById("cnf_ta").value += "--->";
      document.getElementById("cnf_ta").value += complemento[i];
      document.getElementById("cnf_ta").value += "\n";
    }
  }
