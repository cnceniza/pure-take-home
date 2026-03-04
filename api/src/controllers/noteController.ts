import { Request, Response } from 'express';
import { agentStore } from '../models/agentStore';
import { NoteType } from '../models/types';

export const getNotes = async (req: Request, res: Response) => {
    const { agentId } = req.params;

    if (!agentId) {
        return res.status(400).json({ message: 'Agent ID is required' });
    }

    const notes = agentStore.getNotes(agentId as string);
    res.json(notes);
};

export const createNote = async (req: Request, res: Response) => {
    const { agentId } = req.params;
    const { propertyId, type, description, dueDate } = req.body;

    if (!agentId) {
        return res.status(400).json({ message: 'Agent ID is required' });
    }

    if (!type || !description || !dueDate) {
        return res.status(400).json({ message: 'Type, description, and dueDate are required' });
    }

    // Validate type
    if (!Object.values(NoteType).includes(type as NoteType)) {
        return res.status(400).json({ message: 'Invalid note type' });
    }

    try {
        const noteData = {
            agentId: agentId as string,
            propertyId: propertyId || null,
            type: type as NoteType,
            description,
            dueDate: new Date(dueDate)
        };

        const newNote = agentStore.addNote(agentId as string, noteData);
        if (!newNote) {
            return res.status(404).json({ message: 'Agent not found' });
        }

        res.status(201).json(newNote);
    } catch (error) {
        res.status(400).json({ message: 'Invalid date format' });
    }
};

export const updateNote = async (req: Request, res: Response) => {
    const { agentId, noteId } = req.params;
    const { propertyId, type, description, dueDate } = req.body;

    if (!agentId || !noteId) {
        return res.status(400).json({ message: 'Agent ID and Note ID are required' });
    }

    try {
        const updateData: any = {};
        if (propertyId !== undefined) updateData.propertyId = propertyId;
        if (type !== undefined) {
            if (!Object.values(NoteType).includes(type as NoteType)) {
                return res.status(400).json({ message: 'Invalid note type' });
            }
            updateData.type = type;
        }
        if (description !== undefined) updateData.description = description;
        if (dueDate !== undefined) updateData.dueDate = new Date(dueDate);

        const updatedNote = agentStore.updateNote(agentId as string, noteId as string, updateData);
        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(updatedNote);
    } catch (error) {
        res.status(400).json({ message: 'Invalid date format' });
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    const { agentId, noteId } = req.params;

    if (!agentId || !noteId) {
        return res.status(400).json({ message: 'Agent ID and Note ID are required' });
    }

    const success = agentStore.deleteNote(agentId as string, noteId as string);
    if (!success) {
        return res.status(404).json({ message: 'Note not found or could not be deleted' });
    }

    res.status(204).send();
};
