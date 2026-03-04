import { Router } from 'express';
import * as noteController from '../controllers/noteController';

const router = Router();

// These routes will be mounted at /agents/:agentId/notes
router.get('/:agentId/notes', noteController.getNotes);
router.post('/:agentId/notes', noteController.createNote);
router.put('/:agentId/notes/:noteId', noteController.updateNote);
router.delete('/:agentId/notes/:noteId', noteController.deleteNote);

export default router;
