fetch("http://localhost:5000/products")
.then(res => res.json())
.then(data => {
    const container = document.getElementById("product-list");

    data.forEach(p => {
        container.innerHTML += `
            <div class="product">
                <h3>${p.name}</h3>
                <img src="${p.image}">
                <p>₹${p.price}</p>
                <button onclick="add('${p.name}', ${p.price})">Add</button>
            </div>
        `;
    });
});

function add(name, price){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const exist = cart.find(i => i.name === name);

    if(exist) exist.qty++;
    else cart.push({name, price, qty:1});

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added 🛒");
}