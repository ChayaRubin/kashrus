import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { z } from 'zod';

const router = Router();

const CreateRestaurant = z.object({
  name: z.string().min(1),
  level: z.enum(['FIRST','SECOND','THIRD']),
  city: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  hechsher: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).default([]), // defaults to []
  website: z.string().url().optional()
});

router.get('/', async (req, res, next) => {
  try {
    const where = req.query.level ? { level: req.query.level } : {};
    const items = await prisma.restaurant.findMany({
      where,
      orderBy: { name: 'asc' },
      select: { id:true, name:true, level:true, city:true, hechsher:true, images:true }
    });
    res.json(items);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.restaurant.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const data = CreateRestaurant.parse(req.body);
    const created = await prisma.restaurant.create({ data });
    res.status(201).json(created);
  } catch (e) { next(e); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = CreateRestaurant.partial().parse(req.body);
    const updated = await prisma.restaurant.update({ where: { id }, data });
    res.json(updated);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.restaurant.delete({ where: { id }});
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
