 // recupere le token de session
 let token = sessionStorage.getItem("token");

 // verifie le token de session
 if (token && token !== "undefined") {
     console.log("sucessfully");

     // change login en logout 
     document.getElementById("login").innerHTML = "logout";
     // Création de l'élément containerEdition
     const containerEdition = document.createElement('div');
     containerEdition.classList.add('container-edition');

     //création de l'icon édition
     const icon = document.createElement('i');
     icon.classList.add('far', 'fa-edit', 'fa-pen-to-square');

     // Création de l'élément text
     const text = document.createElement('div');
     text.classList.add('text');

     // Création de l'élément p2
     const p1 = document.createElement('p');
     p1.setAttribute('id', 'thin');
     p1.textContent = "Mode éditon";

     // Création de l'élément p2
     const p2 = document.createElement('button');
     p2.setAttribute('id', 'bold');
     p2.textContent = "publier les changements";

     // Ajout de l'élément p dans l'élément text
     text.appendChild(icon);
     text.appendChild(p1);
     text.appendChild(p2);
     
     // Ajout de l'élément text dans l'élément containerEdition
     containerEdition.appendChild(text);

     // Ajout de l'élément containerEdition au début du body
     document.body.prepend(containerEdition);

     //********** Modal **********//

     // créer les boutons avec modal 
     const figure = document.querySelector('#introduction figure');
     const portfolio = document.querySelector('#portfolio ');
     const article = document.querySelector('article ');
     // crée le container
     const modalContainer = document.createElement('div');
     modalContainer.classList.add('modal-container');
     modalContainer.id = 'modal-1';
     figure.insertAdjacentElement('afterbegin', modalContainer);

     // crée l'overlay
     const overlay = document.createElement('div');
     overlay.classList.add('overlay', 'modal-trigger');
     modalContainer.appendChild(overlay);

     // crée la modal
     const modal = document.createElement('div');
     modal.classList.add('modal');
     modalContainer.appendChild(modal);

     // crée le bouton close & la fleche retour arriere 
     const closeButton = document.createElement('button');
     const arrowModal = document.createElement('i');
     arrowModal.classList.add('fa-solid', 'fa-arrow-left', "arrow");
     closeButton.classList.add('close-modal', 'modal-trigger');

     closeButton.textContent = 'X';
     modal.appendChild(closeButton);
     modal.appendChild(arrowModal);


     // crée le header et le container
     const header = document.createElement('header');
     header.classList.add('modal-header');

     const containerModal = document.createElement('div');
     containerModal.classList.add('container-modal');

     modal.appendChild(header);
     modal.appendChild(containerModal);

     // crée le titre
     const heading = document.createElement('h1');
     heading.classList.add('titre-modal');
     heading.textContent = 'Galerie photos';
     header.appendChild(heading);


     // crée contenu
     afficherImagesModal();

     //crée le footer
     const footer = document.createElement('footer');
     footer.classList.add('modal-footer');
     containerModal.after(footer);
     // crée le bouton Ajouter
     const boutonsAjouter = document.createElement('button');
     boutonsAjouter.textContent = "Ajouter une photo"
     boutonsAjouter.classList.add('bouton-ajouter');
     footer.appendChild(boutonsAjouter);

     // ajouter un écouteur au bouton ajouter-photo
     boutonsAjouter.addEventListener("click", function() {
         const modalContainer = document.querySelector('.container-modal');
         modalContainer.style.display = 'flex';
         
         //création du formulaire
         const form = document.createElement('form');
         form.setAttribute("id", "modal-form");
         
         //inputFile 
         const inputFormFile = document.createElement('input');
         inputFormFile.setAttribute('type', 'file');
         inputFormFile.setAttribute('id', 'image');
         inputFormFile.setAttribute('accept', 'image/png');
        
         //label titre
         const labelTitre = document.createElement('label');
         labelTitre.innerText = "Titre";
         labelTitre.setAttribute('for', 'titre');
         labelTitre.setAttribute('id', 'label-titre');
         
         //l'input titre
         const inputTitre = document.createElement('input');
         inputTitre.setAttribute('type', 'text');
         inputTitre.setAttribute('id', 'titre');
         inputTitre.setAttribute('name', 'titre');

         //label catégorie
         const labelCategories = document.createElement('label');
         labelCategories.setAttribute('for', 'categories');
         labelCategories.setAttribute('id', 'categories');
         labelCategories.innerText = "Catégorie";
         
         // crée la selection des categories
         const selectTag = document.createElement('select');
         selectTag.setAttribute('id', 'categories-select');
         const optionCategories = document.createElement('option');
         optionCategories.setAttribute('value', '');
         
         //selection des éléments
         const titleModal = document.querySelector('.titre-modal');
         const arrowModal = document.querySelector('.arrow');
         const boutonSupprimer = document.querySelector('.bouton-supprimer');
         const boutonAjouter = document.querySelector('.bouton-ajouter');
        
         //effectuer les changements
         boutonAjouter.textContent = "Valider";
         boutonAjouter.style.background = 'gray';
         boutonAjouter.style.border = '1px solid gray';
         boutonSupprimer.style.display = "none";
         titleModal.textContent = 'Ajout photo';
         arrowModal.style.display = 'block';
         modalContainer.innerHTML = "";
         
         //ajouter les éléments au DOM
         modalContainer.appendChild(form);
         form.appendChild(inputFormFile);
         form.appendChild(labelTitre);
         form.appendChild(inputTitre);
         form.appendChild(labelCategories);
         form.appendChild(selectTag)
         selectTag.appendChild(optionCategories);


         //ajouter les catégorie dynamiquement 
         const categorySelect = document.querySelector('select');
         fetch('http://localhost:5678/api/categories')
             .then(response => response.json())
             .then(categories => {

                 categories.forEach(category => {
                     const option = document.createElement("option");
                     option.value = category.id;
                     option.text = category.name;
                     categorySelect.appendChild(option);
                     const mySelect = document.getElementById("categories-select");
                     const options = mySelect.querySelectorAll("option");
                    // cacher le premier élément vide "option"
                     options.forEach(option => {
                         if (option.textContent.trim() === "") {
                             option.hidden = true;
                         }
                     });
                 });
             })
             .catch(error => console.error(error));

     });




     //écouteur d'evenement sur la flêche retour 
     arrowModal.addEventListener("click", function() {
         const form = document.querySelector('form');
         form.remove();
         const arrowModal = document.querySelector('.arrow');
         arrowModal.style.display = "none";
         const heading = document.querySelector('.titre-modal');
         heading.textContent = 'Galerie-photo';
         const boutonValider = document.querySelector('.bouton-ajouter');
         boutonValider.textContent = "Ajouter une photo";
         boutonValider.style.background = "#1D6154";
         boutonValider.style.border = "1px solid green"
         const boutonSupprimer = document.querySelector('.bouton-supprimer');
         boutonSupprimer.style.display = "block";
         const modalContainer = document.querySelector('.container-modal');
         modalContainer.style.display="grid";
         afficherImagesModal();
     });


     // crée le bouton Supprimer
     const boutonSupprimer = document.createElement('button');
     boutonSupprimer.textContent = "Supprimer la galerie"
     boutonSupprimer.classList.add('bouton-supprimer');
     footer.appendChild(boutonSupprimer);

     //crée la fonction supprimer


     // crée les button
     const modalButton = document.createElement('button');
     const modalbutton2 = document.createElement('button');
     const modalbutton3 = document.createElement('button');

     modalButton.classList.add('modal-btn', 'modal-trigger');
     modalbutton2.classList.add('modal-btn', 'modal-trigger');
     modalbutton3.classList.add('modal-btn', 'modal-trigger');

     modalButton.dataset.target = '#modal-2';
     modalbutton2.dataset.target = '#modal-1';
     modalbutton3.dataset.target = '#modal-3';

     const icon1 = document.createElement('i');
     icon1.classList.add('far', 'fa-thin', 'fa-pen-to-square');
     modalButton.appendChild(icon1);
     modalButton.appendChild(document.createTextNode(' modifier'));

     const icon2 = document.createElement('i');
     icon2.classList.add('far', 'fa-thin', 'fa-pen-to-square');
     modalbutton2.appendChild(icon2);
     modalbutton2.appendChild(document.createTextNode(' modifier'));

     const icon3 = document.createElement('i');
     icon3.classList.add('far', 'fa-thin', 'fa-pen-to-square');
     modalbutton3.appendChild(icon3);
     modalbutton3.appendChild(document.createTextNode(' modifier'));
     figure.appendChild(modalButton);
     portfolio.prepend(modalbutton2);
     article.prepend(modalbutton3);

     // recupere les éléments de la modal
     const modalBtns = document.querySelectorAll('.modal-btn');
     const modalContainers = document.querySelectorAll(".modal-container");
     const closeModals = document.querySelectorAll('.close-modal');
     const overLays = document.querySelectorAll('.overlay');
     //afficher les boutons modal
     modalBtns.forEach(modalBtn => modalBtn.classList.toggle("active"));


     // Ajouter un événement de clic au bouton .modal-btn
     modalBtns.forEach((modalBtn) => {
         modalBtn.addEventListener("click", (event) => {
             event.preventDefault();
             const modalId = event.target.getAttribute("data-target");
             const modalContainer = document.querySelector(modalId);
             modalContainer.classList.toggle("active");
             console.log(modalId);
         });
     });

     closeModals.forEach((closeModal) => {
         closeModal.addEventListener("click", () => {
             modalContainers.forEach((modalContainer) => {
                 modalContainer.classList.remove("active");
                 console.log('test close modal');
             });
         });
     });

     //********** Fin Modal **********//

     // Vider le sessionStorage et rediriger l'user vers la page login 
     let btnLogout = document.getElementById("login");
     btnLogout.addEventListener("click", function() {
         sessionStorage.clear();
         document.location.href = "login.html";
     })
 } else {
     console.log("Unsuccessful");
 }




 //crée les bouton des catégories
 function boutonsCategories() {

     //récupèrer l'id de la section gallery
     const divPortfolio = document.getElementById('portfolio');

     //creer le conteneur
     const divBoutons = document.createElement('div');
     divBoutons.className = 'categories';

     //creer le bouton all
     fetch('http://localhost:5678/api/categories')
         .then(response => response.json())
         .then(data => {
             const elementsSet = new Set(data);
             const divBoutons = document.createElement('div');
             divBoutons.className = 'categories';
             const divPortfolio = document.getElementById('portfolio');
             const btnAll = document.createElement('button');
             btnAll.textContent = 'Tous';
             divBoutons.appendChild(btnAll);

             elementsSet.forEach(element => {
                 const button = document.createElement('button');
                 button.textContent = element.name;
                 button.id = element.id;
                 divBoutons.appendChild(button);
                 divPortfolio.querySelector('h2').insertAdjacentElement('afterend', divBoutons);

                 button.addEventListener('click', function() {
                     const id = this.id;
                     document.querySelectorAll('.gallery img').forEach(image => {
                         if (image.getAttribute('category') === id) {
                             image.parentElement.style.display = 'block';
                         } else {
                             image.parentElement.style.display = 'none';
                         }
                     });
                 });
             });

             btnAll.addEventListener('click', function() {
                 document.querySelectorAll('.gallery img').forEach(image => {
                     image.parentElement.style.display = 'block';
                 });
             });

         });
 }


 // récuperer les images et les afficher dynamiquement 

 function afficherImages() {
     fetch('http://localhost:5678/api/works')
         .then(response => response.json())
         .then(images => {
             const imagesContainer = document.querySelector('.gallery');

             images.forEach(item => {
                 const figure = document.createElement('figure');
                 const img = document.createElement('img');
                 const figcaption = document.createElement('figcaption');

                 img.setAttribute('src', item.imageUrl);
                 img.setAttribute('alt', item.title);
                 img.setAttribute('category', item.categoryId);
                 img.setAttribute('crossorigin', 'anonymous');
                 figcaption.textContent = item.title;

                 figure.appendChild(img);
                 figure.appendChild(figcaption);
                 imagesContainer.appendChild(figure);

                 //Test des id des images
                 //console.log("Numéro d'id",item.categoryId);
             });
         })
         .catch(error => console.error(error));
 }

 function afficherImagesModal() {
     fetch('http://localhost:5678/api/works')
         .then(response => response.json())
         .then(images => {
             const imagesContainer = document.querySelector('.container-modal');

             images.forEach(item => {
                 const img = document.createElement('img');
                 const figure = document.createElement('figure');
                 const figcaption = document.createElement('figcaption');
                 const icon = document.createElement('i');
                 icon.classList.add('fa-solid', 'fa-trash-can', 'icon');
                 figure.setAttribute("id", "figure-modal");
                 img.setAttribute('src', item.imageUrl);
                 img.setAttribute('alt', item.title);
                 img.setAttribute('category', item.categoryId);
                 img.setAttribute('crossorigin', 'anonymous');
                 figcaption.innerHTML = 'éditer';
                 figcaption.setAttribute("id", "figcaptionModal");
                 figure.appendChild(img);
                 figure.appendChild(icon);
                 figure.appendChild(figcaption);
                 imagesContainer.appendChild(figure);


             });
         })
 }