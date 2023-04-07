document.addEventListener("DOMContentLoaded", function() {


    // verifie le token de session
    if (sessionStorage.getItem("token") && sessionStorage.getItem("token") !== "undefined") {
        console.log("sucessfully");

        createContainerEdition();
        // change login en logout 
        document.getElementById("login").innerHTML = "logout";

        // Appeler la fonction pour initialiser les boutons
        initializeBoutonsModal();

        //********** Modal **********//
        const modalContainer = document.createElement('div');
        creatModal(modalContainer);

        //********** Fin Modal **********//

        // Vider le sessionStorage et rediriger l'user vers la page login 
        let btnLogout = document.getElementById("login");
        btnLogout.addEventListener("click", function() {
            clearSessionStorage();
        })
    }


    function creatModal() {

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
            creatForm(modalContainer);

           
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

        boutonSupprimer.addEventListener('click', (e) => {
            e.preventDefault();

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
        });

    }




    recupererTravail()
        .then(images => afficherImages(images))
    boutonsCategories();
});

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.classList.add(...classes);
    return icon;
}

function createInputFormFile() {
    const input = document.createElement('input');
    input.setAttribute('hidden', '');
    input.setAttribute('type', 'file');
    input.setAttribute('id', 'image');
    input.setAttribute('accept', 'image/png');
    input.setAttribute('required', '');
    return input;
}

function createLabel(text, forId, labelId) {
    const label = document.createElement('label');
    label.innerText = text;
    label.setAttribute('for', forId);
    label.setAttribute('id', labelId);
    return label;
}

function createInput(type, id, name) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('id', id);
    input.setAttribute('name', name);
    return input;
}

function createDivWithClass(className) {
    const div = document.createElement('div');
    div.classList.add(className);
    return div;
}

function createButtonWithClassAndText(className, text) {
    const button = document.createElement('button');
    button.classList.add(className);
    button.innerText = text;
    return button;
}

function createSelect(id) {
    const select = document.createElement('select');
    select.setAttribute('id', id);
    return select;
}

function createOption(value) {
    const option = document.createElement('option');
    option.setAttribute('value', value);
    return option;
}

function createSpanWithClassAndText(className, text) {
    const span = document.createElement('span');
    span.classList.add(className);
    span.innerText = text;
    return span;
}

function createImagePreview() {
    const img = document.createElement('img');
    const figure = document.createElement('figure');
    figure.classList.add('container-preview');
    img.setAttribute('id', 'imagePreview');
    img.style.display = 'none';
    img.style.width = '55%';
    figure.appendChild(img);
    return figure;
}

function createBoutonAjouterPhoto(modalFormDiv, inputFormFile) {
    const boutonAjouterPhoto = createButtonWithClassAndText('bouton-ajouter-photo', '+ Ajouter photo');
    boutonAjouterPhoto.addEventListener('click', () => {
        modalFormDiv.innerHTML = '';
        inputFormFile.click();
    });
    return boutonAjouterPhoto;
}

function creatForm(modalContainer) {
    //création du formulaire
    modalContainer.innerHTML = '';
    const form = document.createElement('form');
    form.setAttribute('id', 'modal-form');

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

    inputFormFile.addEventListener('change', (event) => {
        inputFormFile.style.display = 'none';
        divInputFile.appendChild(imagePreview);
        const img = imagePreview.querySelector('img');
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
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

// ******Creation des bouton pour la modal ******

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

function clearSessionStorage() {
    sessionStorage.clear();
    document.location.href = "login.html";
}

function createAndAppendElement(parent, elementType, classList = [], textContent = '', position = 'beforeend') {
    const element = document.createElement(elementType);
    element.classList.add(...classList);
    element.textContent = textContent;
    parent.insertAdjacentElement(position, element);
    return element;
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


//crée et afficher les bouton 'modifier' 
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

// récuperer les images et les afficher dynamiquement 
function recupererTravail() {
    return fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .catch(erreur => console.error(erreur));
}

function afficherImages(images) {
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


//afficher les images dans la modal
function afficherImagesModal(images) {
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

function createContainerEdition() {
    const containerEdition = createAndAppendElement(document.body, 'div', ['container-edition'], '', 'afterbegin');

    const icon = createAndAppendElement(containerEdition, 'i', ['far', 'fa-edit', 'fa-pen-to-square']);

    const text = createAndAppendElement(containerEdition, 'div', ['text']);

    const p1 = createAndAppendElement(text, 'p', [], "Mode éditon");
    p1.setAttribute('id', 'thin');

    const p2 = createAndAppendElement(text, 'button', [], "publier les changements");
    p2.setAttribute('id', 'bold');
}