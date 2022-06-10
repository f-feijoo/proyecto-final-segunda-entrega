document.addEventListener("submit", (e) => {
  e.preventDefault();
});

async function sendPost(url) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify({
      nombre: document.querySelector("#nombre").value,
      desc: document.querySelector("#desc").value,
      img: document.querySelector("#img").value,
      precio: document.querySelector("#precio").value,
      stock: document.querySelector("#stock").value,
    }),
  })
  .then(response => response.json()) 
}

async function sendPostCarrito(url) {
  const response = await fetch(url, {
      method: 'POST'
  })
  return response.json()
  
}