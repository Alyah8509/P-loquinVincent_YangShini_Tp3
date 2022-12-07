
      
      
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
                shoppingCart(array);
                $("#payer").click(commander);
                produirePageConfirmation();
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

      function setProduct(array){//prépare la page Product
        var titre=$(document).attr('title');
        var match="OnlineShop - Produit";//s'assure que la page active est Product.html (pour éviter les erreurs d'url)
        if(titre==match){
          $("#dialog").hide();
        $.urlParam = function(name){
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        }
        let numID=$.urlParam('id'); //garde l'id de l'url
        if(numID<1||numID>13&&$(document).attr('title')=="OnlineShop - Produit"){
            $("main").html("<h1> Page non trouvée! </h1>");//si l'id n'existe pas
        }
        let index=array.findIndex(search=>search.id==numID)
        $("#descriptions").html(array[index].description);
        $("#product-image").attr("src", "./assets/img/"+array[index].image);
        $("#product-image").attr("alt",array[index].name );
        $("#nom").html(array[index].name)
        $("#price").html("Prix: <strong>"+array[index].price+"&thinsp;$</strong>");
        $("#caracteristiques").html("")
        let arrayList=(array[index].features);
        let liste="";
        for(let index=0; index<arrayList.length; index++){
            liste+=" <li>"+arrayList[index]+"</li>"
            $("#caracteristiques").append(liste);
            liste="";
        }//met en place les descriptions et caractéristiques du produit
        $("button.btn").click(function(){
          
            let valeur=$("#product-quantity").val();//le nombre de produits ajouté
            valeur=parseInt(valeur);//tout passe par ParseInt pour éviter des bugs
            let produitsTotal=sessionStorage.getItem("produits");//le nombre de produits total
            produitsTotal=parseInt(produitsTotal);
            let total=produitsTotal+valeur;
            sessionStorage.setItem("produits",total);//met à jour le nombre de produits dans le panier au total
            if(sessionStorage.getItem(array[index].id)==null||sessionStorage.getItem(array[index].id)==0){
              sessionStorage.setItem(String(array[index].id),valeur);//si ce produit spécifique n'est pas dans le panier, l'ajouter
            }else{
              produitsTotal=sessionStorage.getItem(String(array[index].id));
              produitsTotal=parseInt(produitsTotal);
              total=produitsTotal+valeur;
              sessionStorage.setItem(String(array[index].id),total);
              //si le produit est déjà dans le panier, faire une addition pour la quantité de ce produit dans le panier
            }
            redCircle();
            box();//met à jour le cercle rouge et la boîte de dialogue
        })
        }
        
      }

      function box(){
        //la boîte de dialogue qui disparaît après 5 secondes
        $("#dialog").toggle();
        $("#dialog").fadeOut(5000);
      }

      function redCircle(){
        if(sessionStorage.getItem("produits")===null){
          sessionStorage.setItem("produits",0);//pour le début
        }
        let produitsMis=sessionStorage.getItem("produits");
        produitsMis=parseInt(produitsMis);
    if(produitsMis===0){//si il n'y a rien dans le panier, le cercle disparaît
      console.log(sessionStorage.getItem("produits"))
      $("span.count").hide();
    }else{
      $("span.count").show();
      $('.count').html(produitsMis);//sinon, de setProduct le nombre de produits total est toujours gardé, alors il suffit de l'afficher.
    }
      }



