let cart = JSON.parse(localStorage.getItem("cart")) || [];

function show(){
    let html = "";
    let total = 0;

    cart.forEach((i, index)=>{
        html += `
        <p>
            ${i.name} ₹${i.price} x ${i.qty}
            <button onclick="inc(${index})">+</button>
            <button onclick="dec(${index})">-</button>
        </p>
        `;
        total += i.price * i.qty;
    });

    document.getElementById("cart-items").innerHTML = html;
    document.getElementById("total").innerText = "Total: ₹" + total;
}

function inc(i){ cart[i].qty++; update(); }
function dec(i){ cart[i].qty>1 ? cart[i].qty-- : cart.splice(i,1); update(); }

function update(){
    localStorage.setItem("cart", JSON.stringify(cart));
    show();
}

function placeOrder(){
    const user = localStorage.getItem("user");

    if(!user){
        alert("Login first ❌");
        return;
    }

    fetch("http://localhost:5000/place-order", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            user,
            items: cart,
            total: cart.reduce((t,i)=>t+i.price*i.qty,0),
            payment: payment.value
        })
    }).then(()=>{
        alert("Order placed ✅");
        cart=[];
        update();
    });
}

show();