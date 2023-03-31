
document.addEventListener("DOMContentLoaded", function() {
	alert("ok");

	// verifie le token de session
	if (sessionStorage.getItem("token") && sessionStorage.getItem("token") !== "undefined") {
		console.log("sucessfully");

		// change login en logout 
		document.getElementById("login").innerHTML = "logout";
		createContainerEdition();

		//********** Modal **********//
		const modalContainer = document.createElement('div');
		creatModal(modalContainer);

		function creatModal() {
			// Sélection des éléments
			const figure = document.querySelector('#introduction figure');

			// Création du container
			const modalContainer = document.createElement('div');
			modalContainer.classList.add('modal-container');
			modalContainer.id = 'modal-1';
			figure.insertAdjacentElement('afterbegin', modalContainer);

			// Création de l'overlay
			const overlay = document.createElement('div');
			overlay.classList.add('overlay', 'modal-trigger');
			modalContainer.appendChild(overlay);

			// Création de la modal
			const modal = document.createElement('div');
			modal.classList.add('modal');
			modalContainer.appendChild(modal);

			// Création du header
			const header = document.createElement('header');
			header.classList.add('modal-header');
			modal.appendChild(header);

			// Création du titre
			const heading = document.createElement('h1');
			heading.classList.add('titre-modal');
			heading.textContent = 'Galerie photos';
			header.appendChild(heading);

			// Création du bouton close
			const closeButton = document.createElement('button');
			closeButton.classList.add('close-modal', 'modal-trigger');
			closeButton.textContent = 'X';
			header.appendChild(closeButton);

			// Création de la flèche retour arrière
			const arrowModal = document.createElement('i');
			arrowModal.classList.add('fa-solid', 'fa-arrow-left', 'arrow');
			header.appendChild(arrowModal);

			// Création du container modal
			const containerModal = document.createElement('div');
			containerModal.classList.add('modal-content');
			modal.appendChild(containerModal);

			// Création du contenu
			afficherImagesModal();

			// Création du footer
			const footer = document.createElement('footer');
			footer.classList.add('modal-footer');
			containerModal.after(footer);

			// Création du bouton Ajouter
			const boutonsAjouter = document.createElement('button');
			boutonsAjouter.textContent = 'Ajouter une photo';
			boutonsAjouter.classList.add('bouton-ajouter');
			footer.appendChild(boutonsAjouter);

			// ajouter un écouteur au bouton ajouter-photo
			boutonsAjouter.addEventListener("click", function() {
				const modalContainer = document.querySelector('.modal-content');
				modalContainer.style.display = 'flex';
				boutonsAjouter.setAttribute('id', 'addWorks');
				creatForm(modalContainer);
			});

			const addWorks = document.getElementById('addWorks');

			if (addWorks) {
			  addWorks.addEventListener('click', () => {
				envoyerTravail();
			  });
			}


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
				afficherImagesModal();
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
									console.log('La ressource ' + item.id + ' a été supprimée avec succès', + response.status);
								})
								.catch(error => {
									console.error(error);
								});
						});

						// Met à jour l'affichage des images après la suppression
						afficherImagesModal();
						preventDefault();
					})
					.catch(error => {
						console.error(error);
					});
			});

		}

		function creatForm(modalContainer) {
			//création du formulaire
			modalContainer.innerHTML = "";
			const form = document.createElement('form');
			form.setAttribute("id", "modal-form");

			//inputFile & icon
			const iconPicture = document.createElement('i');
			iconPicture.classList.add('fa-sharp', 'fa-solid', 'fa-image', 'picture', 'fa-xl');
			const inputFormFile = document.createElement('input');
			inputFormFile.setAttribute('hidden', "");
			inputFormFile.setAttribute('type', 'file');
			inputFormFile.setAttribute('id', 'image');
			inputFormFile.setAttribute('accept', 'image/png');
			inputFormFile.setAttribute('required', '');

			//label titre
			const labelTitre = document.createElement('label');
			const divTitre = document.createElement('div');
			divTitre.classList.add('input-titre');
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

			//création des divs pour contenir les éléments du formulaire
			const divInputFile = document.createElement('div');
			divInputFile.classList.add('input-file')

			const divInputForm = document.createElement('div');
			divInputForm.classList.add('form-group');

			//création du bouton + ajouter photo
			const boutonAjouterPhoto = document.createElement('button');
			boutonAjouterPhoto.classList.add('bouton-ajouter-photo');
			boutonAjouterPhoto.innerText = "+ Ajouter photo";

			inputFormFile.addEventListener('change', () => {
				if (inputFormFile.files.length > 0) {
					console.log('sucess ' + inputFormFile.files[0].name);
				}
				else {
					console.log('nope');
				}
			});

			const modalFormDiv = divInputFile;
			// Ajoutez un écouteur 'click' au boutonAjouterPhoto
			boutonAjouterPhoto.addEventListener('click', (event) => {
				modalFormDiv.innerHTML = '';
				inputFormFile.click();
			});

			const spanCaption = document.createElement('span');
			spanCaption.classList.add('text-caption');
			spanCaption.innerText = "jpg,png: 4mo max";
			// Ajouter la preview du fichier

			//ajouter les éléments au DOM
			modalContainer.appendChild(form);
			form.appendChild(divInputFile);

			divInputFile.appendChild(iconPicture);
			form.appendChild(divInputForm);

			divInputFile.appendChild(inputFormFile);

			divInputFile.appendChild(boutonAjouterPhoto);
			divInputFile.appendChild(spanCaption);

			divInputForm.appendChild(divTitre);
			divInputForm.appendChild(labelCategories);
			divInputForm.appendChild(selectTag);

			divTitre.appendChild(labelTitre);
			divTitre.appendChild(inputTitre);

			// Ajoute un écouteur d'événements 'change' à inputFormFile
			inputFormFile.addEventListener('change', (event) => {
				const img = document.createElement('img');
				const figure = document.createElement('figure');
				const inputFormFile = document.querySelector('.input-file');
				inputFormFile.style.padding = ' 0px 0px';
				figure.classList.add('container-preview')
				img.setAttribute("id", "imagePreview");
				img.style.display = "none";
				img.style.width = "55%";

				divInputFile.appendChild(figure);
				figure.appendChild(img);
				const imagePreview = document.getElementById('imagePreview');
				const file = event.target.files[0];

				if (file) {
					const reader = new FileReader();

					reader.addEventListener('load', (event) => {
						// Met à jour l'attribut 'src' de l'élément 'img' avec l'URL de l'image
						imagePreview.src = event.target.result;
						// Affiche l'élément 'img'
						imagePreview.style.display = 'block';

					});

					reader.readAsDataURL(file);
				}
			});

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

		const figure2 = document.querySelector('#introduction figure');
		const portfolio2 = document.querySelector('#portfolio');
		const article2 = document.querySelector('article');
		const modalButton1 = createModalButton('#modal-2', ' modifier');
		const modalButton2 = createModalButton('#modal-1', ' modifier');
		const modalButton3 = createModalButton('#modal-3', ' modifier');

		figure2.appendChild(modalButton1);
		portfolio2.prepend(modalButton2);
		article2.prepend(modalButton3);

		// ****** Fin ******

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
			closeModal.addEventListener("click", (e) => {
				e.preventDefault();
				modalContainers.forEach((modalContainer) => {
					modalContainer.classList.remove("active");
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
	}
	else {
		console.log("Unsuccessful");
	}

	function createContainerEdition() {
		// Création de l'élément containerEdition
		const containerEdition = document.createElement('div');
		containerEdition.classList.add('container-edition');

		// Création de l'icon édition
		const icon = document.createElement('i');
		icon.classList.add('far', 'fa-edit', 'fa-pen-to-square');

		// Création de l'élément text
		const text = document.createElement('div');
		text.classList.add('text');

		// Création de l'élément p1
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
							}
							else {
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
		fetch("http://localhost:5678/api/works")
		  .then((response) => response.json())
		  .then((images) => {
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
				event.stopPropagation();
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
		  })
		  .catch((error) => {
			console.error("Error fetching images:", error);
		  });
	  }

	  function envoyerTravail() {
		const inputImage = document.getElementById("image");
		const inputTitre = document.getElementById("titre");
		const inputCategorie = document.getElementById("categories-select");
	  
		const image = inputImage.files[0];
		const titre = inputTitre.value;
		const categorie = inputCategorie.value;
	  
		const formData = new FormData();
		formData.append("image", image);
		formData.append("title", titre); 
		formData.append("category", categorie); 

		const API_URL = "http://localhost:5678/api/works/"

		fetch(API_URL, {
		  method: "POST",
		  headers: {
			"Authorization": `Bearer ${sessionStorage.getItem("token")}` 
		  },
		  body: formData
		})
		  .then((reponse) => {
			if (!reponse.ok) {
			  throw new Error(`Erreur lors de l'envoi du travail : ${reponse.statusText}`);
			}
			return reponse.json();
		  })
		  .then((resultat) => {
			console.log("Travail envoyé avec succès :", resultat);
	  
			// Réinitialisez le formulaire après l'envoi avec succès
			const modalForm = document.getElementById("modal-form");
			modalForm.reset();
		  })
		  .catch((erreur) => {
			console.error("Erreur lors de l'envoi du travail :", erreur);
		  });
	  } 
	afficherImages();
	boutonsCategories();
});