import Joi from 'joi';
import { Request, Response } from 'express';
import prisma from '../models';
import { AuthRequest } from '../middleware/auth';

const taskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED').default('PENDING'),
});

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const where: any = {};

    if (req.user!.role !== 'admin') {
      where.userId = req.user!.id;
    }

    if (status) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { username: true } } },
    });

    const total = await prisma.task.count({ where });

    res.json({
      tasks,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string)),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
};

export const getTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: { user: { select: { username: true } } },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (req.user!.role !== 'admin' && task.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task.' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const taskData = {
      ...value,
      status: value.status.toUpperCase().replace('_', '_'),
      userId: req.user!.id,
    };

    const task = await prisma.task.create({
      data: taskData,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task.' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { error, value } = taskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (req.user!.role !== 'admin' && task.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id) },
      data: {
        ...value,
        status: value.status ? value.status.toUpperCase().replace('_', '_') : undefined,
      },
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task.' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id: parseInt(id) } });
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    if (req.user!.role !== 'admin' && task.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    await prisma.task.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task.' });
  }
};