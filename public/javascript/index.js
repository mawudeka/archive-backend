const modal = document.querySelector('.modal-div');
const modalBtn = document.querySelector('.modal-btn');
const overlay = document.querySelector('.overlay');
const confirmBtn = document.querySelector('.confirm-btn');

function openModal() {
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
}

function closeModal() {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
}

confirmBtn.addEventListener('click', openModal);
modalBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
