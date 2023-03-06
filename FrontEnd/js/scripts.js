 // recupere le token de session
 let token = sessionStorage.getItem("token");

 // verifie le token de session
 if (token && token !== "undefined") {
     console.log("sucessfully");

     // change login en logout 
     document.getElementById("login").innerHTML = "logout";
     // afficher la barre d'édition 
     const containerEdition = document.querySelector(".container-edition");
     containerEdition.classList.toggle("active");

     //********** Modal **********//
    
     // créer les boutons avec modal 
     const figure = document.querySelector('#introduction figure');
     const portfolio = document.querySelector('#portfolio h2');
     const article = document.querySelector('article h2');
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

     // crée le bouton close
     const closeButton = document.createElement('button');
     closeButton.classList.add('close-modal', 'modal-trigger');

     closeButton.textContent = 'X';
     modal.appendChild(closeButton);


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
      
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(images => {
            const imagesContainer = document.querySelector('.container-modal');
            
            images.forEach(item => {
                const img = document.createElement('img');
                const figure = document.createElement('figure');
                const figcaption = document.createElement('figcaption');
                figure.setAttribute("id","figure-modal");
                img.setAttribute('src', item.imageUrl);
                img.setAttribute('alt', item.title);
                img.setAttribute('category', item.categoryId);
                img.setAttribute('crossorigin', 'anonymous');
                figcaption.innerHTML='éditer';
                figcaption.setAttribute("id" , "figcaptionModal");
                figure.appendChild(img);
                figure.appendChild(figcaption);
                imagesContainer.appendChild(figure);
               
            });
        })
     //crée le footer
     const footer = document.createElement('footer');
     footer.classList.add('modal-footer');
     containerModal.after(footer);
     const boutonsAjouter = document.createElement('button');
     boutonsAjouter.textContent="Ajouter une photo"
     boutonsAjouter.classList.add('bouton-ajouter');
     footer.appendChild(boutonsAjouter);
     // crée les button
     const modalButton = document.createElement('button');
     const modalbutton2= document.createElement('button');
     const modalbutton3= document.createElement('button');

     modalButton.classList.add('modal-btn', 'modal-trigger');
     modalbutton2.classList.add('modal-btn', 'modal-trigger');
     modalbutton3.classList.add('modal-btn', 'modal-trigger');

     modalButton.dataset.target = '#modal-2';
     modalbutton2.dataset.target = '#modal-1';
     modalbutton3.dataset.target = '#modal-3';

     modalButton.textContent = 'Modifier';
     modalbutton2.textContent = 'Modifier';
     modalbutton3.textContent = 'Modifier';
     figure.appendChild(modalButton);
     portfolio.appendChild(modalbutton2);
     article.appendChild(modalbutton3);

     // recupere les éléments des modals
     const modalBtns = document.querySelectorAll('.modal-btn');
     const modalContainers = document.querySelectorAll(".modal-container");
     const closeModals = document.querySelectorAll('.close-modal');
     const overLays = document.querySelectorAll('.overlay');
     //afficher les boutons modal
     modalBtns.forEach(modalBtn => modalBtn.classList.toggle("active"));


     // Ajouter un événement de clic à chaque bouton .modal-btn
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
                const figure = document.createElement('figure');
                const img = document.createElement('img');
           

                img.setAttribute('src', item.imageUrl);
                img.setAttribute('alt', item.title);
                img.setAttribute('category', item.categoryId);
                img.setAttribute('crossorigin', 'anonymous');

                figure.appendChild(img);
                imagesContainer.appendChild(figure);

                //Test des id des images
                //console.log("Numéro d'id",item.categoryId);
            });
        })
        .catch(error => console.error(error));
}