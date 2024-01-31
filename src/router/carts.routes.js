import { Router } from 'express';
import cartModel from '../models/carts.models.js';

const cartRouter = Router();

cartRouter.get('/', async (req, res) => {
    const {limit}    = req.query
    try{
        const carts = await cartModel.find().limit(limit);
        res.status(200).send({ resultado: 'OK', message: carts });

    }catch (error) {
        res.status(400).send({error: `Error al consultar carrito: ${error}`})
    }
} );


cartRouter.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try{
        const cart = await cartModel.findById(cid);
        cart 
            ? res.status(200).send({resultado: 'OK', messag:cart})
            : res.status(404).send({resultado:'Not Found', message: cart})

    }catch (error){
        res.status(400).send ({ error:`Error al consultar carritos: ${error}`});
    }
});
cartRouter.post('/', async (req, res)=> {
    const respuesta = await cartModel.create(req.body);
    try{
        res.status(200).send({ resultado: 'OK', message: respuesta });
        
    } catch(error){
        res.status(400).send ({ error:`Error al crear carritos: ${error}`});
    }
});


cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
       
        const cart = await cartModel.findByIdAndUpdate(cid);
        !cart ?  res.status(404).send({ resultado: 'Cart not found' }) : ""
        
      
        const prodIndex = cart.products.findIndex(prod => prod.id_prod.toString() === pid);

        prodIndex !== -1 ?
            
            cart.products[prodIndex].quantity += Number(quantity):
            
            cart.products.push({ id_prod: pid, quantity });

     
        await cart.save();

        res.status(200).send({ resultado: 'OK', message: cart });
    } catch (error) {
        res.status(400).send({ error: `Error al agregar productos: ${error}` });
    }
});


cartRouter.put('/:cid', async (req, res) => {
	const { cid } = req.params;
	const { updateProducts } = req.body;

	try {
		const cart = await cartModel.findById(cid);
		updateProducts.forEach(prod => {
			const productExists = cart.products.find(cartProd => cartProd.id_prod.toString() == prod.id_prod);
			productExists ?	productExists.quantity += prod.quantity
                          : cart.products.push(prod);			
		});
		await cart.save();
		cart
			? res.status(200).send({ resultado: 'OK', message: cart })
			: res.status(404).send({ resultado: 'Not Found', message: cart });
	} catch (error) {
		res.status(400).send({ error: `Error al agregar productos: ${error}` });
	}
});


cartRouter.delete('/:cid/products/:pid', async (req, res) => {
	const { cid, pid } = req.params;

	try {
		const cart = await cartModel.findById(cid);
		if (cart) {
			const productIndex = cart.products.findIndex(prod => prod.id_prod == pid);
			let deletedProduct;
			if (productIndex !== -1) {
				deletedProduct = cart.products[productIndex];
				cart.products.splice(productIndex, 1);
			} else {
				res.status(404).send({ resultado: 'Product Not Found', message: cart });
				return;
			};

			await cart.save();
			res.status(200).send({ resultado: 'OK', message: deletedProduct });
            
		} else {
			res.status(404).send({ resultado: 'Cart Not Found', message: cart });
		}
	} catch (error) {
		res.status(400).send({ error: `Error al eliminar producto: ${error}` });
	}
});


cartRouter.delete('/:id', async (req, res) => {
    const { id } = req.params
    try {
        const cart = await cartModel.findById(id)
        if (!cart) {
            res.status(404).send({ result: 'Cart not found', message: cart })
        }
        cart.products = []
        await cart.save()
        res.status(200).send({ result: 'OK', message: cart })
    } catch (error) {
        res.status(400).send({ error: `Error al vaciar carrito: ${cart}` })
    }
})

export default cartRouter;