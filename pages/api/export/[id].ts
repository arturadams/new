import type { NextApiRequest, NextApiResponse } from 'next';
import { store } from '../../../lib/dataStore';
import { toPlainText, toMarkdown } from '../../../lib/exporters';

/**
 * @swagger
 * /api/export/{id}:
 *   get:
 *     description: Export a record in various formats.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         required: false
 *         schema:
 *           type: string
 *           enum: [json, text, markdown]
 *     responses:
 *       200:
 *         description: Exported data
 *       404:
 *         description: Not found
 */

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query as { id: string };
  const format = (req.query.format as string) || 'json';
  const record = store.get(id);
  if (!record) return res.status(404).json({ message: 'Not found' });

  if (format === 'text') {
    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(toPlainText(record));
  }

  if (format === 'markdown') {
    res.setHeader('Content-Type', 'text/markdown');
    return res.status(200).send(toMarkdown(record));
  }

  res.status(200).json(record);
}
