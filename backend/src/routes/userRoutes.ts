import express, {Router} from 'express'
import UserController from '../controllers/userController'

const router: Router = express.Router()
const userController = new UserController()

router.get('/list-all', userController.listUser)
router.post('/login', userController.addUser)

export default router