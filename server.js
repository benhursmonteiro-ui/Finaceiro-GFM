/* ==========================================================================
   FINANCEIRO GFM - EXPRESS BACKEND SERVER
   Rádio Grande FM 94.5
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { readDb, writeDb } = require('./database');

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
// 1. AUTHENTICATION ENDPOINTS
// ==========================================================================
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
    }

    // Demo Authentication Rule: accept admin or any valid email
    if (username.toLowerCase() === 'admin' || username.includes('@')) {
        return res.json({
            success: true,
            message: 'Autenticado com sucesso!',
            user: {
                name: username.includes('@') ? username.split('@')[0] : 'Administrador GFM',
                role: 'Gestor Financeiro',
                email: username.includes('@') ? username : 'admin@grandefm.com.br'
            },
            token: 'gfm_jwt_token_demo_945'
        });
    }

    return res.status(401).json({ error: 'Credenciais inválidas. Use "admin" ou seu e-mail corporativo.' });
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
        segment: req.body.segment,
        value: parseFloat(req.body.value) || 0,
        executive: req.body.executive,
        commission: req.body.commission !== undefined ? parseFloat(req.body.commission) : 10.0,
        executives: req.body.executives || [],
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
        logo: req.body.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80'
    };

    if (!newClient.name || !newClient.cnpj || !newClient.email) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    db.clients.unshift(newClient);
    writeDb(db);
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
        executives: req.body.executives !== undefined ? req.body.executives : db.clients[idx].executives
    };

    writeDb(db);
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
    res.json({ success: true, deleted: deleted[0] });
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

