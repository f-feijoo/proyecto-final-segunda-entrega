document.addEventListener('submit', (e)=>{
    e.preventDefault()
})

async function sendProd(url, id) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            id: id
        })
    })
    console.log(id)
    return response.json()
    
}
    
