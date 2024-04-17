import Router from 'koa-router';
import { articlesController, userController } from 'src/controllers';

const router = new Router();

router.get('/articles', articlesController.getArticles);
router.post('/articles', articlesController.addArticles);
router.put('/articles/:id', articlesController.editArticles);
router.delete('/articles/:id', articlesController.deleteArticles);

router.post('/register', userController.accountRegister)
router.post('/login', userController.accountLogin)

export default router;