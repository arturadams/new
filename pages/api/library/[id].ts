import type { NextApiRequest, NextApiResponse } from 'next';
import { store } from '../../../lib/dataStore';

/**
 * @swagger
 * /api/library/{id}:
 *   get:
 *     description: Get a single record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Stored record
 *       404:
 *         description: Not found
 *   put:
 *     description: Update a record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated record
 *       404:
 *         description: Not found
 *   delete:
 *     description: Delete a record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Not found
 */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };

  if (req.method === 'GET') {
    const record = store.get(id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(record);
  }

  if (req.method === 'PUT') {
    const update = req.body as any;
    const record = store.update(id, update);
    if (!record) return res.status(404).json({ message: 'Not found' });
    return res.status(200).json(record);
  }

  if (req.method === 'DELETE') {
    const deleted = store.remove(id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
