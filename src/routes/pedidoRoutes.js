import { Router } from 'express';
import * as pedidoController from '../controllers/pedidoController.js';
import autenticar from '../middlewares/autenticar.js';

const router = Router();

// Todas as rotas de pedido exigem login; as que usam :id também conferem o dono no service
router.use(autenticar);

router.post('/', pedidoController.cadastrar);               // logado
router.get('/', pedidoController.listar);                   // logado (só os pedidos de quem está logado)
router.get('/:id', pedidoController.detalhar);              // dono
router.patch('/:id', pedidoController.editar);              // dono
router.delete('/:id', pedidoController.remover);            // dono
router.patch('/:id/status', pedidoController.mudarStatus);  // dono
router.patch('/:id/cancelar', pedidoController.cancelar);   // logado + conferência de dono
router.patch('/:id/devolucao', pedidoController.devolver);  // dono

export default router;
