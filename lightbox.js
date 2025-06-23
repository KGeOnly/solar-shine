// Image Filter Script
document.querySelectorAll('.filters button').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.project').forEach(item => {
      item.style.display = (filter === 'all' || item.classList.contains(filter)) ? 'block' : 'none';
    });
  });
});

// Lightbox Script
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

const imgs = document.querySelectorAll('.project img');
imgs.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.innerHTML = '';
    const imgClone = img.cloneNode();
    lightbox.appendChild(imgClone);
    lightbox.style.display = 'flex';
  });
});

lightbox.addEventListener('click', () => {
  lightbox.style.display = 'none';
});
