import { query } from './db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM community_posts');
      return res.status(200).json(result.rows);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { author_name, author_role, title, content, tags } = req.body;
      if (!author_name || !title || !content) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes: author_name, title, content' });
      }

      const id = 'post_' + Math.random().toString(36).substring(2, 9);
      const likes = 0;
      const responses = 0;
      const createdAt = new Date().toISOString();

      const result = await query(
        `INSERT INTO community_posts (id, author_name, author_role, title, content, likes, responses, tags, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [id, author_name, author_role || 'Estudante', title, content, likes, responses, tags || [], createdAt]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
