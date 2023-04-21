// Import des fonctions utilitaires
import {
    creatModal,
    createAndAppendElement,
    recupererTravail,
    afficherImages,
 } from './utils.js';
 recupererTravail()
 .then(images => afficherImages(images))
// Lorsque le document est prêt
 document.addEventListener("DOMContentLoaded", function() {
 
    // verifie si le token de session est valide 
    if (sessionStorage.getItem("token") && sessionStorage.getItem("token") !== "undefined") {
       console.log("sucessfully");
 
       //Crée le conteneur d'édition
       createContainerEdition();
       // Modifie le bouton de connexion en bouton de deconnexion
       document.getElementById("login").innerHTML = "logout";
 
       // Initialise les boutons de la fenêtre modale
       initializeBoutonsModal();
 
      //Crée le conteneur de la fenêtre modale
       const modalContainer = document.createElement('div');
       creatModal(modalContainer);
 
        //Récupère et affiche les travaux (images)
        recupererTravail()
            .then(images => afficherImages(images))

        //Crée et initialise les boutons de catégories
       

       // Vide le sessionStorage et redirige l'utilisateur vers la page de connexion
       let btnLogout = document.getElementById("login");
       btnLogout.addEventListener("click", function() {
          clearSessionStorage();
       })
    }
 });
 
 boutonsCategories();
//Crée le bouton pour la fenêtre modal
 function createModalButton(target, buttonText) {
    const button = document.createElement('button');
    button.classList.add('modal-btn', 'modal-trigger');
    button.dataset.target = target;
 
    const icon = document.createElement('i');
    icon.classList.add('far', 'fa-thin', 'fa-pen-to-square');
    button.appendChild(icon);
    button.appendChild(document.createTextNode(buttonText));
 
    return button;
 }
 
//Vide le sessionStorage et redirige l'utilisateur vers la page de connexion
function clearSessionStorage() {
    sessionStorage.clear();
    document.location.href = "login.html";
 }
 
//Récupère les catégories depuis l'API
function recupererCategories() {
    return fetch('http://localhost:5678/api/categories')
        .then(response => response.json());
}

//Traite et affiche les catégories récupérées 
function traitementCategories(categories) {
    const divPortfolio = document.getElementById('portfolio');
    const divBoutons = document.createElement('div');
    divBoutons.className = 'categories';

    const btnAll = document.createElement('button');
    btnAll.textContent = 'Tous';
    divBoutons.appendChild(btnAll);

    categories.forEach(categorie => {
        const button = document.createElement('button');
        button.textContent = categorie.name;
        button.id = categorie.id;
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
}

//Initialise les boutons des catégories
function boutonsCategories() {
    recupererCategories().then(categories => {
        traitementCategories(categories);
    });
}
 
//Initialise et affiche les boutons "modifier" pour la fenêtre modal
function initializeBoutonsModal() {
    const figure2 = document.querySelector('#introduction figure');
    const portfolio2 = document.querySelector('.tittle-button-wrapper');
    const article2 = document.querySelector('article');
    const modalButton1 = createModalButton('#modal-2', ' modifier');
    const modalButton2 = createModalButton('#modal-1', ' modifier');
    const modalButton3 = createModalButton('#modal-3', ' modifier');
    modalButton1.classList.add('btn2');
    modalButton2.classList.add('btn1');
    modalButton3.classList.add('btn3');
 
    figure2.appendChild(modalButton1);
    portfolio2.prepend(modalButton2);
    article2.prepend(modalButton3);
 
    const modalBtns = document.querySelectorAll('.modal-btn');
    const modalContainers = document.querySelectorAll(".modal-container");
    const closeModal = document.querySelector('.close-modal');
    const overLays = document.querySelectorAll('.overlay');
 
    modalBtns.forEach(modalBtn => modalBtn.classList.toggle("active"));
 
    modalButton2.addEventListener("click", (event) => {
       event.preventDefault();
       const modalId = event.target.getAttribute("data-target");
       modalButton1.style.zIndex = "-1";
       modalButton2.style.zIndex = "-1";
       modalButton3.style.zIndex = "-1";
       const modalContainer = document.querySelector(modalId);
       modalContainer.classList.toggle("active");
       console.log(modalId);
    });
 }
 
//Crée et affiche le conteneur d'édition 
function createContainerEdition() {
    const containerEdition = createAndAppendElement(document.body, 'div', ['container-edition'], '', 'afterbegin');
 
    const icon = createAndAppendElement(containerEdition, 'i', ['far', 'fa-edit', 'fa-pen-to-square']);
 
    const text = createAndAppendElement(containerEdition, 'div', ['text']);
 
    const p1 = createAndAppendElement(text, 'p', [], "Mode éditon");
    p1.setAttribute('id', 'thin');
 
    const p2 = createAndAppendElement(text, 'button', [], "publier les changements");
    p2.setAttribute('id', 'bold');
 }