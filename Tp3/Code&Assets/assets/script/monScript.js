
      function fetch(){
        let request=new XMLHttpRequest;
            const url="data/products.json";
            request.onreadystatechange=function(){
              if(this.readyState==4&&this.status==200){
               const array=JSON.parse(this.responseText);//array avec tous les produits. Il est constant.
                let categorie= $("#product-categories .selected").html();//quelle catégorie qui est sélectionné
                let classe= $("#product-criteria .selected").html();//classement sélectionné
                let current; //array qui contient les produits affichés
                redCircle();//s'occupe de mettre à jour le cercle rouge sur le header
                set(array,classe,categorie, current);//contient les fonctions qui update les produits à afficher
                $("button").click(function(){
                    $(this).siblings(" .selected").removeClass('selected');
                    $(this).addClass('selected');//change les classes au click
                    set(array,classe,categorie,current);//update Current pour l'afficher
                })
                setProduct(array);//fonction qui s'occupe de l'affichage de la page Produit.
                redCircle();
              }
            }
            request.open("GET",url,true);
            request.send();
      }

      $(document).ready(function(){
        fetch();//appelle fetch (la fonction en haut qui contient les actions à faire)
      })
      
      function set(array, classe, categorie, current){
        classe= $("#product-criteria .selected").html();
        categorie= $("#product-categories .selected").html();
        //met à jour classe et catégorie pour voir lequel est sélectionné
        current=changer(categorie, array, current);
        current=trier(classe, array, current);
        //changer et trier vont update la liste Current selon ce qui est sélectionné
        //si seulement le classement est changé, la liste current qui passe par la fonction changer va retourner la même chose
        //si seulement la catégorie est changée, Current est re-remplis complètement et retrié selon ce qui était choisi avant
        prepare(array, current);//affiche les produits
        //en fait, Current est une liste de ID qui doivent être affichés. Il va chercher l'index de l'id dans la liste de produits array
        //et accéder aux informations du produits avec l'index (ce qui semble un peu compliqué, mais c'est mieux que de modifier
        //la liste originale pour éviter les bugs).
      }
        
      function prepare(array, current){
        //crée un texte qui est inséré dans le div Products-list dans products.html
        let text="";
        $('#products-list').html("")
        $("#products-count").html(current.length+" produits");//le nombre de produits correspond à la longueur de Current
        for (let index=0; index<current.length; index++ ){//passe par tous les éléments de Current
          let i=array.findIndex(search=>search.id==current[index])//cherche l'index de l'id dans Current
          //avec cet index, on peut accéder aux informations du produits avec l'array.
          text+="<div class=\"product\"> <a href=\"./product.html?id="+array[i].id+"\" title=\"En savoir plus...\"> <h2>"+array[i].name+"</h2> <img alt=\""+array[i].name+
    "\" src=\"./assets/img/"+array[i].image+"\"> <p class=\"price\"><small>Prix: </small>"+array[i].price+"&thinsp;$</p> </a> </div>"
    $('#products-list').append(text)//ajoute le texte au div, puis reset text.
    text="";
        }}

      function changer(categorie, array){
        let current=[];//la catégorie change le contenu affiché donc Current est reset.
        switch (categorie){
          case 'Consoles':
          for (let index=0; index<array.length; index++ ){
            if(array[index].category=='consoles'){//ici par exemple, seulement les id avec la catégorie console seront mis dans current.
              current.push(array[index].id);
            }}
            break;
          case 'Appareils photo':
          for (let index=0; index<array.length; index++ ){
            if(array[index].category=='cameras'){
              current.push(array[index].id);
            }}
            break;
            case 'Écrans':
            for (let index=0; index<array.length; index++ ){
            if(array[index].category=='screens'){
              current.push(array[index].id);
            }}
              break;
              case 'Ordinateurs':
              for (let index=0; index<array.length; index++ ){
            if(array[index].category=='computers'){
              current.push(array[index].id);
            }}
                break;
                default:
                //le default est Tous les Produits.
            for (let index=0; index<array.length; index++ ){
              current.push(array[index].id);}
          }
          return current;
        }

          function trier (classe, array, current){
            switch(classe){
    
            case 'Prix (haut-bas)'://tri par sélection. Littéralemment.
            let max;
            for(let index=0; index<current.length-1; index++ ){
              max=index;
              for(let indice=index+1; indice<current.length; indice++ ){
                let i=array.findIndex(search=>search.id==current[max])
                let j=array.findIndex(search=>search.id==current[indice])
                if(array[j].price>array[i].price){
                  max=indice;
                }
              }
              let temp=current[max];
              current[max]=current[index];
              current[index]=temp;
            }break;
            case 'Nom (A-Z)':
            let letterMin;
            for(let index=0; index<current.length-1; index++ ){
              letterMin=index;
              for(let indice=index+1; indice<current.length; indice++ ){
                let i=array.findIndex(search=>search.id==current[letterMin])
                let j=array.findIndex(search=>search.id==current[indice])
                //à cause du iMax, simplement comparer les lettres ne va pas marcher.
                let ascii=array[i].name.charCodeAt(0);
                let asciiMin=array[j].name.charCodeAt(0);
                if(ascii>91){//il faut donc vérifier à chaque fois
                  if(asciiMin<ascii-32){//et soustraire de 32 pour rendre la lettre i en upperCase.
                      letterMin=indice;
                  }
                }else if(asciiMin>91){
                  if(asciiMin-32<ascii){
                      letterMin=indice;
                  }
                }else if(asciiMin<ascii){
                  letterMin=indice;
                }else if(array[j].name.charAt(0)==array[i].name.charAt(0)){
                    //si les produits commencent par la même lettre, il continue de comparer jusqu'à ce qu'une lettre est différente
                  let char=1;
                  while (array[j].name.charAt(char)==array[i].name.charAt(char)){
                    char++;
                  }
                  if(array[j].name.charAt(char)<array[i].name.charAt(char))
                  letterMin=indice;
                }
              }
              let temp=current[letterMin];
              current[letterMin]=current[index];
              current[index]=temp;
            }
              break;
              case 'Nom (Z-A)':
              let letterMax;
            for(let index=0; index<current.length-1; index++ ){
              letterMax=index;
              for(let indice=index+1; indice<current.length; indice++ ){
                let i=array.findIndex(search=>search.id==current[letterMax])
                let j=array.findIndex(search=>search.id==current[indice])
                let ascii=array[i].name.charCodeAt(0);
                let asciiMin=array[j].name.charCodeAt(0);
                if(ascii>91){
                    if(asciiMin>ascii-32){
                        letterMax=indice;
                    }
                }else if(asciiMin>91){
                    if(asciiMin-32>ascii){
                        letterMax=indice;
                    }
                }else if(asciiMin>ascii){
                    letterMax=indice;
                }else if(array[j].name.charAt(0)==array[i].name.charAt(0)){
                  let char=1;
                  while (array[j].name.charAt(char)==array[i].name.charAt(char)){
                    char++;
                  }
                  if(array[j].name.charAt(char)>array[i].name.charAt(char))
                  letterMax=indice;
                }
              }
              let temp=current[letterMax];
              current[letterMax]=current[index];
              current[index]=temp;
            }
                break;
    
                default:
            let min;
            for(let index=0; index<current.length-1; index++ ){
              min=index;
              for(let indice=index+1; indice<current.length; indice++ ){
                let i=array.findIndex(search=>search.id==current[min])
                let j=array.findIndex(search=>search.id==current[indice])
                if(array[j].price<array[i].price){
                  min=indice;
                }
              }
              let temp=current[min];
              current[min]=current[index];
              current[index]=temp;
            }
            }
            return current;
          }

      function setProduct(obj){
        $("#dialog").hide();
        $.urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        }
        let numID=$.urlParam('id'); 
        if(numID<1||numID>13&&$(document).attr('title')=="OnlineShop - Produit"){
            $("main").html("<h1> Page non trouvée! </h1>");
        }
        let index=obj.findIndex(search=>search.id==numID)
        $("#descriptions").html(obj[index].description);
        $("#product-image").attr("src", "./assets/img/"+obj[index].image);
        $("#product-image").attr("alt",obj[index].name );
        $("#nom").html(obj[index].name)
        $("#price").html("Prix: <strong>"+obj[index].price+"&thinsp;$</strong>");
        $("#caracteristiques").html("")
        let arrayList=(obj[index].features);
        let liste="";
        for(let index=0; index<arrayList.length; index++){
            liste+=" <li>"+arrayList[index]+"</li>"
            $("#caracteristiques").append(liste);
            liste="";
        }
        $("button.btn").click(function(){
          
            let valeur=$("#product-quantity").val();
            valeur=parseInt(valeur);
            let produitsTotal=sessionStorage.getItem("produits");
            produitsTotal=parseInt(produitsTotal);
            let total=produitsTotal+valeur;
            sessionStorage.setItem("produits",total);//met à jour le nombre de produits dans le panier au total
            console.log(sessionStorage.getItem("produits"));
            if(sessionStorage.getItem(obj[index].id)==null||sessionStorage.getItem(obj[index].id)==0){
              sessionStorage.setItem(String(obj[index].id),valeur);
            }else{
              produitsTotal=sessionStorage.getItem(String(obj[index].id));
              produitsTotal=parseInt(produitsTotal);
              total=produitsTotal+valeur;
              sessionStorage.setItem(String(obj[index].id),total);
              console.log(sessionStorage.getItem(String(obj[index].id)))
            }
            box();
            redCircle();
        })
      }

      function box(){
        //la boîte de dialogue qui disparaît après 5 secondes
        $("#dialog").toggle();
        $("#dialog").fadeOut(5000);
      }

      function redCircle(){
        if(sessionStorage.getItem("produits")===null){
          sessionStorage.setItem("produits",0);
        }
        let produitsMis=sessionStorage.getItem("produits");
        produitsMis=parseInt(produitsMis);
    if(produitsMis===0){
      console.log(sessionStorage.getItem("produits"))
      $("span.count").remove();
    }else{
      $('#anchor').html(" <span class=\"count\"></span>");
      $('.count').html(produitsMis);
    }
      }