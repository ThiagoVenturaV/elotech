import { query } from './db.js';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Obter todas as candidaturas (Painel Admin)
  if (req.method === 'GET') {
    try {
      const result = await query('SELECT * FROM applications');
      return res.status(200).json(result.rows);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Realizar inscrição
  if (req.method === 'POST') {
    try {
      const { user_name, email, bootcamp_id } = req.body;
      if (!user_name || !email || !bootcamp_id) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes: user_name, email, bootcamp_id' });
      }

      const id = 'app_' + Math.random().toString(36).substring(2, 9);
      const userId = 'usr_' + Math.random().toString(36).substring(2, 9);
      const status = 'inscrita';
      const feedback = 'Inscrição submetida. Aguardando início das aulas.';

      const result = await query(
        `INSERT INTO applications (id, user_id, user_name, email, bootcamp_id, status, feedback) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [id, userId, user_name, email, bootcamp_id, status, feedback]
      );

      return res.status(201).json(result.rows[0]);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Atualizar status de contratação ou progresso (Painel Admin)
  if (req.method === 'PUT') {
    try {
      const { id, status, feedback } = req.body;
      if (!id || !status) {
        return res.status(400).json({ error: 'Campos obrigatórios: id, status' });
      }

      const result = await query(
        'UPDATE applications SET status = $1, feedback = $2 WHERE id = $3 RETURNING *',
        [status, feedback || '', id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Inscrição não encontrada' });
      }

      return res.status(200).json(result.rows[0]);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
}
