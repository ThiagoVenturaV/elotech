#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Script de população de banco de dados para a EloTech.
Preenche as tabelas do NeonDB (PostgreSQL) com dados realistas da Região Nordeste baseados no diagnóstico de empregabilidade.
Sem emojis no código ou nos textos.
"""

import sys

# IMPORTANTE: Caso não possua o psycopg2 instalado, execute:
# pip install psycopg2-binary
try:
    import psycopg2
except ImportError:
    print("Erro: A biblioteca 'psycopg2' não está instalada.")
    print("Por favor, execute no seu terminal: pip install psycopg2-binary")
    sys.exit(1)

# ==============================================================================
# INSIRA SUA CONNECTION STRING DO NEONDB AQUI:
# Exemplo: "postgresql://usuario:senha@ep-nome-servidor.us-east-2.aws.neon.tech/neondb?sslmode=require"
# ==============================================================================
NEON_DATABASE_URL = "postgresql://neondb_owner:npg_M5Wg3QdmTejv@ep-twilight-silence-at9n1fo0-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

def get_connection():
    if NEON_DATABASE_URL == "SUA_CONNECTION_STRING_AQUI" or not NEON_DATABASE_URL:
        print("Erro: Por favor, configure a variável NEON_DATABASE_URL com a sua connection string.")
        sys.exit(1)
    
    try:
        conn = psycopg2.connect(NEON_DATABASE_URL)
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao NeonDB: {e}")
        sys.exit(1)

def populate_database():
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        print("Criando tabelas caso nao existam...")
        cur.execute("""
            CREATE TABLE IF NOT EXISTS companies (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                logo_url TEXT
            );
        """)
        cur.execute("""
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
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id VARCHAR(50) PRIMARY KEY,
                user_id VARCHAR(50) NOT NULL,
                user_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                bootcamp_id VARCHAR(50) REFERENCES bootcamps(id),
                status VARCHAR(50) DEFAULT 'inscrita',
                feedback TEXT
            );
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS mentors (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                title VARCHAR(100) NOT NULL,
                bio TEXT,
                tags TEXT[],
                availability VARCHAR(100)
            );
        """)
        cur.execute("""
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
        """)
        
        print("Iniciando limpeza e populacao do banco de dados...")
        
        # 1. Limpar tabelas existentes em cascata
        print("Limpando dados antigos...")
        cur.execute("TRUNCATE TABLE applications, bootcamps, companies, mentors, community_posts CASCADE;")
        
        # 2. Inserir Empresas Parceiras (Companies)
        print("Inserindo empresas parceiras...")
        companies = [
            (
                "c1",
                "Nubank",
                "Uma das maiores fintechs da America Latina com forte atuacao em inclusao no ecossistema digital nacional, oferecendo vagas de engenharia remotas e hibridas.",
                "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=128&auto=format&fit=crop&q=60"
            ),
            (
                "c2",
                "Mercado Livre",
                "Lider de e-commerce e pagamentos digitais na America Latina. Apoia de forma ativa a contratacao afirmativa no Nordeste brasileiro.",
                "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=128&auto=format&fit=crop&q=60"
            ),
            (
                "c3",
                "iFood",
                "Foodtech lider que investe no fomento da educacao de tecnologia para grupos vulneraveis e no desenvolvimento de software de alta performance.",
                "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=128&auto=format&fit=crop&q=60"
            ),
            (
                "c4",
                "Porto Digital Corporativo",
                "Hub corporativo localizado em Recife que integra empresas do maior parque tecnologico urbano da America Latina, estimulando inovacao e diversidade local.",
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=60"
            ),
            (
                "c5",
                "Iracema Software Hub",
                "Empresa cearense parceira do hub Iracema Digital que atua no desenvolvimento de IA e soluções para grandes empresas de telecomunicacao.",
                "https://images.unsplash.com/photo-1551434678-e076c223a692?w=128&auto=format&fit=crop&q=60"
            )
        ]
        cur.executemany(
            "INSERT INTO companies (id, name, description, logo_url) VALUES (%s, %s, %s, %s);",
            companies
        )
        
        # 3. Inserir Bootcamps
        print("Inserindo bootcamps...")
        bootcamps = [
            (
                "b1",
                "c4",
                "Fullstack Sertao",
                "Dominio de ponta a ponta na web. Projeto focado na descentralizacao e qualificacao de pessoas do interior do Nordeste, integrando React e Node.js.",
                "12 Semanas",
                "Remoto",
                "aberto",
                ["React", "Node.js", "PostgreSQL", "TypeScript"],
                5
            ),
            (
                "b2",
                "c1",
                "Backend com Node.js",
                "Construcao de APIs robustas, arquitetura de microsservicos resilientes e bancos de dados transacionais complexos com PostgreSQL.",
                "10 Semanas",
                "Hibrido - PE",
                "andamento",
                ["Node.js", "PostgreSQL", "Docker", "REST API"],
                3
            ),
            (
                "b3",
                "c3",
                "Design System & Acessibilidade",
                "Desenvolvimento de componentes escalaveis com foco na conformidade com as diretrizes de acessibilidade WCAG, priorizando interfaces inclusivas.",
                "8 Semanas",
                "Remoto",
                "breve",
                ["Figma", "A11y", "React", "CSS Grid"],
                2
            ),
            (
                "b4",
                "c2",
                "Frontend Essencial",
                "Aulas praticas voltadas para HTML, CSS avancado, Javascript moderno e conceitos basicos de frameworks JavaScript.",
                "10 Semanas",
                "Remoto",
                "aberto",
                ["HTML/CSS", "JavaScript", "React", "Git"],
                4
            ),
            (
                "b5",
                "c5",
                "Dados e Diversidade Ceara",
                "Introducao a analise de dados com linguagens de programacao cientifica aplicadas a estudos sociais e corporativos no ecossistema Iracema.",
                "12 Semanas",
                "Remoto",
                "aberto",
                ["Python", "Pandas", "SQL", "Analise de Dados"],
                3
            ),
            (
                "b6",
                "c4",
                "Porto Digital Java Stack",
                "Treinamento corporativo de programacao orientada a objetos com foco no desenvolvimento corporativo do parque tecnologico de Recife.",
                "14 Semanas",
                "Hibrido - PE",
                "breve",
                ["Java", "Spring Boot", "SQL", "Hibernate"],
                6
            )
        ]
        cur.executemany(
            "INSERT INTO bootcamps (id, company_id, title, description, duration, location, status, tags, hiring_positions) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
            bootcamps
        )
        
        # 4. Inserir Mentoras (Mentors)
        print("Inserindo mentoras...")
        mentors = [
            (
                "m1",
                "Luiza Silva",
                "Engenheira de Seguranca",
                "Especialista em seguranca defensiva baseada em Recife. Foco em arquiteturas cloud resilientes e mentoria especial para a populacao trans no Porto Digital.",
                ["Cybersecurity", "Red Team", "AWS", "Linux"],
                "Terças e Quintas"
            ),
            (
                "m2",
                "Carlos Mendes",
                "Staff Frontend Engineer",
                "Criador de interfaces acessiveis e de alta escala. Orienta pessoas desenvolvedoras iniciantes no ecossistema do Porto Digital e corporacoes associadas.",
                ["React", "Acessibilidade", "Design Systems", "Web Performance"],
                "Quartas-feiras"
            ),
            (
                "m3",
                "Mariana Costa",
                "Data Scientist",
                "Cientista de dados em Fortaleza dedicada a modelagem ética e analise demografica de grupos sub-representados em tecnologia.",
                ["Python", "Machine Learning", "Etica em IA", "Pandas"],
                "Finais de Semana"
            ),
            (
                "m4",
                "Thina Rodrigues",
                "Analista de Sistemas Pleno",
                "Especialista cearense com forte atuacao em qualificacao profissional e suporte tecnico na integracao de APIs.",
                ["Python", "PostgreSQL", "Linux", "Docker"],
                "Segundas e Quartas"
            ),
            (
                "m5",
                "Janaina Dutra",
                "DevOps Engineer",
                "Especialista em infraestrutura em nuvem, CI/CD pipelines e automacoes de servidores para startups do Parque Tecnologico da Bahia.",
                ["CI/CD", "Docker", "Kubernetes", "AWS"],
                "Sextas-feiras"
            )
        ]
        cur.executemany(
            "INSERT INTO mentors (id, name, title, bio, tags, availability) VALUES (%s, %s, %s, %s, %s, %s);",
            mentors
        )
        
        # 5. Inserir Candidaturas (Applications)
        print("Inserindo candidaturas e historico de empregabilidade...")
        applications = [
            (
                "app1",
                "usr1",
                "Dandara Silva",
                "dandara.silva@elotech.com",
                "b1",
                "contratada",
                "Contratada no time do Mercado Livre como Desenvolvedora Fullstack Jr com excelente avaliacao final no bootcamp Fullstack Sertao."
            ),
            (
                "app2",
                "usr2",
                "Caua Ferreira",
                "caua.ferreira@elotech.com",
                "b2",
                "cursando",
                "Aluna cursando ativamente o modulo de Docker e Postgres no bootcamp Backend com Node.js."
            ),
            (
                "app3",
                "usr3",
                "Maria S.",
                "maria.s@elotech.com",
                "b4",
                "contratada",
                "Aprovada no processo de recrutamento da Nubank como Dev Frontend apos a conclusao do bootcamp Frontend Essencial."
            ),
            (
                "app4",
                "usr4",
                "Luiza Mota",
                "luiza.mota@elotech.com",
                "b3",
                "inscrita",
                "Inscricao confirmada. Aguardando a liberacao dos acessos da plataforma para inicio das aulas de Design System."
            ),
            (
                "app5",
                "usr5",
                "Beto C.",
                "beto.c@elotech.com",
                "b5",
                "concluida",
                "Bootcamp de Dados e Diversidade finalizado. Aguardando a agenda de entrevistas da Iracema Software Hub."
            ),
            (
                "app6",
                "usr6",
                "Alice Pereira",
                "alice.pereira@elotech.com",
                "b1",
                "cursando",
                "Cursando modulo de API Rest com Node.js e apresentando otimo desempenho nos labs do Porto Digital."
            )
        ]
        cur.executemany(
            "INSERT INTO applications (id, user_id, user_name, email, bootcamp_id, status, feedback) VALUES (%s, %s, %s, %s, %s, %s, %s);",
            applications
        )
        
        # 6. Inserir Posts da Comunidade (Community Posts)
        print("Inserindo postagens no forum da comunidade...")
        posts = [
            (
                "p1",
                "Dandara Silva",
                "Front-end Jr",
                "Consegui minha primeira vaga como Junior!",
                "Nem acredito que deu certo. Depois de meses estudando no bootcamp da EloTech e com a preparacao e simulados que fiz com as mentoras do Porto Digital, passei na entrevista de engenharia do Mercado Livre. O processo foi duro, mas o apoio da guilda fez toda a diferenca. Obrigada a todas que responderam minhas duvidas!",
                45,
                18,
                ["Vitoria", "Primeiro Emprego"],
                "2026-06-27T10:00:00Z"
            ),
            (
                "p2",
                "Caua Ferreira",
                "Back-end Estudante",
                "Alguem manja de Docker + Postgres no Mac M1?",
                "Estou com uma configuracao bloqueante no projeto final da Trilha Back-end. O container sobe, mas o volume local nao persiste quando derrubo a maquina. Ja tentei ajustar a permissao e o caminho do docker-compose.yml mas o erro persiste. Alguem do Nordeste ja passou por isso rodando local?",
                12,
                24,
                ["Duvida Tecnica"],
                "2026-06-27T08:00:00Z"
            ),
            (
                "p3",
                "Samara Oliveira",
                "DevOps Iniciante",
                "Parceria de TI e Porto Digital: Faculdade Senac",
                "Gente, fiquem de olho nas bolsas afirmativas que estao saindo para o Porto Digital. Consegui uma bolsa integral gracas a divulgacao aqui no forum. Isso ajuda muito a manter os estudos de infraestrutura. Alguem mais aqui vai participar do processo?",
                28,
                9,
                ["Geral", "Oportunidade"],
                "2026-06-26T14:30:00Z"
            ),
            (
                "p4",
                "Clara Menezes",
                "Estudante de Dados",
                "Desafio do Trabalho Remoto: Infraestrutura no interior",
                "Moro no interior da Paraiba e o maior desafio para atuar como Dev remota e a estabilidade da internet de alta velocidade. Consegui a bolsa permanente de Kit Digital da EloTech e isso salvou meus estudos de analise de dados. Alguem mais tem dicas para otimizar conexao?",
                33,
                15,
                ["Duvida Tecnica", "Geral"],
                "2026-06-25T11:15:00Z"
            )
        ]
        cur.executemany(
            "INSERT INTO community_posts (id, author_name, author_role, title, content, likes, responses, tags, created_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
            posts
        )
        
        conn.commit()
        print("Banco de dados populado com sucesso!")
        
    except Exception as e:
        conn.rollback()
        print(f"Erro ao popular o banco de dados: {e}")
        
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    populate_database()