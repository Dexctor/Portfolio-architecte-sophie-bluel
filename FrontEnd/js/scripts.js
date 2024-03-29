"use strict";
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
 
       
 
      //Crée le conteneur de la fenêtre modale
       const modalContainer = document.createElement('div');
       creatModal(modalContainer);

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