import pg from 'pg';

const { Pool } = pg;

// Banco de dados em memória para quando o NeonDB não estiver configurado
let mockDb: {
  companies: any[];
  bootcamps: any[];
  applications: any[];
  mentors: any[];
  community_posts: any[];
} = {
  companies: [
    {
      id: 'c1',
      name: 'Nubank',
      description: 'Uma das maiores plataformas de serviços financeiros digitais do mundo, apoiando a diversidade em tecnologia.',
      logo_url: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128&auto=format&fit=crop&q=60'
    },
    {
      id: 'c2',
      name: 'Mercado Livre',
      description: 'Líder em e-commerce na América Latina, buscando ativamente talentos diversos para o time de engenharia.',
      logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&auto=format&fit=crop&q=60'
    },
    {
      id: 'c3',
      name: 'iFood',
      description: 'Foodtech líder na América Latina, comprometida com a inclusão e capacitação de grupos sub-representados.',
      logo_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=128&auto=format&fit=crop&q=60'
    }
  ],
  bootcamps: [
    {
      id: 'b1',
      company_id: 'c2',
      title: 'Fullstack Sertão',
      description: 'Domínio de ponta a ponta na web. Foco em aplicações corporativas de alta escala utilizando ecossistema moderno.',
      duration: '12 Semanas',
      location: 'Remoto',
      status: 'aberto', // aberto, andamento, breve
      tags: ['React', 'Node.js', 'PostgreSQL'],
      hiring_positions: 5
    },
    {
      id: 'b2',
      company_id: 'c1',
      title: 'Backend com Node.js',
      description: 'Construa APIs robustas, microsserviços e entenda integrações de banco de dados para sistemas de alta demanda.',
      duration: '10 Semanas',
      location: 'Híbrido - PE',
      status: 'andamento',
      tags: ['Node.js', 'PostgreSQL', 'Docker'],
      hiring_positions: 3
    },
    {
      id: 'b3',
      company_id: 'c3',
      title: 'Design System & Acessibilidade',
      description: 'Aprenda a criar bibliotecas de componentes escaláveis e interfaces inclusivas seguindo as diretrizes WCAG.',
      duration: '8 Semanas',
      location: 'Remoto',
      status: 'breve',
      tags: ['Figma', 'A11y', 'React'],
      hiring_positions: 2
    },
    {
      id: 'b4',
      company_id: 'c2',
      title: 'Frontend Essencial',
      description: 'Construindo interfaces acessíveis, performáticas e responsivas com as melhores práticas de mercado.',
      duration: '10 Semanas',
      location: 'Remoto',
      status: 'aberto',
      tags: ['HTML/CSS', 'JavaScript', 'React'],
      hiring_positions: 4
    }
  ],
  applications: [],
  mentors: [
    {
      id: 'm1',
      name: 'Luiza Silva',
      title: 'Engenheira de Segurança',
      bio: 'Especialista em segurança defensiva com raízes em Recife. Foco em arquiteturas cloud resilientes e mentoria para grupos sub-representados em infosec.',
      tags: ['Cybersecurity', 'Red Team', 'AWS'],
      availability: 'Terças e Quintas'
    },
    {
      id: 'm2',
      name: 'Carlos Mendes',
      title: 'Staff Frontend Engineer',
      bio: 'Criador de interfaces acessíveis e performáticas. Ajudo desenvolvedores juniores a navegar a complexidade do ecossistema frontend moderno.',
      tags: ['React', 'Acessibilidade', 'Design Systems'],
      availability: 'Quartas-feiras'
    },
    {
      id: 'm3',
      name: 'Mariana Costa',
      title: 'Data Scientist',
      bio: 'Transformando dados em narrativas acionáveis. Busco mentorados interessados em construir modelos de IA que respeitem a diversidade.',
      tags: ['Python', 'Machine Learning', 'Ética em IA'],
      availability: 'Finais de Semana'
    }
  ],
  community_posts: [
    {
      id: 'p1',
      author_name: 'Dandara Silva',
      author_role: 'Front-end',
      title: 'Consegui minha primeira vaga como Junior!',
      content: 'Gente, nem acredito! Depois de meses estudando React e construindo projetos no bootcamp aqui da plataforma, finalmente passei na entrevista do Mercado Livre. O processo foi duro, mas a preparação de algoritmo e os simulados de entrevista da comunidade salvaram demais. Queria agradecer a todo mundo que tirou minhas dúvidas e deu apoio moral.',
      likes: 42,
      responses: 15,
      tags: ['Vitória', 'Primeiro Emprego'],
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2h atrás
    },
    {
      id: 'p2',
      author_name: 'Cauã Ferreira',
      author_role: 'Back-end',
      title: 'Alguém manja de Docker + Postgres no Mac M1?',
      content: 'Tô agarrado numa configuração aqui pro projeto final da Trilha Back-end. O container sobe, mas o volume não tá persistindo os dados quando eu derrubo a máquina. Já tentei mudar o path no docker-compose.yml mas continua dando o mesmo erro de permissão. Alguma alma caridosa pode me dar um help?',
      likes: 8,
      responses: 22,
      tags: ['Dúvida Técnica'],
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5h atrás
    }
  ]
};

