import { query } from './db.js';

export default async function handler(req: any, res: any) {
  try {
    console.log('Iniciando setup do banco de dados...');
    
    // Criando tabelas
    await query(`
      CREATE TABLE IF NOT EXISTS companies (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        logo_url TEXT
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS bootcamps (
        id VARCHAR(50) PRIMARY KEY,
        company_id VARCHAR(50) REFERENCES companies(id),
        title VARCHAR(100) NOT NULL,
        description TEXT,
        duration VARCHAR(50),
        location VARCHAR(100),
        status VARCHAR(50),
        tags TEXT[],
        hiring_positions INTEGER DEFAULT 0
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        bootcamp_id VARCHAR(50) REFERENCES bootcamps(id),
        status VARCHAR(50) DEFAULT 'inscrita',
        feedback TEXT
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS mentors (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(100) NOT NULL,
        bio TEXT,
        tags TEXT[],
        availability VARCHAR(100)
      );
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS community_posts (
        id VARCHAR(50) PRIMARY KEY,
        author_name VARCHAR(100) NOT NULL,
        author_role VARCHAR(100),
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        likes INTEGER DEFAULT 0,
        responses INTEGER DEFAULT 0,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Inserindo dados iniciais (apenas se estiverem vazios)
    const companyCheck = await query('SELECT count(*) FROM companies');
    const companyCount = parseInt(companyCheck.rows[0]?.count || '0');

    if (companyCount === 0) {
      console.log('Populando dados iniciais...');

      // Empresas
      await query(`
        INSERT INTO companies (id, name, description, logo_url) VALUES
        ('c1', 'Nubank', 'Uma das maiores plataformas de serviços financeiros digitais do mundo, apoiando a diversidade em tecnologia.', 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128&auto=format&fit=crop&q=60'),
        ('c2', 'Mercado Livre', 'Líder em e-commerce na América Latina, buscando ativamente talentos diversos para o time de engenharia.', 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&auto=format&fit=crop&q=60'),
        ('c3', 'iFood', 'Foodtech líder na América Latina, comprometida com a inclusão e capacitação de grupos sub-representados.', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=128&auto=format&fit=crop&q=60')
      `);

      // Bootcamps
      await query(`
        INSERT INTO bootcamps (id, company_id, title, description, duration, location, status, tags, hiring_positions) VALUES
        ('b1', 'c2', 'Fullstack Sertão', 'Domínio de ponta a ponta na web. Foco em aplicações corporativas de alta escala utilizando ecossistema moderno.', '12 Semanas', 'Remoto', 'aberto', ARRAY['React', 'Node.js', 'PostgreSQL'], 5),
        ('b2', 'c1', 'Backend com Node.js', 'Construa APIs robustas, microsserviços e entenda integrações de banco de dados para sistemas de alta demanda.', '10 Semanas', 'Híbrido - PE', 'andamento', ARRAY['Node.js', 'PostgreSQL', 'Docker'], 3),
        ('b3', 'c3', 'Design System & Acessibilidade', 'Aprenda a criar bibliotecas de componentes escaláveis e interfaces inclusivas seguindo as diretrizes WCAG.', '8 Semanas', 'Remoto', 'breve', ARRAY['Figma', 'A11y', 'React'], 2),
        ('b4', 'c2', 'Frontend Essencial', 'Construindo interfaces acessíveis, performáticas e responsivas com as melhores práticas de mercado.', '10 Semanas', 'Remoto', 'aberto', ARRAY['HTML/CSS', 'JavaScript', 'React'], 4)
      `);

      // Mentores
      await query(`
        INSERT INTO mentors (id, name, title, bio, tags, availability) VALUES
        ('m1', 'Luiza Silva', 'Engenheira de Segurança', 'Especialista em segurança defensiva com raízes em Recife. Foco em arquiteturas cloud resilientes e mentoria para grupos sub-representados em infosec.', ARRAY['Cybersecurity', 'Red Team', 'AWS'], 'Terças e Quintas'),
        ('m2', 'Carlos Mendes', 'Staff Frontend Engineer', 'Criador de interfaces acessíveis e performáticas. Ajudo desenvolvedores juniores a navegar a complexidade do ecossistema frontend moderno.', ARRAY['React', 'Acessibilidade', 'Design Systems'], 'Quartas-feiras'),
        ('m3', 'Mariana Costa', 'Data Scientist', 'Transformando dados em narrativas acionáveis. Busco mentorados interessados em construir modelos de IA que respeitem a diversidade.', ARRAY['Python', 'Machine Learning', 'Ética em IA'], 'Finais de Semana')
      `);

      // Posts
      await query(`
        INSERT INTO community_posts (id, author_name, author_role, title, content, likes, responses, tags, created_at) VALUES
        ('p1', 'Dandara Silva', 'Front-end', 'Consegui minha primeira vaga como Junior!', 'Gente, nem acredito! Depois de meses estudando React e construindo projetos no bootcamp aqui da plataforma, finalmente passei na entrevista do Mercado Livre. O processo foi duro, mas a preparação de algoritmo e os simulados de entrevista da comunidade salvaram demais. Queria agradecer a todo mundo que tirou minhas dúvidas e deu apoio moral.', 42, 15, ARRAY['Vitória', 'Primeiro Emprego'], NOW() - INTERVAL '2 hours'),
        ('p2', 'Cauã Ferreira', 'Back-end', 'Alguém manja de Docker + Postgres no Mac M1?', 'Tô agarrado numa configuração aqui pro projeto final da Trilha Back-end. O container sobe, mas o volume não tá persistindo os dados quando eu derrubo a máquina. Já tentei mudar o path no docker-compose.yml mas continua dando o mesmo erro de permissão. Alguma alma caridosa pode me dar um help?', 8, 22, ARRAY['Dúvida Técnica'], NOW() - INTERVAL '5 hours')
      `);
    }

    return res.status(200).json({ success: true, message: 'Banco de dados inicializado com sucesso!' });
  } catch (error: any) {
    console.error('Erro no setup do banco:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
