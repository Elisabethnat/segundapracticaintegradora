const socket= io();
const form = document.querySelector('#formProduct');
const productsContainer = document.querySelector('#products-container');

socket.emit('load');

form.addEventListener('submit', event => {ç
    event.preventDefault();
    const dataForm = new FormData(event.target); 
    const product = Object.fromEntries(dataForm);
 
    socket.emit('newProduct', product);
    
    socket.on('mensajeProductoCreado', (mensaje)=>{
        Swal.fire(
           mensaje
        );
    })
    event.target.reset();
});