// Carregar variáveis do .env caso existam
import dotenv from 'dotenv';
dotenv.config();

const useRealDb = !!process.env.DATABASE_URL;

let pool: any = null;

if (useRealDb) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// Interface de Query compatível
export async function query(text: string, params?: any[]) {
  if (useRealDb && pool) {
    try {
      const result = await pool.query(text, params);
      return result;
    } catch (error) {
      console.error('Erro na query do NeonDB, caindo de volta para mock:', error);
      // Fallback para mock se der erro no banco real
    }
  }

  // Lógica do Mock DB local
  console.log(`[MOCK DB] Executando query simulada: ${text.substring(0, 100)}...`);
  
  const textLower = text.toLowerCase();
  
  if (textLower.includes('select * from companies') || textLower.includes('select * from "companies"')) {
    return { rows: mockDb.companies };
  }
  
  if (textLower.includes('select * from bootcamps') || textLower.includes('select * from "bootcamps"')) {
    // Retornar bootcamps com informações de company
    const result = mockDb.bootcamps.map(b => {
      const company = mockDb.companies.find(c => c.id === b.company_id);
      return { ...b, company_name: company ? company.name : 'Empresa Parceira', company_logo: company ? company.logo_url : '' };
    });
    return { rows: result };
  }
  
  if (textLower.includes('select * from mentors') || textLower.includes('select * from "mentors"')) {
    return { rows: mockDb.mentors };
  }

  if (textLower.includes('select * from community_posts') || textLower.includes('select * from "community_posts"')) {
    // Ordenar posts por data de criação descrescente
    const sorted = [...mockDb.community_posts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return { rows: sorted };
  }

  if (textLower.includes('select * from applications') || textLower.includes('select * from "applications"')) {
    const result = mockDb.applications.map(app => {
      const bootcamp = mockDb.bootcamps.find(b => b.id === app.bootcamp_id);
      const company = bootcamp ? mockDb.companies.find(c => c.id === bootcamp.company_id) : null;
      return {
        ...app,
        bootcamp_title: bootcamp ? bootcamp.title : 'Bootcamp',
        company_name: company ? company.name : 'Empresa'
      };
    });
    return { rows: result };
  }

  // INSERTs
  if (textLower.includes('insert into applications') || textLower.includes('insert into "applications"')) {
    // Exemplo: INSERT INTO applications (id, user_id, bootcamp_id, status, feedback) VALUES ($1, $2, $3, $4, $5) RETURNING *
    const id = params?.[0] || 'app_' + Math.random().toString(36).substring(2, 9);
    const userId = params?.[1] || 'user_1';
    const userName = params?.[2] || 'Candidata Trans';
    const email = params?.[3] || 'candidata@elotech.com';
    const bootcampId = params?.[4] || 'b1';
    const status = params?.[5] || 'inscrita';
    const feedback = params?.[6] || 'Inscrição submetida com sucesso';

    const newApp = { id, user_id: userId, user_name: userName, email, bootcamp_id: bootcampId, status, feedback };
    mockDb.applications.push(newApp);
    return { rows: [newApp] };
  }

  if (textLower.includes('insert into community_posts') || textLower.includes('insert into "community_posts"')) {
    // INSERT INTO community_posts(id, author_name, author_role, title, content, likes, responses, tags, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
    const id = params?.[0] || 'post_' + Math.random().toString(36).substring(2, 9);
    const authorName = params?.[1] || 'Membro da EloTech';
    const authorRole = params?.[2] || 'Estudante';
    const title = params?.[3] || 'Sem título';
    const content = params?.[4] || '';
    const likes = params?.[5] || 0;
    const responses = params?.[6] || 0;
    const tags = params?.[7] || [];
    const createdAt = params?.[8] || new Date().toISOString();

    const newPost = { id, author_name: authorName, author_role: authorRole, title, content, likes, responses, tags, created_at: createdAt };
    mockDb.community_posts.push(newPost);
    return { rows: [newPost] };
  }

  if (textLower.includes('update applications') || textLower.includes('update "applications"')) {
    // UPDATE applications SET status = $1 WHERE id = $2 RETURNING *
    const status = params?.[0];
    const id = params?.[1];
    const appIndex = mockDb.applications.findIndex(a => a.id === id);
    if (appIndex !== -1) {
      mockDb.applications[appIndex].status = status;
      return { rows: [mockDb.applications[appIndex]] };
    }
    return { rows: [] };
  }

  return { rows: [] };
}
