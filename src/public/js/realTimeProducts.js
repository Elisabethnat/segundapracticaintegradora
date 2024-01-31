const socket= io();
const form = document.querySelector('#formProduct');
const productsContainer = document.querySelector('#products-container');

socket.emit('load');

form.addEventListener('submit', event => {ç
    event.preventDefault();
    const dataForm = new FormData(event.target); // captura lo que se agrega en el form
    const product = Object.fromEntries(dataForm);//dado un objeto iterable, devuelve datos en un objeto simple
    //captura el producto y lo envia 
    socket.emit('newProduct', product);
    //Recibe msj del servidor
    socket.on('mensajeProductoCreado', (mensaje)=>{
        Swal.fire(
           mensaje
        );
    })
    event.target.reset();
});