// Section shopping-cart

      
        // La fonction shoppingCart s'occupe du traitement des clics
        // et de l'affichage dans la page html shopping-cart en fonction
        // du contenu de la commande de l'utilisateur.
        function shoppingCart(array){
        console.log(sessionStorage.getItem("produits"));

        // Modifier l'affichage du panier si aucun produit n'a été ajouté.
        if(!(sessionStorage.getItem("produits")>=1)){
          cartIsEmpty();
        }

        // Modifier l'affichage du panier si il contient des produits.
        else{
          $(".empty-message").hide();
          produceRows(array);
        }
        // Traite le clic des boutons dans le panier.
        traitementBoutons(array);
        // Mise a jour du prix Total dans le panier.
        prixTot(array);
      }

      
      // Fonction qui traite le clic des boutons du panier.
      function traitementBoutons(array){
        boutonSupprimer(array);
        boutonAjouter(array);
        boutonRetirer(array);
        $(".empty").click(viderPanier);
      }


      // Fonction qui produit les rangées du tableau dans le panier d'achat
      // en fonction des items qui s'y trouvent.
      function produceRows(array){
        for (let index=0; index<13; index++){
          let id=String(array[index].id)
          if(sessionStorage.getItem(id) > 0){
          let productName=array[index].name;
          let productQuantity=String(sessionStorage.getItem(id));
          let prixUnitaire=String(array[index].price)+" $";
          let quantity=parseInt(sessionStorage.getItem(id))
          let prixTotal=String(Math.round(100*parseInt(quantity)*array[index].price)/100)+" $";
            // La fonction indroduit du code HTML différent pour chaque item dans le panier
            // pour faciliter le traitement de boutons spécifiques aux différents items.
          $(".cart-body").append(`
          <tr class="cart-row ${id}">
          <td><button title="Supprimer" class="bouton-supprimer ${id}"><i class="fa fa-times ${id}"></i></button></td>
          <td><a href="./product.html?id=${id}" class="info-produit">${productName}</a></td>
          <td>${prixUnitaire}</td>
          <td>
            <div class="row">
              <div class="col-retirer ${id}">
                <button title="Retirer" class="bouton-retirer ${id}"><i class="fa fa-minus ${id}"></i></button>
              </div>
              <div class="col quant ${id}">${productQuantity}</div>
              <div class="col">
                <button title="Ajouter" class="bouton-ajouter ${id}"><i class="fa fa-plus ${id}"></i></button>
              </div>
            </div>
          </td>
          <td class="prix-total ${id}">${prixTotal}</td>
          </tr>`);

          verifierBoutonDesactive();
        }}
      }

      // Fonction qui modifie l'affichage du panier lorsque celui-ci est vide.
      // Retire le tableau et ajoute un message spécifique au panier vide.
      function cartIsEmpty(){
        $(".shopping-cart-table, #shoppint-cart-footer").hide();
        $(".empty-message").show();
      }
      
      // Fonction qui désactive le bouton qui sert à retirer un item dans le panier
      // si jamais la quantité de cet item est égale à 1.
      function verifierBoutonDesactive(){
        for (let id=1; id<14; id++){
          quantiteProduit=sessionStorage.getItem(String(id));
          if (quantiteProduit==1){
            $(".col-retirer."+String(id)).html(`<button title="Retirer" disabled="" ><i class="fa fa-minus ${id}"></i></button>`);
          }
          else if (quantiteProduit>=2){
            $(".col-retirer "+String(id)).html(`<button title="Retirer" class="bouton-retirer ${id}"><i class="fa fa-minus ${id}"></i></button>`);
          }
        }
      }

      // Fonction qui permet de retirer un item du panier si on clique sur le
      // bouton "-".
      function boutonRetirer(array){
        let boutons=$(".bouton-retirer");
        boutons.click(function(event){
          let cl=event.target.className;
          for (let id=1; id<14; id++){
            if (cl==="fa fa-minus "+String(id) || cl==="bouton-retirer "+String(id)){
              let nbrProduitsTot=parseInt(sessionStorage.getItem("produits"));
              sessionStorage.setItem("produits",nbrProduitsTot-1);
              let specificProductAmount=parseInt(sessionStorage.getItem(String(id)));
              sessionStorage.setItem(String(id), specificProductAmount-1);
              // Enlève les rangées du tableau pour les actualiser aux bonnes valeurs.
              $(".cart-row").remove();
              // Met à jour l'icone rouge de l'entête.
              redCircle();
              produceRows(array);
              // Actualise le prix total.
              prixTot(array);
              // Le programme est prêt à traiter le prochain clic.
              traitementBoutons(array);
            }
          }
        })
      }

      // Fonction qui permet d'ajouter un item au panier si on clique sur le
      // bouton "+". Fonctionnement similaire à la fonction boutonRetirer
      function boutonAjouter(array){
        let boutons=$(".bouton-ajouter");
        boutons.click(function(event){
          let cl=event.target.className;
          for (let id=1; id<14; id++){
            if (cl==="fa fa-plus "+String(id) || cl==="bouton-ajouter "+String(id)){
              let nbrProduitsTot=parseInt(sessionStorage.getItem("produits"));
              sessionStorage.setItem("produits",nbrProduitsTot+1);
              let specificProductAmount=parseInt(sessionStorage.getItem(String(id)));
              sessionStorage.setItem(String(id), specificProductAmount+1);
              $(".cart-row").remove();
              redCircle();
              produceRows(array);
              prixTot(array);
              traitementBoutons(array);
            }
          }
        })
      }


      // Fibctuib qui permet de supprimer un produit du panier si on clique surà
      // le bouton "x".
      function boutonSupprimer(array){
        let boutons=$(".bouton-supprimer");
        boutons.click(function(event){
          let bool=confirm("Voulez-vous supprimer le produit du panier ?");
          if (bool){
          let cl=event.target.className;
          for (let id=1; id<14; id++){
            if (cl==="fa fa-times "+String(id) || cl==="bouton-supprimer "+String(id)){
              $("tr."+String(id)).remove();
              let nbrProduitsTot=sessionStorage.getItem("produits");
              let nbrProduits=sessionStorage.getItem(String(id));
              // Soustrait la quantité de ce produit qu'il y avait dans le panier
              // à la quantité totale de produits.
              sessionStorage.setItem("produits",nbrProduitsTot-nbrProduits);
              // Remet le compte précis pour cet item à 0.
              sessionStorage.setItem(String(id),0);
              redCircle();
              prixTot(array);
              if(!(sessionStorage.getItem("produits")>=1)){
                cartIsEmpty();
              }
            }
          }
        }
        })
      }

      // Fonction qui calcule et met à jour l'affichage du prix total en fonction
      // de la quantité des différents items et de leurs prix respectifs.
      function prixTot(array){
        sessionStorage.setItem("prixTotal", 0);
        for (let index=1; index<14; index++){
          if(sessionStorage.getItem(String(index))>0){
          let prixTotalItems=parseInt(sessionStorage.getItem("prixTotal"));
          let id=array.findIndex(search=>search.id==index);
          let amount=parseInt(sessionStorage.getItem(String(index)));
          prixTotalItems=prixTotalItems+array[id].price*amount;
          sessionStorage.setItem("prixTotal", prixTotalItems);
        }}
        let prixTotallementTotal=Math.round(100*sessionStorage.getItem("prixTotal"))/100;
        $(".shopping-cart-total").html(`Total: <strong>${prixTotallementTotal}&thinsp;$</strong>`);
      }

      // Fonction qui permet de vider le panier de tous ses items.
      function viderPanier(){
        let bool=confirm("Voulez-vous vider le panier?")
        if (bool){
        sessionStorage.setItem("produits",0);
        for (let index=1; index<14; index++){
          sessionStorage.setItem(String(index),0);
        }
        // Remet à jour l'icône de l'entête.
        redCircle();
        // Relance la fonction shoppingCart pour modifier l'affichage
        // du panier.
        shoppingCart()
        }
      }

      // Section Validation du formulaire de commande
      function commander(){
        // Méthode de validation spéciale pour la date d'expiration dans le format "MM/JJ"
        jQuery.validator.addMethod(
          "dateExpiration", function(value, element){
          return this.optional(element) || /^(0[1-9]|1[0-2])\/+([0-9]{4}|[0-9]{2})$/.test(value);
        }, "Entrez une date d'expiration valide."); 
  

        
          // Différentes petites règles ajoutées pour améliorer la validation du formulaire de commande.
          $("#formulaireCommande").validate({
            rules:{
              phone:{
                required: true,
                phoneUS: true
              },
              "credit-card":{
                creditcard: true
              },
              expiration:{
                required: true,
                dateExpiration: true
            }
            }
          });
          
          // Si le formulaire est validé, on passe la commande et on active la fonction passerCommande.
          let form = $("#formulaireCommande");
          if (form[0].checkValidity()){
            sessionStorage.setItem("nomCommande", $("#first-name").val()+" "+$("#last-name").val());
            passerCommande();
          }
  
      }
  
          // La fonction passerCommande permet de modifier les données qui serviront pour l'affichage de la 
          // page de confirmation en fonction du nom de l'utilisateur qui passe la commande et du numéro 
          // de la commande qui augmente d'une commande à l'autre.
          function passerCommande(){
            if (!(parseInt(sessionStorage.getItem("numeroCommande"))>0)){
              sessionStorage.setItem("numeroCommande", 1);
            }
            else{
              numeroCommande=parseInt(sessionStorage.getItem("numeroCommande"));
              sessionStorage.setItem("numeroCommande",numeroCommande+1);
            }
            sessionStorage.setItem("produits",0);
            for (let index=1; index<14; index++){
              sessionStorage.setItem(String(index),0);
           }
            // Remet à jour l'icône de l'entête.
            redCircle();
          }

          // La fonction produirePageConfirmation s'assure que l'affichage de la page de confirmation
          // contient le nom de la personne qui a effectué la commande ainsi que so numéro de commande.
          function produirePageConfirmation(){
            let nomCommande=sessionStorage.getItem("nomCommande");
            $("#name").html(`Votre commande est confirmée ${nomCommande}!`);
            let numeroCommande=String(sessionStorage.getItem("numeroCommande"))
            numeroCommande=pad(numeroCommande, 5)
            $("#confirmation-number").html(`Votre numéro de confirmation est le <strong>${numeroCommande}</strong>.`)
          }


          // Fonction de padding pour le numero de commande tirée de 
          // https://stackoverflow.com/questions/6466135/adding-extra-zeros-in-front-of-a-number-using-jquery
          function pad (str, max) {
            str = str.toString();
            return str.length < max ? pad("0" + str, max) : str;
          }