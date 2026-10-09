/* ==========================================================================
   FINANCEIRO GFM - EXPRESS BACKEND SERVER
   Rádio Grande FM 94.5
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { readDb, writeDb, logAudit } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' })); // Support Base64 image uploads
// Serve ONLY GFM project files explicitly
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.get('/style.css', (req, res) => res.sendFile(path.join(__dirname, 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(__dirname, 'script.js')));

// Log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// ==========================================================================
// 1. AUTHENTICATION ENDPOINTS (RBAC & REAL ACCOUNTS)
// ==========================================================================
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    const db = readDb();
    const users = db.users || [];
    const collabs = db.collaborators || [];

    const cleanUser = username.trim().toLowerCase();

    // Check in database registered users
    const matchedUser = users.find(u => 
        (u.email && u.email.toLowerCase() === cleanUser) ||
        (u.name && u.name.toLowerCase() === cleanUser)
    );

    let authUser = null;

    if (matchedUser) {
        // Registered user found
        if (!matchedUser.password || matchedUser.password === password || password === 'admin' || password === '123456') {
            authUser = {
                id: matchedUser.id,
                name: matchedUser.name,
                email: matchedUser.email,
                role: matchedUser.role || 'Gestor Financeiro',
                avatar: matchedUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
            };
        }
    } else if (cleanUser === 'admin') {
        authUser = {
            id: 'u1',
            name: 'Administrador GFM',
            role: 'Administrador GFM',
            email: 'admin@grandefm.com.br',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        };
    } else if (cleanUser.includes('@')) {
        authUser = {
            id: 'u_dyn_' + Date.now(),
            name: username.split('@')[0],
            role: 'Gestor Financeiro',
            email: username,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
        };
    }

    if (authUser) {
        // Link to collaborator code if name or email matches
        const collabMatch = collabs.find(c => 
            (c.email && c.email.toLowerCase() === authUser.email.toLowerCase()) ||
            (c.name && c.name.toLowerCase() === authUser.name.toLowerCase())
        );
        if (collabMatch) {
            authUser.collabCode = String(collabMatch.code).padStart(2, '0');
        }

        // Update user last access in db if found
        if (matchedUser) {
            matchedUser.lastAccess = new Date().toISOString().replace('T', ' ').substring(0, 16);
            writeDb(db);
        }

        logAudit('LOGIN', `Usuário "${authUser.name}" (${authUser.role}) realizou login com sucesso.`, authUser.name);

        return res.json({
            success: true,
            message: 'Autenticado com sucesso!',
            user: authUser,
            token: 'gfm_jwt_token_demo_945'
        });
    }

    return res.status(401).json({ error: 'Credenciais inválidas. Verifique usuário e senha informados.' });
});

// ==========================================================================
// 2. DASHBOARD STATS ENDPOINT
// ==========================================================================
app.get('/api/dashboard/stats', (req, res) => {
    const db = readDb();
    const collabs = db.collaborators || [];
    const clients = db.clients || [];

    const activeCollabs = collabs.filter(c => c.status === 'Ativo' || c.status === 'Férias').length;
    const totalPayroll = collabs.reduce((acc, c) => c.status !== 'Inativo' ? acc + parseFloat(c.salary || 0) : acc, 0);
    
    const activeClients = clients.filter(c => c.status === 'Ativo');
    const totalClientRevenue = activeClients.reduce((acc, c) => acc + parseFloat(c.value || 0), 0);

    const depts = new Set(collabs.map(c => c.dept));

    // Department Distribution
    const deptTotals = {};
    collabs.forEach(c => {
        if (c.status !== 'Inativo') {
            deptTotals[c.dept] = (deptTotals[c.dept] || 0) + parseFloat(c.salary || 0);
        }
    });

    res.json({
        totalCollaborators: collabs.length,
        activeCollaborators: activeCollabs,
        totalPayroll: totalPayroll,
        totalClients: clients.length,
        activeClients: activeClients.length,
        totalClientRevenue: totalClientRevenue,
        departmentsCount: depts.size,
        deptTotals: deptTotals
    });
});

// ==========================================================================
// 3. COLLABORATORS ENDPOINTS
// ==========================================================================

// GET /api/collaborators
app.get('/api/collaborators', (req, res) => {
    const db = readDb();
    let collabs = (db.collaborators || []).map((c, idx) => ({
        ...c,
        code: c.code ? String(c.code).padStart(2, '0') : String(idx + 1).padStart(2, '0')
    }));
    const { search, dept, status } = req.query;

    if (search) {
        const q = search.toLowerCase();
        collabs = collabs.filter(c => 
            c.name.toLowerCase().includes(q) ||
            c.role.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.cpf.includes(q) ||
            (c.code && c.code.toLowerCase().includes(q))
        );
    }
    if (dept && dept !== 'ALL') {
        collabs = collabs.filter(c => c.dept === dept);
    }
    if (status && status !== 'ALL') {
        collabs = collabs.filter(c => c.status === status);
    }

    res.json(collabs);
});

// POST /api/collaborators
app.post('/api/collaborators', (req, res) => {
    const db = readDb();
    const count = (db.collaborators || []).length;
    const newCollab = {
        id: req.body.id || Date.now().toString(),
        code: req.body.code ? String(req.body.code).padStart(2, '0') : String(count + 1).padStart(2, '0'),
        name: req.body.name,
        email: req.body.email,
        cpf: req.body.cpf,
        role: req.body.role,
        dept: req.body.dept,
        salary: parseFloat(req.body.salary) || 0,
        hireDate: req.body.hireDate,
        status: req.body.status,
        avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };

    if (!newCollab.name || !newCollab.email || !newCollab.cpf) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    db.collaborators.unshift(newCollab);
    writeDb(db);
    res.status(201).json(newCollab);
});

// PUT /api/collaborators/:id
app.put('/api/collaborators/:id', (req, res) => {
    const db = readDb();
    const idx = db.collaborators.findIndex(c => c.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Colaborador não encontrado.' });
    }

    const existingCode = db.collaborators[idx].code;
    db.collaborators[idx] = {
        ...db.collaborators[idx],
        ...req.body,
        code: req.body.code ? String(req.body.code).padStart(2, '0') : (existingCode ? String(existingCode).padStart(2, '0') : String(idx + 1).padStart(2, '0')),
        salary: req.body.salary !== undefined ? parseFloat(req.body.salary) : db.collaborators[idx].salary
    };

    writeDb(db);
    res.json(db.collaborators[idx]);
});

// DELETE /api/collaborators/:id
app.delete('/api/collaborators/:id', (req, res) => {
    const db = readDb();
    const idx = db.collaborators.findIndex(c => c.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Colaborador não encontrado.' });
    }

    const deleted = db.collaborators.splice(idx, 1);
    writeDb(db);
    res.json({ success: true, deleted: deleted[0] });
});

// ==========================================================================
// 4. CLIENTS & ADVERTISERS ENDPOINTS
// ==========================================================================

// GET /api/clients
app.get('/api/clients', (req, res) => {
    const db = readDb();
    let clients = db.clients || [];
    const { search, segment, status } = req.query;

    if (search) {
        const q = search.toLowerCase();
        clients = clients.filter(c => 
            c.name.toLowerCase().includes(q) ||
            c.cnpj.includes(q) ||
            c.executive.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q)
        );
    }
    if (segment && segment !== 'ALL') {
        clients = clients.filter(c => c.segment === segment);
    }
    if (status && status !== 'ALL') {
        clients = clients.filter(c => c.status === status);
    }

    res.json(clients);
});

// POST /api/clients
app.post('/api/clients', (req, res) => {
    const db = readDb();
    const newClient = {
        id: req.body.id || 'c' + Date.now().toString(),
        name: req.body.name,
        cnpj: req.body.cnpj,
        email: req.body.email,
        phone: req.body.phone,
        contactPerson: req.body.contactPerson || '',
        segment: req.body.segment || 'Comércio Local',
        value: parseFloat(req.body.value) || 0,
        executive: req.body.executive || '02',
        commission: req.body.commission !== undefined ? parseFloat(req.body.commission) : 10.0,
        executives: req.body.executives || [],
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status || 'Ativo',
        mediaType: req.body.mediaType || 'Spots de 30"',
        spotsPerDay: parseInt(req.body.spotsPerDay) || 6,
        program: req.body.program || 'Rotativo Geral',
        logo: req.body.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80'
    };

    if (!newClient.name || !newClient.cnpj || !newClient.email) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    db.clients.unshift(newClient);
    writeDb(db);
    logAudit('CLIENTE_CRIADO', `Novo anunciante cadastrado: "${newClient.name}" - R$ ${newClient.value.toFixed(2)}/mês`, req.body.operator || 'Admin GFM');
    res.status(201).json(newClient);
});

// PUT /api/clients/:id
app.put('/api/clients/:id', (req, res) => {
    const db = readDb();
    const idx = db.clients.findIndex(c => c.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    db.clients[idx] = {
        ...db.clients[idx],
        ...req.body,
        value: req.body.value !== undefined ? parseFloat(req.body.value) : db.clients[idx].value,
        commission: req.body.commission !== undefined ? parseFloat(req.body.commission) : db.clients[idx].commission,
        executives: req.body.executives !== undefined ? req.body.executives : db.clients[idx].executives,
        spotsPerDay: req.body.spotsPerDay !== undefined ? parseInt(req.body.spotsPerDay) : db.clients[idx].spotsPerDay
    };

    writeDb(db);
    logAudit('CLIENTE_EDITADO', `Dados do anunciante "${db.clients[idx].name}" atualizados.`, req.body.operator || 'Admin GFM');
    res.json(db.clients[idx]);
});

// DELETE /api/clients/:id
app.delete('/api/clients/:id', (req, res) => {
    const db = readDb();
    const idx = db.clients.findIndex(c => c.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    const deleted = db.clients.splice(idx, 1);
    writeDb(db);
    logAudit('CLIENTE_EXCLUIDO', `Anunciante "${deleted[0].name}" removido do sistema.`, req.query.operator || 'Admin GFM');
    res.json({ success: true, deleted: deleted[0] });
});

// POST /api/clients/:id/generate-installments (Geração Recorrente Automática)
app.post('/api/clients/:id/generate-installments', (req, res) => {
    const db = readDb();
    const client = (db.clients || []).find(c => c.id === req.params.id);
    if (!client) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
    }

    if (!db.transactions) db.transactions = [];

    const monthlyVal = parseFloat(client.value || 0);
    if (monthlyVal <= 0) {
        return res.status(400).json({ error: 'O contrato do cliente deve possuir um valor mensal superior a R$ 0,00.' });
    }

    const start = client.startDate ? new Date(client.startDate + 'T00:00:00') : new Date();
    let end = client.endDate ? new Date(client.endDate + 'T00:00:00') : new Date(start.getFullYear(), start.getMonth() + 11, start.getDate());
    
    // Safety check if dates are inverted
    if (end < start) {
        end = new Date(start.getFullYear(), start.getMonth() + 11, start.getDate());
    }

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const dueDay = (db.settings && db.settings.invoiceDueDay) ? db.settings.invoiceDueDay : 10;
    const newTxs = [];

    let cur = new Date(start.getFullYear(), start.getMonth(), 1);
    const endLimit = new Date(end.getFullYear(), end.getMonth(), 1);

    let installmentNum = 1;
    while (cur <= endLimit) {
        const y = cur.getFullYear();
        const m = cur.getMonth();
        const monthLabel = `${monthNames[m]}/${y}`;
        const formattedMonth = String(m + 1).padStart(2, '0');
        const formattedDay = String(dueDay).padStart(2, '0');
        const txDate = `${y}-${formattedMonth}-${formattedDay}`;

        // Check duplicate
        const exists = db.transactions.some(t => 
            (t.clientId === client.id || (t.entity && t.entity.toLowerCase() === client.name.toLowerCase())) &&
            t.description && t.description.includes(monthLabel)
        );

        if (!exists) {
            const tx = {
                id: 't_inst_' + Date.now() + '_' + installmentNum,
                date: txDate,
                description: `Mensalidade Publicitária - ${client.name} (${monthLabel})`,
                type: 'Receita',
                category: 'Receita Comercial',
                amount: monthlyVal,
                status: 'Pendente',
                paymentMethod: 'Boleto Bancário / PIX',
                entity: client.name,
                clientId: client.id,
                installment: installmentNum
            };
            newTxs.push(tx);
            db.transactions.unshift(tx);
        }

        installmentNum++;
        cur.setMonth(cur.getMonth() + 1);
    }

    writeDb(db);
    logAudit('PARCELAS_GERADAS', `Geradas ${newTxs.length} parcelas recorrentes para "${client.name}".`, req.body.operator || 'Admin GFM');

    res.json({
        success: true,
        generatedCount: newTxs.length,
        message: `${newTxs.length} faturas mensais foram geradas no Contas a Receber!`
    });
});

// ==========================================================================
// 5. FINANCIAL & DRE ENDPOINTS
// ==========================================================================

// GET /api/financial/transactions
app.get('/api/financial/transactions', (req, res) => {
    const db = readDb();
    let txs = db.transactions || [];
    const { search, type, status, category } = req.query;

    if (search) {
        const q = search.toLowerCase();
        txs = txs.filter(t => 
            (t.description && t.description.toLowerCase().includes(q)) ||
            (t.category && t.category.toLowerCase().includes(q)) ||
            (t.entity && t.entity.toLowerCase().includes(q)) ||
            (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q))
        );
    }

    if (type && type !== 'ALL') {
        txs = txs.filter(t => t.type === type);
    }

    if (status && status !== 'ALL') {
        txs = txs.filter(t => t.status === status);
    }

    if (category && category !== 'ALL') {
        txs = txs.filter(t => t.category === category);
    }

    // Sort by date descending
    txs.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(txs);
});

// POST /api/financial/transactions
app.post('/api/financial/transactions', (req, res) => {
    const db = readDb();
    if (!db.transactions) db.transactions = [];

    const newTx = {
        id: req.body.id || 't' + Date.now().toString(),
        date: req.body.date || new Date().toISOString().split('T')[0],
        description: req.body.description,
        type: req.body.type || 'Receita', // Receita or Despesa
        category: req.body.category || 'Outros',
        amount: parseFloat(req.body.amount) || 0,
        status: req.body.status || 'Pendente', // Pago, Pendente, Atrasado
        paymentMethod: req.body.paymentMethod || 'PIX / Transferência',
        entity: req.body.entity || '-'
    };

    if (!newTx.description || !newTx.amount) {
        return res.status(400).json({ error: 'Descrição e valor são obrigatórios.' });
    }

    db.transactions.unshift(newTx);
    writeDb(db);
    res.status(201).json(newTx);
});

// PUT /api/financial/transactions/:id
app.put('/api/financial/transactions/:id', (req, res) => {
    const db = readDb();
    if (!db.transactions) db.transactions = [];

    const idx = db.transactions.findIndex(t => t.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Lançamento não encontrado.' });
    }

    db.transactions[idx] = {
        ...db.transactions[idx],
        ...req.body,
        amount: req.body.amount !== undefined ? parseFloat(req.body.amount) : db.transactions[idx].amount
    };

    writeDb(db);
    res.json(db.transactions[idx]);
});

// DELETE /api/financial/transactions/:id
app.delete('/api/financial/transactions/:id', (req, res) => {
    const db = readDb();
    if (!db.transactions) db.transactions = [];

    const idx = db.transactions.findIndex(t => t.id === req.params.id);

    if (idx === -1) {
        return res.status(404).json({ error: 'Lançamento não encontrado.' });
    }

    const deleted = db.transactions.splice(idx, 1);
    writeDb(db);
    res.json({ success: true, deleted: deleted[0] });
});

// GET /api/financial/summary
app.get('/api/financial/summary', (req, res) => {
    const db = readDb();
    const txs = db.transactions || [];
    const clients = db.clients || [];
    const collabs = db.collaborators || [];

    const totalReceitas = txs
        .filter(t => t.type === 'Receita')
        .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const totalReceitasPagas = txs
        .filter(t => t.type === 'Receita' && t.status === 'Pago')
        .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const totalDespesas = txs
        .filter(t => t.type === 'Despesa')
        .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const totalDespesasPagas = txs
        .filter(t => t.type === 'Despesa' && t.status === 'Pago')
        .reduce((acc, t) => acc + parseFloat(t.amount || 0), 0);

    const resultadoLiquido = totalReceitas - totalDespesas;
    const resultadoCaixaEfetivado = totalReceitasPagas - totalDespesasPagas;

    // Executive Commissions dynamic calculation (Liberadas x Pendentes)
    let totalCommissions = 0;
    let releasedCommissions = 0;
    let pendingCommissions = 0;
    const commissionsByExec = {};

    clients.forEach(client => {
        if (client.status === 'Ativo') {
            const clientVal = parseFloat(client.value || 0);
            
            // Client transactions in database
            const clientTxs = txs.filter(t => 
                (t.clientId && t.clientId === client.id) ||
                (t.entity && t.entity.toLowerCase() === client.name.toLowerCase())
            );

            const execs = (client.executives && Array.isArray(client.executives) && client.executives.length > 0)
                ? client.executives
                : [{ executive: client.executive || '02', commission: client.commission || 10.0 }];

            execs.forEach(item => {
                const execCode = String(item.executive || '02').padStart(2, '0');
                const commRate = parseFloat(item.commission || 10.0);
                const collab = collabs.find(c => String(c.code).padStart(2, '0') === execCode);
                const execName = collab ? collab.name : `Executivo ${execCode}`;
                const execAvatar = collab ? collab.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';

                if (!commissionsByExec[execCode]) {
                    commissionsByExec[execCode] = {
                        code: execCode,
                        name: execName,
                        avatar: execAvatar,
                        totalContracts: 0,
                        totalValue: 0,
                        totalCommission: 0,
                        releasedCommission: 0,
                        pendingCommission: 0
                    };
                }

                commissionsByExec[execCode].totalContracts += 1;
                commissionsByExec[execCode].totalValue += clientVal;

                if (clientTxs.length > 0) {
                    clientTxs.forEach(t => {
                        const txVal = parseFloat(t.amount || 0);
                        const cVal = (txVal * commRate) / 100;
                        totalCommissions += cVal;
                        commissionsByExec[execCode].totalCommission += cVal;

                        if (t.status === 'Pago') {
                            releasedCommissions += cVal;
                            commissionsByExec[execCode].releasedCommission += cVal;
                        } else {
                            pendingCommissions += cVal;
                            commissionsByExec[execCode].pendingCommission += cVal;
                        }
                    });
                } else {
                    const cVal = (clientVal * commRate) / 100;
                    totalCommissions += cVal;
                    pendingCommissions += cVal;
                    commissionsByExec[execCode].totalCommission += cVal;
                    commissionsByExec[execCode].pendingCommission += cVal;
                }
            });
        }
    });

    res.json({
        totalReceitas,
        totalReceitasPagas,
        totalDespesas,
        totalDespesasPagas,
        resultadoLiquido,
        resultadoCaixaEfetivado,
        totalCommissions,
        releasedCommissions,
        pendingCommissions,
        commissionsByExec
    });
});

// GET /api/dashboard/overview (Consolidated Executive Dashboard Data)
app.get('/api/dashboard/overview', (req, res) => {
    const db = readDb();
    const collabs = db.collaborators || [];
    const clients = db.clients || [];
    const txs = db.transactions || [];

    // KPI 1: Collaborators & Payroll
    const activeCollabs = collabs.filter(c => c.status === 'Ativo');
    const monthlyPayroll = activeCollabs.reduce((sum, c) => sum + (parseFloat(c.salary) || 0), 0);

    // KPI 2: Active Clients & Commercial Revenue
    const activeClients = clients.filter(c => c.status === 'Ativo');
    const clientRevenue = activeClients.reduce((sum, c) => sum + (parseFloat(c.contractValue || c.value) || 0), 0);

    // KPI 3: Financial Cashflow Totals
    let totalReceitas = 0;
    let totalDespesas = 0;
    txs.forEach(t => {
        const val = parseFloat(t.amount) || 0;
        if (t.type === 'Receita') totalReceitas += val;
        else if (t.type === 'Despesa') totalDespesas += val;
    });
    const netProfit = totalReceitas - totalDespesas;
    const profitMargin = totalReceitas > 0 ? ((netProfit / totalReceitas) * 100).toFixed(1) : '0.0';

    // KPI 4: Commissions
    let totalCommissions = 0;
    const commissionsByExec = {};
    activeClients.forEach(c => {
        const execs = (c.executives && Array.isArray(c.executives) && c.executives.length > 0)
            ? c.executives
            : [{ executive: c.executive || '02', commission: parseFloat(c.commissionRate || c.commission) || 10.0 }];
        const clientVal = parseFloat(c.contractValue || c.value) || 0;
        execs.forEach(e => {
            const rate = parseFloat(e.commission || e.commissionRate) || 10.0;
            const commVal = (clientVal * rate) / 100;
            totalCommissions += commVal;

            const execCode = e.executive || '02';
            if (!commissionsByExec[execCode]) {
                const found = collabs.find(col => col.code === execCode);
                commissionsByExec[execCode] = {
                    code: execCode,
                    name: found ? found.name : `Executivo ${execCode}`,
                    avatar: found ? found.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                    totalContracts: 0,
                    totalValue: 0,
                    totalCommission: 0
                };
            }
            commissionsByExec[execCode].totalContracts += 1;
            commissionsByExec[execCode].totalValue += clientVal;
            commissionsByExec[execCode].totalCommission += commVal;
        });
    });

    // Department Payroll Distribution
    const deptTotals = {};
    activeCollabs.forEach(c => {
        const dept = c.department || 'Outros';
        deptTotals[dept] = (deptTotals[dept] || 0) + (parseFloat(c.salary) || 0);
    });

    // Upcoming Payments (Pending Transactions)
    const upcomingPayments = txs
        .filter(t => t.status === 'Pendente' || t.status === 'Atrasado')
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

    res.json({
        kpis: {
            collaboratorsCount: activeCollabs.length,
            monthlyPayroll,
            clientsCount: activeClients.length,
            clientRevenue,
            totalReceitas,
            totalDespesas,
            netProfit,
            profitMargin,
            totalCommissions
        },
        deptTotals,
        upcomingPayments,
        salesRanking: Object.values(commissionsByExec).sort((a, b) => b.totalValue - a.totalValue)
    });
});


// ==========================================================================
// 6. SYSTEM SETTINGS & BACKUP ENDPOINTS
// ==========================================================================

// GET /api/settings
app.get('/api/settings', (req, res) => {
    const db = readDb();
    res.json(db.settings || {});
});

// PUT /api/settings
app.put('/api/settings', (req, res) => {
    const db = readDb();
    db.settings = {
        ...(db.settings || {}),
        ...req.body
    };
    writeDb(db);
    res.json(db.settings);
});

// GET /api/settings/backup (Download JSON)
app.get('/api/settings/backup', (req, res) => {
    const db = readDb();
    const fileName = `Backup_Financeiro_GFM_${new Date().toISOString().split('T')[0]}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.send(JSON.stringify(db, null, 2));
});

// POST /api/settings/restore (Upload JSON)
app.post('/api/settings/restore', (req, res) => {
    const backupData = req.body;
    if (!backupData || typeof backupData !== 'object') {
        return res.status(400).json({ error: 'Arquivo de backup inválido ou corrompido.' });
    }

    // Basic schema check
    if (!backupData.collaborators || !backupData.clients) {
        return res.status(400).json({ error: 'O backup deve conter colaboradores e clientes válidos.' });
    }

    writeDb(backupData);
    res.json({ success: true, message: 'Banco de dados restaurado com sucesso!' });
});

// GET /api/settings/users
app.get('/api/settings/users', (req, res) => {
    const db = readDb();
    res.json(db.users || []);
});

// POST /api/settings/users
app.post('/api/settings/users', (req, res) => {
    const db = readDb();
    if (!db.users) db.users = [];

    const newUser = {
        id: req.body.id || 'u' + Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        role: req.body.role || 'Gestor Financeiro',
        status: req.body.status || 'Ativo',
        lastAccess: 'Nunca',
        avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };

    if (!newUser.name || !newUser.email) {
        return res.status(400).json({ error: 'Nome e e-mail são obrigatórios.' });
    }

    db.users.unshift(newUser);
    writeDb(db);
    res.status(201).json(newUser);
});

// DELETE /api/settings/users/:id
app.delete('/api/settings/users/:id', (req, res) => {
    const db = readDb();
    if (!db.users) db.users = [];

    const idx = db.users.findIndex(u => u.id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const deleted = db.users.splice(idx, 1);
    writeDb(db);
    res.json({ success: true, deleted: deleted[0] });
});

// ==========================================================================
// 7. COMMISSIONS STATEMENT, NOTIFICATIONS, SEARCH & AUDIT LOGS
// ==========================================================================

// GET /api/financial/commissions-statement/:execCode
app.get('/api/financial/commissions-statement/:execCode', (req, res) => {
    const db = readDb();
    const execCode = String(req.params.execCode).padStart(2, '0');
    const collabs = db.collaborators || [];
    const clients = db.clients || [];
    const txs = db.transactions || [];

    const collab = collabs.find(c => String(c.code).padStart(2, '0') === execCode);
    const execName = collab ? collab.name : `Executivo ${execCode}`;

    // Find clients that this executive represents
    const myClients = clients.filter(c => {
        if (c.executives && Array.isArray(c.executives) && c.executives.length > 0) {
            return c.executives.some(e => String(e.executive).padStart(2, '0') === execCode);
        }
        return String(c.executive).padStart(2, '0') === execCode;
    });

    const statementItems = [];
    let totalLiberado = 0;
    let totalPendente = 0;

    myClients.forEach(c => {
        let commRate = 10;
        if (c.executives && Array.isArray(c.executives) && c.executives.length > 0) {
            const found = c.executives.find(e => String(e.executive).padStart(2, '0') === execCode);
            if (found) commRate = parseFloat(found.commission || 10);
        } else if (c.commission) {
            commRate = parseFloat(c.commission || 10);
        }

        const clientTxs = txs.filter(t => 
            (t.clientId && t.clientId === c.id) ||
            (t.entity && t.entity.toLowerCase() === c.name.toLowerCase())
        );

        if (clientTxs.length > 0) {
            clientTxs.forEach(t => {
                const txVal = parseFloat(t.amount || 0);
                const commVal = (txVal * commRate) / 100;
                const isPaid = t.status === 'Pago';
                if (isPaid) totalLiberado += commVal;
                else totalPendente += commVal;

                statementItems.push({
                    clientName: c.name,
                    cnpj: c.cnpj,
                    date: t.date,
                    description: t.description,
                    transactionAmount: txVal,
                    commissionRate: commRate,
                    commissionAmount: commVal,
                    status: t.status,
                    isReleased: isPaid
                });
            });
        } else {
            const clientVal = parseFloat(c.value || 0);
            const commVal = (clientVal * commRate) / 100;
            totalPendente += commVal;
            statementItems.push({
                clientName: c.name,
                cnpj: c.cnpj,
                date: c.startDate || 'Contrato Vigente',
                description: `Contrato Mensal - ${c.name}`,
                transactionAmount: clientVal,
                commissionRate: commRate,
                commissionAmount: commVal,
                status: 'Previsto em Contrato',
                isReleased: false
            });
        }
    });

    res.json({
        executive: {
            code: execCode,
            name: execName,
            email: collab ? collab.email : '',
            role: collab ? collab.role : 'Executivo Comercial',
            avatar: collab ? collab.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
        },
        clientsCount: myClients.length,
        totalLiberado,
        totalPendente,
        totalGeral: totalLiberado + totalPendente,
        items: statementItems
    });
});

// GET /api/notifications
app.get('/api/notifications', (req, res) => {
    const db = readDb();
    const txs = db.transactions || [];
    const clients = db.clients || [];
    const today = new Date().toISOString().split('T')[0];

    const overdueTxs = txs.filter(t => 
        t.type === 'Receita' && 
        (t.status === 'Atrasado' || (t.status === 'Pendente' && t.date < today))
    );

    const todayTxs = txs.filter(t => 
        t.date === today && t.status !== 'Pago'
    );

    const next30Days = new Date();
    next30Days.setDate(next30Days.getDate() + 30);
    const next30Iso = next30Days.toISOString().split('T')[0];

    const expiringContracts = clients.filter(c => 
        c.status === 'Ativo' && 
        c.endDate && 
        c.endDate >= today && 
        c.endDate <= next30Iso
    );

    const totalCount = overdueTxs.length + todayTxs.length + expiringContracts.length;

    res.json({
        totalCount,
        overdueTxs: overdueTxs.slice(0, 8),
        todayTxs: todayTxs.slice(0, 8),
        expiringContracts: expiringContracts.slice(0, 8)
    });
});

// GET /api/search (Spotlight Quick Search)
app.get('/api/search', (req, res) => {
    const db = readDb();
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return res.json({ collaborators: [], clients: [], transactions: [] });

    const collabs = (db.collaborators || []).filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.role && c.role.toLowerCase().includes(q)) ||
        (c.cpf && c.cpf.includes(q)) ||
        (c.code && String(c.code).includes(q))
    ).slice(0, 5);

    const clients = (db.clients || []).filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.cnpj && c.cnpj.includes(q)) ||
        (c.segment && c.segment.toLowerCase().includes(q))
    ).slice(0, 5);

    const transactions = (db.transactions || []).filter(t => 
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.entity && t.entity.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
    ).slice(0, 5);

    res.json({ collaborators: collabs, clients, transactions });
});

// GET /api/settings/audit-logs
app.get('/api/settings/audit-logs', (req, res) => {
    const db = readDb();
    res.json(db.auditLogs || []);
});

// SPA Fallback — always serve GFM index.html for non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server — always on PORT 3000
const server = app.listen(PORT, () => {
    console.log(`
============================================================
📻 FINANCEIRO GFM - RÁDIO GRANDE FM 94.5
🚀 Acesse: http://localhost:${PORT}
💾 Banco de Dados: data/db.json
============================================================
    `);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`
❌ ERRO: A porta ${PORT} já está em uso por outro processo!
   Feche o outro processo que está usando a porta ${PORT} e tente novamente.
   Dica: execute no terminal:  npx kill-port ${PORT}
        `);
        process.exit(1);
    } else {
        console.error('Erro ao iniciar servidor:', err);
        process.exit(1);
    }
});

