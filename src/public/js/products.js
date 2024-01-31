const productsContainer = document.querySelector('#products-container');

const listarProd = (products)=>{
      alert ("pepe")
	products.forEach(prod => {
		productsContainer.innerHTML += `
    <div class="product-container">
        <p>Title: ${prod.title}</p>
        <p>Description: ${prod.description}</p>
        <p>Price: ${prod.price}</p>
        <p>Status: ${prod.status}</p>
        <p>Code: ${prod.code}</p>
        <p>Stock: ${prod.stock}</p>
    
        </div>
    
        `;
	})
}