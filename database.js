/* ==========================================================================
   FINANCEIRO GFM - DATABASE PERSISTENCE LAYER
   Rádio Grande FM 94.5
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Initial Mock Seed Data
const DEFAULT_DATA = {
    collaborators: [
        {
            id: '1',
            code: '01',
            name: 'Carlos Eduardo Oliveira',
            email: 'carlos.eduardo@grandefm.com.br',
            cpf: '123.456.789-00',
            role: 'Locutor Principal / Apresentador',
            dept: 'Programação',
            salary: 6800.00,
            hireDate: '2021-03-15',
            status: 'Ativo',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: '2',
            code: '02',
            name: 'Mariana Alves Prado',
            email: 'mariana.alves@grandefm.com.br',
            cpf: '234.567.890-11',
            role: 'Gerente Comercial de Vendas',
            dept: 'Comercial',
            salary: 8500.00,
            hireDate: '2020-08-01',
            status: 'Ativo',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: '3',
            code: '03',
            name: 'Roberto Santos Silva',
            email: 'roberto.santos@grandefm.com.br',
            cpf: '345.678.901-22',
            role: 'Engenheiro de Som & Transmissão',
            dept: 'Técnico & Som',
            salary: 5400.00,
            hireDate: '2019-11-10',
            status: 'Ativo',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: '4',
            code: '04',
            name: 'Fernanda Lima Castro',
            email: 'fernanda.lima@grandefm.com.br',
            cpf: '456.789.012-33',
            role: 'Jornalista & Repórter de Campo',
            dept: 'Jornalismo',
            salary: 4900.00,
            hireDate: '2022-05-20',
            status: 'Férias',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: '5',
            code: '05',
            name: 'Lucas Mendes Rocha',
            email: 'lucas.mendes@grandefm.com.br',
            cpf: '567.890.123-44',
            role: 'Operador de Áudio & Vinhetas',
            dept: 'Programação',
            salary: 3800.00,
            hireDate: '2023-01-10',
            status: 'Ativo',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: '6',
            code: '06',
            name: 'Juliana Prado Ribeiro',
            email: 'juliana.prado@grandefm.com.br',
            cpf: '678.901.234-55',
            role: 'Analista Financeiro Sênior',
            dept: 'Financeiro',
            salary: 5600.00,
            hireDate: '2021-09-01',
            status: 'Ativo',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
        }
    ],
    clients: [
        {
            id: 'c1',
            name: 'Supermercados Dourados Ltda',
            cnpj: '11.222.333/0001-44',
            email: 'comercial@superdourados.com.br',
            phone: '(67) 3411-9000',
            segment: 'Comércio Local',
            value: 12500.00,
            executive: '02',
            commission: 10.0,
            executives: [
                { executive: '02', commission: 10.0 }
            ],
            startDate: '2025-02-01',
            endDate: '2027-02-01',
            status: 'Ativo',
            logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: 'c2',
            name: 'Concessionária AutoVale Dourados',
            cnpj: '22.333.444/0001-55',
            email: 'marketing@autovale.com.br',
            phone: '(67) 3422-5500',
            segment: 'Comércio Local',
            value: 18000.00,
            executive: '02',
            commission: 8.5,
            executives: [
                { executive: '02', commission: 8.5 },
                { executive: '06', commission: 4.0 }
            ],
            startDate: '2025-01-15',
            endDate: '2026-12-31',
            status: 'Ativo',
            logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: 'c3',
            name: 'Agência Criativa Mídia Brasil',
            cnpj: '33.444.555/0001-66',
            email: 'contato@criativamidia.com.br',
            phone: '(67) 99888-7766',
            segment: 'Agência de Publicidade',
            value: 25000.00,
            executive: '01',
            commission: 12.0,
            executives: [
                { executive: '01', commission: 12.0 }
            ],
            startDate: '2025-06-01',
            endDate: '2027-06-30',
            status: 'Ativo',
            logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: 'c4',
            name: 'ExpoAgro Dourados 2026',
            cnpj: '44.555.666/0001-77',
            email: 'patrocinio@expoagro.com.br',
            phone: '(67) 3410-2020',
            segment: 'Eventos & Shows',
            value: 45000.00,
            executive: '02',
            commission: 5.0,
            executives: [
                { executive: '02', commission: 5.0 },
                { executive: '01', commission: 3.0 }
            ],
            startDate: '2026-03-01',
            endDate: '2026-09-10',
            status: 'Ativo',
            logo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=100&auto=format&fit=crop&q=80'
        }
    ],
    transactions: [
        {
            id: 't1',
            date: '2026-08-05',
            description: 'Mensalidade Patrocínio Master - Supermercados Dourados',
            type: 'Receita',
            category: 'Receita Comercial',
            amount: 12500.00,
            status: 'Pago',
            paymentMethod: 'PIX / Transferência',
            entity: 'Supermercados Dourados Ltda'
        },
        {
            id: 't2',
            date: '2026-08-10',
            description: 'Cota de Patrocínio Comercial - AutoVale Dourados',
            type: 'Receita',
            category: 'Receita Comercial',
            amount: 18000.00,
            status: 'Pago',
            paymentMethod: 'Boleto Bancário',
            entity: 'Concessionária AutoVale Dourados'
        },
        {
            id: 't3',
            date: '2026-08-12',
            description: 'Contrato Publicidade Trimestral - Agência Criativa',
            type: 'Receita',
            category: 'Receita Comercial',
            amount: 25000.00,
            status: 'Pago',
            paymentMethod: 'Transferência Bancária',
            entity: 'Agência Criativa Mídia Brasil'
        },
        {
            id: 't4',
            date: '2026-08-15',
            description: 'Cota Especial Arena - ExpoAgro Dourados 2026',
            type: 'Receita',
            category: 'Receita Comercial',
            amount: 45000.00,
            status: 'Pendente',
            paymentMethod: 'Boleto Bancário',
            entity: 'ExpoAgro Dourados 2026'
        },
        {
            id: 't5',
            date: '2026-08-05',
            description: 'Folha de Pagamento - Carlos Eduardo Oliveira',
            type: 'Despesa',
            category: 'Folha de Pagamento',
            amount: 6800.00,
            status: 'Pago',
            paymentMethod: 'Depósito em Conta',
            entity: 'Carlos Eduardo Oliveira'
        },
        {
            id: 't6',
            date: '2026-08-05',
            description: 'Folha de Pagamento - Mariana Alves Prado',
            type: 'Despesa',
            category: 'Folha de Pagamento',
            amount: 8500.00,
            status: 'Pago',
            paymentMethod: 'Depósito em Conta',
            entity: 'Mariana Alves Prado'
        },
        {
            id: 't7',
            date: '2026-08-05',
            description: 'Folha de Pagamento - Roberto Santos Silva',
            type: 'Despesa',
            category: 'Folha de Pagamento',
            amount: 5400.00,
            status: 'Pago',
            paymentMethod: 'Depósito em Conta',
            entity: 'Roberto Santos Silva'
        },
        {
            id: 't8',
            date: '2026-08-05',
            description: 'Folha de Pagamento - Fernanda Lima Castro',
            type: 'Despesa',
            category: 'Folha de Pagamento',
            amount: 4900.00,
            status: 'Pago',
            paymentMethod: 'Depósito em Conta',
            entity: 'Fernanda Lima Castro'
        },
        {
            id: 't9',
            date: '2026-08-05',
            description: 'Folha de Pagamento - Lucas Mendes Rocha',
            type: 'Despesa',
            category: 'Folha de Pagamento',
            amount: 3800.00,
            status: 'Pago',
            paymentMethod: 'Depósito em Conta',
            entity: 'Lucas Mendes Rocha'
        },
        {
            id: 't10',
            date: '2026-08-05',
            description: 'Folha de Pagamento - Juliana Prado Ribeiro',
            type: 'Despesa',
            category: 'Folha de Pagamento',
            amount: 5600.00,
            status: 'Pago',
            paymentMethod: 'Depósito em Conta',
            entity: 'Juliana Prado Ribeiro'
        },
        {
            id: 't11',
            date: '2026-08-10',
            description: 'Energia Elétrica Parque Transmissor FM (Energisa)',
            type: 'Despesa',
            category: 'Energia & Transmissor',
            amount: 14200.00,
            status: 'Pago',
            paymentMethod: 'Débito Automático',
            entity: 'Energisa MS'
        },
        {
            id: 't12',
            date: '2026-08-18',
            description: 'Licença Direitos Autorais Execução Musical (ECAD)',
            type: 'Despesa',
            category: 'Impostos & Licenças',
            amount: 4200.00,
            status: 'Pago',
            paymentMethod: 'Boleto Bancário',
            entity: 'ECAD Nacional'
        },
        {
            id: 't13',
            date: '2026-08-20',
            description: 'Taxa FISTEL / outorga Anatel 94.5 FM',
            type: 'Despesa',
            category: 'Impostos & Licenças',
            amount: 2850.00,
            status: 'Pago',
            paymentMethod: 'GRU Anatel',
            entity: 'Anatel Minist. Comunicações'
        },
        {
            id: 't14',
            date: '2026-08-25',
            description: 'Manutenção Preventiva Módulo Potência Transmissor',
            type: 'Despesa',
            category: 'Manutenção Técnica',
            amount: 3500.00,
            status: 'Pendente',
            paymentMethod: 'Boleto Bancário',
            entity: 'Telecom Engenharia'
        },
        {
            id: 't15',
            date: '2026-08-28',
            description: 'Comissões Vendas Comerciais - Mariana Alves (Ref. Jul/Ago)',
            type: 'Despesa',
            category: 'Comissões Vendas',
            amount: 5030.00,
            status: 'Pendente',
            paymentMethod: 'Transferência Bancária',
            entity: 'Mariana Alves Prado'
        }
    ],
    settings: {
        companyName: 'Rádio Grande FM Ltda',
        tradeName: 'Rádio Grande FM 94.5',
        cnpj: '03.882.114/0001-92',
        frequency: '94.5 MHz',
        power: '10 kW',
        city: 'Dourados',
        state: 'MS',
        address: 'Av. Marcelino Pires, 1400 - Centro, Dourados - MS',
        email: 'financeiro@grandefm.com.br',
        phone: '(67) 3411-9450',
        pixKey: '03.882.114/0001-92',
        pixKeyType: 'CNPJ',
        bankName: 'Banco do Brasil S.A.',
        agency: '0084-5',
        account: '19450-8',
        defaultCommission: 10.0,
        invoiceDueDay: 10,
        estimatedTaxRate: 5.0,
        sessionTimeout: '30m',
        sslEnabled: true,
        emailNotifications: true,
        overdueAlerts: true,
        defaultTheme: 'dark'
    },
    users: [
        {
            id: 'u1',
            name: 'Administrador GFM',
            email: 'admin@grandefm.com.br',
            role: 'Administrador GFM',
            status: 'Ativo',
            lastAccess: '2026-08-23 21:44',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: 'u2',
            name: 'Juliana Prado Ribeiro',
            email: 'juliana.prado@grandefm.com.br',
            role: 'Gestor Financeiro',
            status: 'Ativo',
            lastAccess: '2026-08-23 18:20',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: 'u3',
            name: 'Mariana Alves Prado',
            email: 'mariana.alves@grandefm.com.br',
            role: 'Diretor Comercial',
            status: 'Ativo',
            lastAccess: '2026-08-22 11:15',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        },
        {
            id: 'u4',
            name: 'Roberto Santos Silva',
            email: 'roberto.santos@grandefm.com.br',
            role: 'Operador de Transmissão',
            status: 'Ativo',
            lastAccess: '2026-08-21 09:30',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
        }
    ]
};

// Ensure database directory & file exist
function initDb() {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DATA, null, 2), 'utf-8');
    }
}

function readDb() {
    initDb();
    try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const db = JSON.parse(raw);
        let updated = false;

        if (!db.transactions) {
            db.transactions = DEFAULT_DATA.transactions;
            updated = true;
        }
        if (!db.settings) {
            db.settings = DEFAULT_DATA.settings;
            updated = true;
        }
        if (!db.users) {
            db.users = DEFAULT_DATA.users;
            updated = true;
        }
        if (!db.auditLogs) {
            db.auditLogs = [
                {
                    id: 'log_init',
                    timestamp: new Date().toISOString(),
                    action: 'SISTEMA',
                    details: 'Sistema Financeiro GFM v2.5 inicializado com sucesso',
                    user: 'Sistema'
                }
            ];
            updated = true;
        }

        if (updated) writeDb(db);
        return db;
    } catch (err) {
        console.error('Erro ao ler banco de dados:', err);
        return DEFAULT_DATA;
    }
}

function writeDb(data) {
    initDb();
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
        // Auto snapshot safety copy
        try {
            const backupFile = path.join(DB_DIR, 'db_auto_backup.json');
            fs.writeFileSync(backupFile, JSON.stringify(data, null, 2), 'utf-8');
        } catch (e) {
            // non-critical
        }
        return true;
    } catch (err) {
        console.error('Erro ao salvar no banco de dados:', err);
        return false;
    }
}

function logAudit(action, details, user = 'Admin GFM') {
    try {
        const db = readDb();
        if (!db.auditLogs) db.auditLogs = [];
        const entry = {
            id: 'log_' + Date.now(),
            timestamp: new Date().toISOString(),
            action,
            details,
            user
        };
        db.auditLogs.unshift(entry);
        if (db.auditLogs.length > 100) {
            db.auditLogs = db.auditLogs.slice(0, 100);
        }
        writeDb(db);
        return entry;
    } catch (err) {
        console.error('Erro ao registrar log de auditoria:', err);
        return null;
    }
}

module.exports = {
    readDb,
    writeDb,
    logAudit
};
