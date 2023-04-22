//crée une modal pour la galerie de photos et gère les événements associés
export function creatModal() {

    const figure = document.querySelector('#introduction figure');
 
    const modalContainer = createAndAppendElement(figure, 'div', ['modal-container'], '', 'afterbegin');
    modalContainer.id = 'modal-1';
 
    const overlay = createAndAppendElement(modalContainer, 'div', ['overlay', 'modal-trigger']);
    const modal = createAndAppendElement(modalContainer, 'div', ['modal']);
    const header = createAndAppendElement(modal, 'header', ['modal-header']);
    const heading = createAndAppendElement(header, 'h1', ['titre-modal'], 'Galerie photos');
    const closeButton = createAndAppendElement(header, 'button', ['close-modal', 'modal-trigger'], 'X');
    const arrowModal = createAndAppendElement(header, 'i', ['fa-solid', 'fa-arrow-left', 'arrow']);
    const containerModal = createAndAppendElement(modal, 'div', ['modal-content']);
 
    recupererTravail()
       .then(données => afficherImagesModal(données))
 
    const footer = createAndAppendElement(modal, 'footer', ['modal-footer']);
    const boutonsAjouter = createAndAppendElement(footer, 'button', ['bouton-ajouter'], 'Ajouter une photo');
 
 
    closeButton.addEventListener("click", (e) => {
       e.preventDefault();
       const modalButton1 = document.querySelector('.btn1');
       const modalButton2 = document.querySelector('.btn2');
       const modalButton3 = document.querySelector('.btn3');
       modalButton1.style.zIndex = "1";
       modalButton2.style.zIndex = "1";
       modalButton3.style.zIndex = "1";
       modalContainer.classList.remove("active");
       console.log('test close modal');
    });
 
    boutonsAjouter.addEventListener("click", function() {
        const modalContainer = document.querySelector('.modal-content');
        modalContainer.style.display = 'flex';
        boutonsAjouter.setAttribute('id', 'addWorks');
        if (!document.getElementById('modal-form')) {
            creatForm(modalContainer);
        }
    });
 
    //écouteur d'evenement sur la flêche retour 
    arrowModal.addEventListener("click", function() {
       const form = document.querySelector('form');
       const boutonAjouter = document.querySelector('.bouton-ajouter');
       boutonAjouter.removeAttribute("id");
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
       const modalContainer = document.querySelector('.modal-content');
       modalContainer.style.display = "grid";
       recupererTravail()
          .then(données => afficherImagesModal(données))
    });
 
    // crée le bouton Supprimer
    const boutonSupprimer = document.createElement('button');
    boutonSupprimer.textContent = "Supprimer la galerie"
    boutonSupprimer.classList.add('bouton-supprimer');
    footer.appendChild(boutonSupprimer);
 
    document.addEventListener('DOMContentLoaded', () => {
       const boutonSupprimer = document.getElementById('boutonSupprimer');
       boutonSupprimer.addEventListener('click', (e) => {
          e.preventDefault();
          supprimerToutlesTravaux();
       });
    });
 
 }
 
 export function supprimerToutlesTravaux() {
    // Récupère la liste de tous les éléments
    fetch('http://localhost:5678/api/works', {
          headers: {
             Authorization: 'Bearer ' + sessionStorage.getItem("token")
          }
       })
       .then(response => {
          if (!response.ok) {
             throw new Error('Erreur ' + response.status + ': ' + response.statusText);
          }
          return response.json();
       })
       .then(data => {
          // Pour chaque élément, effectue une requête DELETE
          data.forEach(item => {
             fetch('http://localhost:5678/api/works/' + item.id, {
                   method: 'DELETE',
                   headers: {
                      Authorization: 'Bearer ' + sessionStorage.getItem("token")
                   }
                })
                .then(response => {
                   if (!response.ok) {
                      throw new Error('Erreur ' + response.status + ': ' + response.statusText);
                   }
                   console.log('La ressource ' + item.id + ' a été supprimée avec succès', +response.status);
                })
                .catch(error => {
                   console.error(error);
                });
          });
 
          // Met à jour l'affichage des images après la suppression
          recupererTravail()
             .then(données => afficherImagesModal(données))
          e.preventDefault();
       })
       .catch(error => {
          console.error(error);
       });
 }
 
 //crée et ajoute un élément avec des classes, un texte et une position spécifiés, puis l'ajoute au parent
 export function createAndAppendElement(parent, elementType, classList = [], textContent = '', position = 'beforeend') {
    const element = document.createElement(elementType);
    element.classList.add(...classList);
    element.textContent = textContent;
    parent.insertAdjacentElement(position, element);
    return element;
 }
 
 //récupère les données des travaux (photos) à partir de l'API
 export function recupererTravail() {
    return fetch('http://localhost:5678/api/works')
       .then(response => response.json())
       .catch(erreur => console.error(erreur));
 }
 
 //affiche les images dans la galerie à partir des données fournies
 export function afficherImages(images) {
    const conteneurImages = document.querySelector('.gallery');
 
    images.forEach(element => {
       const figure = document.createElement('figure');
       const img = document.createElement('img');
       const figcaption = document.createElement('figcaption');
 
       img.setAttribute('src', element.imageUrl);
       img.setAttribute('alt', element.title);
       img.setAttribute('category', element.categoryId);
       img.setAttribute('crossorigin', 'anonymous');
       figcaption.textContent = element.title;
 
       figure.appendChild(img);
       figure.appendChild(figcaption);
       conteneurImages.appendChild(figure);
    });
 }
 
 //affiche les images dans le modal à partir des données fournies
 export function afficherImagesModal(images) {
    const imagesContainer = document.querySelector(".modal-content");
    imagesContainer.innerHTML = "";
 
    images.forEach((item, index) => {
       const img = document.createElement("img");
       const figure = document.createElement("figure");
       const figcaption = document.createElement("figcaption");
       img.src = item.imageUrl;
       img.alt = item.title;
       img.setAttribute("data-id", item.id);
       img.crossOrigin = "anonymous";
       figure.classList.add("figure-modal");
       figure.append(img);
       if (index === 0) {
          const editIcon = document.createElement("i");
          editIcon.classList.add(
             "fa-solid",
             "fa-arrows-up-down-left-right",
             "icon-drag"
          );
          figure.append(editIcon);
       }
       const deleteIcon = document.createElement("i");
       deleteIcon.classList.add("fa-solid", "fa-trash-can", "icon-trash");
       figure.append(deleteIcon);
       figcaption.textContent = "éditer";
       figcaption.id = "figcaptionModal";
       figure.append(figcaption);
       imagesContainer.append(figure);
 
       // Ajouter un événement "click" directement à l'icône de suppression
       deleteIcon.addEventListener("click", (event) => {
          event.preventDefault();
          const id = img.getAttribute("data-id");
 
          fetch(`http://localhost:5678/api/works/` + id, {
                method: "DELETE",
                headers: {
                   Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
             })
             .then((response) => {
                if (!response.ok) {
                   throw new Error(
                      `Erreur ${response.status}: ${response.statusText}`
                   );
                }
 
                console.log(`L'élément ` + id + ` a été supprimé avec succès.`);
                figure.remove();
             })
             .catch((error) => {
                console.error(error);
             });
       });
    });
 }
 
 //crée un formulaire pour ajouter de nouvelles photos dans le modal
 export function creatForm(modalContainer) {
    //création du formulaire
    modalContainer.innerHTML = '';
    const form = document.createElement('form');
    form.setAttribute('id', 'modal-form');
    form.setAttribute('enctype', 'multipart/form-data');
 
    //inputFile & icon
    const iconPicture = createIcon(['fa-sharp', 'fa-solid', 'fa-image', 'picture', 'fa-xl']);
    const inputFormFile = createInputFormFile();
 
    //label titre
    const labelTitre = createLabel('Titre', 'titre', 'label-titre');
    const divTitre = createDivWithClass('input-titre');
    const inputTitre = createInput('text', 'titre', 'titre');
 
    //label catégorie
    const labelCategories = createLabel('Catégorie', 'categories', 'categories');
    const selectTag = createSelect('categories-select');
    selectTag.setAttribute('name', 'categoryId');
    const optionCategories = createOption('');
 
    //effectuer les changements
    const boutonAjouter = document.querySelector('.bouton-ajouter');
    boutonAjouter.textContent = 'Valider';
    boutonAjouter.style.background = 'gray';
    boutonAjouter.style.border = '1px solid gray';
    const boutonSupprimer = document.querySelector('.bouton-supprimer');
    boutonSupprimer.style.display = 'none';
    const titleModal = document.querySelector('.titre-modal');
    titleModal.textContent = 'Ajout photo';
    const arrowModal = document.querySelector('.arrow');
    arrowModal.style.display = 'block';
 
    //création des divs pour contenir les éléments du formulaire
    const divInputFile = createDivWithClass('input-file');
    const divInputForm = createDivWithClass('form-group');
 
    const modalFormDiv = divInputFile;
 
    const boutonAjouterPhoto = createBoutonAjouterPhoto(modalFormDiv, inputFormFile);
 
    const spanCaption = createSpanWithClassAndText('text-caption', 'jpg,png: 4mo max');
    const imagePreview = createImagePreview();
 
    inputFormFile.addEventListener('change', () => {
       if (inputFormFile.files.length > 0) {
          console.log('success ' + inputFormFile.files[0].name);
       } else {
          console.log('nope');
       }
 
       boutonAjouter.addEventListener('click', async () => {
          ajouterTravail();
       });
 
    });
 
    //ajouter les éléments au DOM
    modalContainer.appendChild(form);
    form.appendChild(divInputFile);
    divInputFile.appendChild(iconPicture);
    divInputFile.appendChild(inputFormFile);
    divInputFile.appendChild(boutonAjouterPhoto);
    divInputFile.appendChild(spanCaption);
    form.appendChild(divInputForm);
    divInputForm.appendChild(divTitre);
    divInputForm.appendChild(labelCategories);
    divInputForm.appendChild(selectTag);
    divTitre.appendChild(labelTitre);
    divTitre.appendChild(inputTitre);

    const inputElement = document.getElementById("image");
        inputElement.addEventListener("change", (event) => {
        

       
        });
        
    inputFormFile.addEventListener('change', (event) => {
       inputFormFile.style.display = 'none';

       divInputFile.appendChild(imagePreview);
       const img = imagePreview.querySelector('img');
       const file = event.target.files[0];
       const inputElement = document.getElementById("image");
       const files = event.target.files[0];
       if (file) {
          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            inputElement.setAttribute("src", reader.result);
             img.src = event.target.result;
             img.style.display = 'block';  
          });

          reader.readAsDataURL(file);
       }
    });
 
    //ajouter les catégorie dynamiquement
    const categorySelect = document.querySelector('select');
    fetch('http://localhost:5678/api/categories')
       .then((response) => response.json())
       .then((categories) => {
          categories.forEach((category) => {
             const option = document.createElement('option');
             option.value = category.id;
             option.text = category.name;
             categorySelect.appendChild(option);
             const mySelect = document.getElementById('categories-select');
             const options = mySelect.querySelectorAll('option');
             options.forEach((option) => {
                if (option.textContent.trim() === '') {
                   option.hidden = true;
                }
             });
          });
       })
       .catch((error) => console.error(error));
 }
 async function ajouterTravail() {
 
    try {
 
       const imageInput = document.getElementById('image');
       const imageUrl = imageInput.files[0];
       const title = document.getElementById('titre').value;
       const categoryId = document.getElementById('categories-select').value;
       const token = sessionStorage.getItem("token");
       const userId = "1";
      alert(imageUrl.name);
       console.log(title);
       console.log(categoryId);
       console.log(token);
       console.log(userId);
       console.log(imageUrl);

       const data = new FormData();
       data.append('title', title);
       data.append('file', imageUrl); 
       data.append('category', categoryId);
       data.append('userId', userId)
 
 
       const apiUrl = 'http://localhost:5678/api/works';
       const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
             'Authorization': `Bearer ${token}`,
             'Content-Type': 'multipart/form-data; boundary',
          },
          body: data
       });
 
       if (response.ok) {
          alert('Les données ont été envoyées avec succès');
       } else {
          alert('Erreur lors de l\'envoi des données');
       }
    } catch (error) {
       console.error('Erreur lors de l\'envoi des données:', error);
       alert('Une erreur s\'est produite lors de l\'envoi des données. Veuillez réessayer.');
    }
 }
 
 //crée une icône avec les classes spécifiées
 export function createIcon(classes) {
    const icon = document.createElement('i');
    icon.classList.add(...classes);
    return icon;
 }
 
 //crée un élément input de type "file" avec des attributs spécifiques pour les fichiers image
 export function createInputFormFile() {
    const input = document.createElement('input');
    input.setAttribute('hidden', '');
    input.setAttribute('type', 'file');
    input.setAttribute('id', 'image');
    input.setAttribute('accept', 'image/png');
    input.setAttribute('required', '');
    return input;
 }
 
 //crée un élément label avec le texte, l'attribut "for" et l'identifiant spécifiés
 export function createLabel(text, forId, labelId) {
    const label = document.createElement('label');
    label.innerText = text;
    label.setAttribute('for', forId);
    label.setAttribute('id', labelId);
    return label;
 }
 
 //crée un élément input avec les attributs spécifiés
 export function createInput(type, id, name) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('id', id);
    input.setAttribute('name', name);
    return input;
 }
 
 //crée un élément div avec la classe spécifiée
 export function createDivWithClass(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
 }
 
 //crée un élément button avec la classe et le texte spécifiés
 export function createButtonWithClassAndText(className, text) {
    const button = document.createElement('button');
    button.classList.add(className);
    button.innerText = text;
    return button;
 }
 
 //crée un élément select avec l'attribut "id"
 export function createSelect(id) {
    const select = document.createElement('select');
    select.setAttribute('id', id);
    return select;
 }
 
 //crée un élément option avec la valeur donnée
 export function createOption(value) {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    return option;
 }
 
 //crée un élément span avec la classe et un texte
 export function createSpanWithClassAndText(className, text) {
    const span = document.createElement('span');
    span.classList.add(className);
    span.innerText = text;
    return span;
 }
 
 //crée un élément de prévisualisation d'image
 export function createImagePreview() {
    const img = document.createElement('img');
    const figure = document.createElement('figure');
    figure.classList.add('container-preview');
    img.setAttribute('id', 'imagePreview');
    img.setAttribute('name', 'imageUrl');
    img.style.display = 'none';
    img.style.width = '55%';
    figure.appendChild(img);
    return figure;
 }
 
 //crée un bouton pour ajouter une photo et gère l'événement associé
 export function createBoutonAjouterPhoto(modalFormDiv, inputFormFile) {
    const boutonAjouterPhoto = createButtonWithClassAndText('bouton-ajouter-photo', '+ Ajouter photo');
    boutonAjouterPhoto.addEventListener('click', () => {
       inputFormFile.click();
       const i = document.querySelector('.picture');
       const span = document.querySelector('.text-caption');
       boutonAjouterPhoto.style.display = 'none';
       i.style.display = 'none';
       span.style.display = 'none';
    });
    return boutonAjouterPhoto;
 }