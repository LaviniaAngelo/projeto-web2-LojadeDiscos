
import { Router } from 'express';
import * as discoController from '../controllers/discoController.js';
import autenticar from '../middlewares/autenticar.js';

const router = Router();

router.get('/', discoController.listar);                      // aberto
router.get('/:id', discoController.detalhar);                 // aberto
router.post('/', autenticar, discoController.cadastrar);      // logado
router.patch('/:id', autenticar, discoController.editar);     // dono
router.delete('/:id', autenticar, discoController.remover);   // dono

export default router;
