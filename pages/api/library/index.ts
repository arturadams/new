import type { NextApiRequest, NextApiResponse } from 'next';
import { store, StoredRecord } from '../../../lib/dataStore';

/**
 * @swagger
 * /api/library:
 *   get:
 *     description: List all stored records.
 *     responses:
 *       200:
 *         description: Array of stored records
 *   post:
 *     description: Store a new record. Accepts JSON payload.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               type:
 *                 type: string
 *               payload:
 *                 type: object
 *     responses:
 *       200:
 *         description: Stored record
 *   delete:
 *     description: Remove all records.
 *     responses:
 *       204:
 *         description: Cleared
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, type, payload } = req.body as Omit<StoredRecord, 'receivedAt'>;
    if (!id || !type) {
      return res.status(400).json({ message: 'id and type are required' });
    }
    const entry = await store.add({ id, type, payload });
    return res.status(200).json(entry);
  }

  if (req.method === 'GET') {
    const data = await store.list();
    return res.status(200).json(data);
  }

  if (req.method === 'DELETE') {
    await store.clear();
    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
