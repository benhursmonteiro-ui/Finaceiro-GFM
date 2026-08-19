/* ==========================================================================
   FINANCEIRO GFM - FULLSTACK FRONTEND INTEGRATION WITH REST API
   Rádio Grande FM 94.5
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 1. Initial Mock Data (Fallback if Offline)
    // --------------------------------------------------------------------------
    const INITIAL_COLLABORATORS = [
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
    ];

    const INITIAL_CLIENTS = [
        {
            id: 'c1',
            name: 'Supermercados Dourados Ltda',
            cnpj: '11.222.333/0001-44',
            email: 'comercial@superdourados.com.br',
            phone: '(67) 3411-9000',
            segment: 'Comércio Local',
            value: 12500.00,
            executive: 'Mariana Alves',
            commission: 10.0,
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
            executive: 'Mariana Alves',
            commission: 8.5,
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
            executive: 'Carlos Eduardo',
            commission: 12.0,
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
            executive: 'Mariana Alves',
            commission: 5.0,
            startDate: '2026-03-01',
            endDate: '2026-09-10',
            status: 'Ativo',
            logo: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=100&auto=format&fit=crop&q=80'
        }
    ];

    // --------------------------------------------------------------------------
    // 2. DOM Elements
    // --------------------------------------------------------------------------
    const loginView = document.getElementById('loginView');
    const appView = document.getElementById('appView');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const eyeIcon = document.getElementById('eyeIcon');
    const eyeOffIcon = document.getElementById('eyeOffIcon');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const spinner = submitBtn.querySelector('.spinner');
    const alertBox = document.getElementById('alertBox');
    const alertMessage = document.getElementById('alertMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const loggedInUserName = document.getElementById('loggedInUserName');

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebar = document.querySelector('.sidebar');

    function toggleMobileMenu() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('hidden');
    }

    function closeMobileMenu() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.add('hidden');
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeMobileMenu);

    // Navigation Elements
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    const pageSubtitle = document.getElementById('pageSubtitle');
    const sidebarCollaboratorsCount = document.getElementById('sidebarCollaboratorsCount');
    const sidebarClientsCount = document.getElementById('sidebarClientsCount');

    // Dashboard KPI Elements
    const kpiCollaborators = document.getElementById('kpiCollaborators');
    const kpiPayroll = document.getElementById('kpiPayroll');
    const kpiClientRevenue = document.getElementById('kpiClientRevenue');
    const kpiClientsCount = document.getElementById('kpiClientsCount');
    const deptDistributionList = document.getElementById('deptDistributionList');
    const quickAddCollaboratorBtn = document.getElementById('quickAddCollaboratorBtn');
    const quickAddClientBtn = document.getElementById('quickAddClientBtn');

    // Collaborators Table & Modal Elements
    const searchCollaboratorInput = document.getElementById('searchCollaboratorInput');
    const deptFilterSelect = document.getElementById('deptFilterSelect');
    const statusFilterSelect = document.getElementById('statusFilterSelect');
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const collaboratorsTableBody = document.getElementById('collaboratorsTableBody');
    const emptyState = document.getElementById('emptyState');
    const collaboratorModal = document.getElementById('collaboratorModal');
    const closeCollaboratorModalBtn = document.getElementById('closeCollaboratorModalBtn');
    const cancelCollabBtn = document.getElementById('cancelCollabBtn');
    const collaboratorForm = document.getElementById('collaboratorForm');
    const modalTitle = document.getElementById('modalTitle');
    const collabIdInput = document.getElementById('collabId');
    const collabNameInput = document.getElementById('collabName');
    const collabEmailInput = document.getElementById('collabEmail');
    const collabCpfInput = document.getElementById('collabCpf');
    const collabRoleInput = document.getElementById('collabRole');
    const collabDeptSelect = document.getElementById('collabDept');
    const collabSalaryInput = document.getElementById('collabSalary');
    const collabHireDateInput = document.getElementById('collabHireDate');
    const collabStatusSelect = document.getElementById('collabStatus');
    const collabPhotoFileInput = document.getElementById('collabPhotoFile');
    const photoPreview = document.getElementById('photoPreview');

    // Clients Table & Modal Elements
    const searchClientInput = document.getElementById('searchClientInput');
    const segmentFilterSelect = document.getElementById('segmentFilterSelect');
    const clientStatusFilterSelect = document.getElementById('clientStatusFilterSelect');
    const openAddClientModalBtn = document.getElementById('openAddClientModalBtn');
    const clientsTableBody = document.getElementById('clientsTableBody');
    const emptyClientState = document.getElementById('emptyClientState');
    const clientModal = document.getElementById('clientModal');
    const closeClientModalBtn = document.getElementById('closeClientModalBtn');
    const cancelClientBtn = document.getElementById('cancelClientBtn');
    const clientForm = document.getElementById('clientForm');
    const clientModalTitle = document.getElementById('clientModalTitle');

    // Client Form Inputs
    const clientIdInput = document.getElementById('clientId');
    const clientNameInput = document.getElementById('clientName');
    const clientCnpjInput = document.getElementById('clientCnpj');
    const clientEmailInput = document.getElementById('clientEmail');
    const clientPhoneInput = document.getElementById('clientPhone');
    const clientSegmentSelect = document.getElementById('clientSegment');
    const clientValueInput = document.getElementById('clientValue');
    const clientExecutiveInput = document.getElementById('clientExecutive');
    const clientCommissionInput = document.getElementById('clientCommission');
    const clientStartDateInput = document.getElementById('clientStartDate');
    const clientEndDateInput = document.getElementById('clientEndDate');
    const clientStatusSelect = document.getElementById('clientStatus');
    const clientLogoFileInput = document.getElementById('clientLogoFile');
    const clientLogoPreview = document.getElementById('clientLogoPreview');

    // Defaults
    const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    const DEFAULT_LOGO = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80';
    let currentCollabPhotoData = DEFAULT_PHOTO;
    let currentClientLogoData = DEFAULT_LOGO;

    // Handle Photo File Uploads
    collabPhotoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentCollabPhotoData = event.target.result;
                photoPreview.src = currentCollabPhotoData;
                showToast('Foto do colaborador selecionada!', 'info');
            };
            reader.readAsDataURL(file);
        }
    });

    clientLogoFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentClientLogoData = event.target.result;
                clientLogoPreview.src = currentClientLogoData;
                showToast('Logo do cliente selecionada!', 'info');
            };
            reader.readAsDataURL(file);
        }
    });

    // Forgot Password & Radio Elements
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotModal = document.getElementById('forgotModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const forgotForm = document.getElementById('forgotForm');
    const recoveryEmail = document.getElementById('recoveryEmail');
    const radioPlayBtn = document.getElementById('radioPlayBtn');
    const radioPlayIcon = document.getElementById('radioPlayIcon');
    const radioPauseIcon = document.getElementById('radioPauseIcon');
    const audioWavesIcon = document.querySelector('.audio-waves-icon');

    let isRadioPlaying = false;

    // --------------------------------------------------------------------------
    // 3. Lucide Icons Setup
    // --------------------------------------------------------------------------
    function refreshIcons() {
        if (window.lucide) {
            lucide.createIcons();
        }
    }
    refreshIcons();

    // --------------------------------------------------------------------------
    // 4. Theme Switcher Logic
    // --------------------------------------------------------------------------
    const savedTheme = localStorage.getItem('gfm_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    document.querySelectorAll('.themeBtn').forEach(btn => {
        btn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('gfm_theme', newTheme);
            showToast(`Tema alterado para ${newTheme === 'dark' ? 'Escuro' : 'Claro'}`, 'info');
        });
    });

    // --------------------------------------------------------------------------
    // 5. API REST Client Communication Helpers
    // --------------------------------------------------------------------------
    async function apiFetch(endpoint, options = {}) {
        try {
            const res = await fetch(`/api${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || `Erro na API (${res.status})`);
            }
            return await res.json();
        } catch (error) {
            console.warn(`[API Fallback] ${endpoint}: ${error.message}`);
            return null;
        }
    }

    // --------------------------------------------------------------------------
    // 6. Session State & View Switching
    // --------------------------------------------------------------------------
    function checkSession() {
        const isLoggedIn = localStorage.getItem('gfm_session') === 'active';
        if (isLoggedIn) {
            const username = localStorage.getItem('gfm_user') || 'Admin GFM';
            loggedInUserName.textContent = username;
            loginView.classList.add('hidden');
            appView.classList.remove('hidden');
            loadDashboard();
            renderCollaboratorsTable();
            renderClientsTable();
        } else {
            loginView.classList.remove('hidden');
            appView.classList.add('hidden');
        }
    }
    checkSession();

    // Password Visibility Toggle
    togglePasswordBtn.addEventListener('click', () => {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        if (isPassword) {
            eyeIcon.classList.add('hidden');
            eyeOffIcon.classList.remove('hidden');
        } else {
            eyeIcon.classList.remove('hidden');
            eyeOffIcon.classList.add('hidden');
        }
    });

    // Login Form Submit (Backend API call)
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        usernameError.textContent = '';
        passwordError.textContent = '';
        alertBox.classList.add('hidden');

        const usernameVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value.trim();

        if (!usernameVal) {
            usernameError.textContent = 'Por favor, informe seu usuário ou e-mail.';
            return;
        }
        if (!passwordVal) {
            passwordError.textContent = 'Por favor, digite sua senha.';
            return;
        }

        setLoading(true);

        const authResult = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: usernameVal, password: passwordVal })
        });

        setLoading(false);

        if (authResult && authResult.success) {
            localStorage.setItem('gfm_session', 'active');
            localStorage.setItem('gfm_user', authResult.user.name);
            loggedInUserName.textContent = authResult.user.name;
            
            showToast(`Bem-vindo ao Financeiro GFM, ${authResult.user.name}!`, 'success');
            loginView.classList.add('hidden');
            appView.classList.remove('hidden');
            
            loadDashboard();
            renderCollaboratorsTable();
            renderClientsTable();
        } else if (usernameVal.toLowerCase() === 'admin' || usernameVal.includes('@')) {
            // Offline fallback
            localStorage.setItem('gfm_session', 'active');
            localStorage.setItem('gfm_user', usernameVal);
            loggedInUserName.textContent = usernameVal;
            
            showToast(`Bem-vindo ao Financeiro GFM, ${usernameVal}!`, 'success');
            loginView.classList.add('hidden');
            appView.classList.remove('hidden');
            
            loadDashboard();
            renderCollaboratorsTable();
            renderClientsTable();
        } else {
            showAlert('Usuário ou senha incorretos. Dica: use "admin" ou seu e-mail.', 'error');
            showToast('Falha na autenticação.', 'error');
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'Autenticando...';
            btnIcon.classList.add('hidden');
            spinner.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Entrar no Sistema';
            btnIcon.classList.remove('hidden');
            spinner.classList.add('hidden');
        }
    }

    function showAlert(msg, type) {
        alertMessage.textContent = msg;
        alertBox.className = `alert-box ${type}`;
        alertBox.classList.remove('hidden');
    }

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('gfm_session');
        loginView.classList.remove('hidden');
        appView.classList.add('hidden');
        showToast('Sessão encerrada com segurança.', 'info');
    });

    // --------------------------------------------------------------------------
    // 7. Navigation Tabs Logic
    // --------------------------------------------------------------------------
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('data-target');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            contentSections.forEach(sec => sec.classList.add('hidden'));
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.remove('hidden');

            closeMobileMenu();

            // Update Titles
            if (targetId === 'dashboardSection') {
                pageTitle.textContent = 'Dashboard';
                pageSubtitle.textContent = 'Visão geral do desempenho e equipe da Rádio Grande FM 94.5';
                loadDashboard();
            } else if (targetId === 'collaboratorsSection') {
                pageTitle.textContent = 'Gestão de Colaboradores';
                pageSubtitle.textContent = 'Cadastro, funções e remuneração da equipe da emissora';
                renderCollaboratorsTable();
            } else if (targetId === 'clientsSection') {
                pageTitle.textContent = 'Clientes & Anunciantes';
                pageSubtitle.textContent = 'Gestão de contratos comerciais, cotas de patrocínio e anunciantes 94.5 FM';
                renderClientsTable();
            } else if (targetId === 'financialSection') {
                pageTitle.textContent = 'Financeiro & DRE';
                pageSubtitle.textContent = 'Demonstrativo de resultados e receitas comerciais';
            } else if (targetId === 'settingsSection') {
                pageTitle.textContent = 'Configurações';
                pageSubtitle.textContent = 'Preferências do sistema e parâmetros de segurança';
            }

            refreshIcons();
        });
    });

    quickAddCollaboratorBtn.addEventListener('click', () => {
        document.getElementById('navCollaborators').click();
        openCollaboratorModal();
    });

    quickAddClientBtn.addEventListener('click', () => {
        document.getElementById('navClients').click();
        openClientModal();
    });

    // Helper Formatters
    function formatCurrency(val) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }

    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return dateStr;
    }

    // --------------------------------------------------------------------------
    // 8. Store & API Fetching Logic
    // --------------------------------------------------------------------------
    async function getCollaborators() {
        const apiData = await apiFetch('/collaborators');
        if (apiData) {
            localStorage.setItem('gfm_collaborators', JSON.stringify(apiData));
            return apiData;
        }
        return JSON.parse(localStorage.getItem('gfm_collaborators')) || INITIAL_COLLABORATORS;
    }

    async function getClients() {
        const apiData = await apiFetch('/clients');
        if (apiData) {
            localStorage.setItem('gfm_clients', JSON.stringify(apiData));
            return apiData;
        }
        return JSON.parse(localStorage.getItem('gfm_clients')) || INITIAL_CLIENTS;
    }

    // Load Dashboard Metrics
    async function loadDashboard() {
        const stats = await apiFetch('/dashboard/stats');
        
        let collabs = [];
        let clients = [];

        if (stats) {
            kpiCollaborators.textContent = stats.activeCollaborators;
            kpiPayroll.textContent = formatCurrency(stats.totalPayroll);
            kpiClientRevenue.textContent = formatCurrency(stats.totalClientRevenue);
            kpiClientsCount.textContent = stats.totalClients;
            sidebarCollaboratorsCount.textContent = stats.totalCollaborators;
            sidebarClientsCount.textContent = stats.totalClients;
            kpiDepartments.textContent = stats.departmentsCount;

            // Render Dept Bars from API
            deptDistributionList.innerHTML = '';
            const maxDeptSalary = Math.max(...Object.values(stats.deptTotals), 1);
            Object.keys(stats.deptTotals).forEach(deptName => {
                const amount = stats.deptTotals[deptName];
                const pct = Math.round((amount / maxDeptSalary) * 100);
                const barItem = document.createElement('div');
                barItem.className = 'dept-bar-item';
                barItem.innerHTML = `
                    <div class="dept-bar-label">
                        <span>${deptName}</span>
                        <span>${formatCurrency(amount)}</span>
                    </div>
                    <div class="dept-bar-track">
                        <div class="dept-bar-fill" style="width: ${pct}%"></div>
                    </div>
                `;
                deptDistributionList.appendChild(barItem);
            });
            return;
        }

        // Fallback calculations if API is offline
        collabs = await getCollaborators();
        clients = await getClients();

        kpiCollaborators.textContent = collabs.filter(c => c.status === 'Ativo' || c.status === 'Férias').length;
        sidebarCollaboratorsCount.textContent = collabs.length;

        const totalPayroll = collabs.reduce((acc, c) => c.status !== 'Inativo' ? acc + parseFloat(c.salary || 0) : acc, 0);
        kpiPayroll.textContent = formatCurrency(totalPayroll);

        const activeClients = clients.filter(c => c.status === 'Ativo');
        const totalClientRevenue = activeClients.reduce((acc, c) => acc + parseFloat(c.value || 0), 0);
        kpiClientRevenue.textContent = formatCurrency(totalClientRevenue);
        kpiClientsCount.textContent = clients.length;
        sidebarClientsCount.textContent = clients.length;

        deptDistributionList.innerHTML = '';
        const deptTotals = {};
        collabs.forEach(c => {
            if (c.status !== 'Inativo') {
                deptTotals[c.dept] = (deptTotals[c.dept] || 0) + parseFloat(c.salary || 0);
            }
        });

        const maxDeptSalary = Math.max(...Object.values(deptTotals), 1);
        Object.keys(deptTotals).forEach(deptName => {
            const amount = deptTotals[deptName];
            const pct = Math.round((amount / maxDeptSalary) * 100);
            const barItem = document.createElement('div');
            barItem.className = 'dept-bar-item';
            barItem.innerHTML = `
                <div class="dept-bar-label">
                    <span>${deptName}</span>
                    <span>${formatCurrency(amount)}</span>
                </div>
                <div class="dept-bar-track">
                    <div class="dept-bar-fill" style="width: ${pct}%"></div>
                </div>
            `;
            deptDistributionList.appendChild(barItem);
        });
    }

    // --------------------------------------------------------------------------
    // 9. Collaborators Table & Logic
    // --------------------------------------------------------------------------
    async function renderCollaboratorsTable() {
        const collabs = await getCollaborators();
        const query = searchCollaboratorInput.value.toLowerCase().trim();
        const deptFilter = deptFilterSelect.value;
        const statusFilter = statusFilterSelect.value;

        const filtered = collabs.filter(item => {
            const matchesQuery = item.name.toLowerCase().includes(query) || 
                                item.role.toLowerCase().includes(query) || 
                                item.email.toLowerCase().includes(query) || 
                                item.cpf.includes(query) ||
                                (item.code && item.code.toLowerCase().includes(query));
            
            const matchesDept = (deptFilter === 'ALL') || (item.dept === deptFilter);
            const matchesStatus = (statusFilter === 'ALL') || (item.status === statusFilter);

            return matchesQuery && matchesDept && matchesStatus;
        });

        collaboratorsTableBody.innerHTML = '';

        if (filtered.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');

            filtered.forEach(collab => {
                const tr = document.createElement('tr');
                const statusClass = collab.status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                const displayCode = collab.code ? String(collab.code).padStart(2, '0') : String(collab.id).padStart(2, '0');
                tr.innerHTML = `
                    <td>
                        <span class="collab-code-badge">${displayCode}</span>
                    </td>
                    <td>
                        <div class="collab-cell">
                            <img src="${collab.avatar}" alt="${collab.name}" class="collab-avatar">
                            <div class="collab-meta">
                                <span class="collab-name">${collab.name}</span>
                                <span class="collab-email">${collab.email}</span>
                            </div>
                        </div>
                    </td>
                    <td><strong>${collab.role}</strong></td>
                    <td>${collab.dept}</td>
                    <td>${collab.cpf}</td>
                    <td><strong>${formatCurrency(collab.salary)}</strong></td>
                    <td>${formatDate(collab.hireDate)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ● ${collab.status}
                        </span>
                    </td>
                    <td class="text-right">
                        <div class="action-btns">
                            <button class="icon-action-btn edit" data-id="${collab.id}" title="Editar Colaborador">
                                <i data-lucide="edit-3"></i>
                            </button>
                            <button class="icon-action-btn delete" data-id="${collab.id}" title="Excluir Colaborador">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                `;
                collaboratorsTableBody.appendChild(tr);
            });
        }

        refreshIcons();
        attachCollabTableEvents();
    }

    function attachCollabTableEvents() {
        document.querySelectorAll('#collaboratorsTableBody .icon-action-btn.edit').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const collabs = await getCollaborators();
                const target = collabs.find(c => c.id === id);
                if (target) openCollaboratorModal(target);
            });
        });

        document.querySelectorAll('#collaboratorsTableBody .icon-action-btn.delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const collabs = await getCollaborators();
                const target = collabs.find(c => c.id === id);

                if (target && confirm(`Tem certeza que deseja remover "${target.name}" da equipe Grande FM?`)) {
                    await apiFetch(`/collaborators/${id}`, { method: 'DELETE' });
                    
                    const updated = collabs.filter(c => c.id !== id);
                    localStorage.setItem('gfm_collaborators', JSON.stringify(updated));
                    
                    loadDashboard();
                    renderCollaboratorsTable();
                    showToast(`Colaborador ${target.name} removido com sucesso.`, 'info');
                }
            });
        });
    }

    searchCollaboratorInput.addEventListener('input', renderCollaboratorsTable);
    deptFilterSelect.addEventListener('change', renderCollaboratorsTable);
    statusFilterSelect.addEventListener('change', renderCollaboratorsTable);

    async function openCollaboratorModal(collabData = null) {
        collaboratorForm.reset();

        if (collabData) {
            modalTitle.textContent = 'Editar Colaborador';
            collabIdInput.value = collabData.id;
            document.getElementById('collabCode').value = collabData.code ? String(collabData.code).padStart(2, '0') : String(collabData.id).padStart(2, '0');
            collabNameInput.value = collabData.name;
            collabEmailInput.value = collabData.email;
            collabCpfInput.value = collabData.cpf;
            collabRoleInput.value = collabData.role;
            collabDeptSelect.value = collabData.dept;
            collabSalaryInput.value = collabData.salary;
            collabHireDateInput.value = collabData.hireDate;
            collabStatusSelect.value = collabData.status;
            currentCollabPhotoData = collabData.avatar || DEFAULT_PHOTO;
            photoPreview.src = currentCollabPhotoData;
        } else {
            modalTitle.textContent = 'Cadastrar Novo Colaborador';
            collabIdInput.value = '';
            
            const allCollabs = await getCollaborators();
            const maxNum = allCollabs.reduce((max, c) => {
                const num = parseInt(c.code) || 0;
                return num > max ? num : max;
            }, 0);
            const nextCode = String(maxNum + 1).padStart(2, '0');
            document.getElementById('collabCode').value = nextCode;

            collabHireDateInput.value = new Date().toISOString().split('T')[0];
            currentCollabPhotoData = DEFAULT_PHOTO;
            photoPreview.src = currentCollabPhotoData;
        }

        collaboratorModal.classList.remove('hidden');
        refreshIcons();
    }

    function closeCollaboratorModal() {
        collaboratorModal.classList.add('hidden');
    }

    openAddModalBtn.addEventListener('click', () => openCollaboratorModal());
    closeCollaboratorModalBtn.addEventListener('click', closeCollaboratorModal);
    cancelCollabBtn.addEventListener('click', closeCollaboratorModal);

    collaboratorModal.addEventListener('click', (e) => {
        if (e.target === collaboratorModal) closeCollaboratorModal();
    });

    collaboratorForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = collabIdInput.value;

        // Generate automatic code for new collaborators
        let autoCode = document.getElementById('collabCode').value;
        if (!id && !autoCode) {
            const allCollabs = await getCollaborators();
            const maxNum = allCollabs.reduce((max, c) => {
                const num = parseInt(c.code) || 0;
                return num > max ? num : max;
            }, 0);
            autoCode = String(maxNum + 1).padStart(2, '0');
        }

        const newCollab = {
            id: id || Date.now().toString(),
            code: autoCode,
            name: collabNameInput.value.trim(),
            email: collabEmailInput.value.trim(),
            cpf: collabCpfInput.value.trim(),
            role: collabRoleInput.value.trim(),
            dept: collabDeptSelect.value,
            salary: parseFloat(collabSalaryInput.value) || 0,
            hireDate: collabHireDateInput.value,
            status: collabStatusSelect.value,
            avatar: currentCollabPhotoData || DEFAULT_PHOTO
        };

        if (id) {
            await apiFetch(`/collaborators/${id}`, { method: 'PUT', body: JSON.stringify(newCollab) });
            showToast(`Colaborador "${newCollab.name}" atualizado com sucesso!`, 'success');
        } else {
            await apiFetch('/collaborators', { method: 'POST', body: JSON.stringify(newCollab) });
            showToast(`Novo colaborador "${newCollab.name}" cadastrado!`, 'success');
        }

        loadDashboard();
        renderCollaboratorsTable();
        closeCollaboratorModal();
    });

    // --------------------------------------------------------------------------
    // 10. Clients Table & Logic
    // --------------------------------------------------------------------------
    async function renderClientsTable() {
        const clients = await getClients();
        const collabs = await getCollaborators();
        const query = searchClientInput.value.toLowerCase().trim();
        const segmentFilter = segmentFilterSelect.value;
        const statusFilter = clientStatusFilterSelect.value;

        const filtered = clients.filter(item => {
            const matchesQuery = item.name.toLowerCase().includes(query) || 
                                item.cnpj.includes(query) || 
                                item.executive.toLowerCase().includes(query) ||
                                item.email.toLowerCase().includes(query);
            
            const matchesSegment = (segmentFilter === 'ALL') || (item.segment === segmentFilter);
            const matchesStatus = (statusFilter === 'ALL') || (item.status === statusFilter);

            return matchesQuery && matchesSegment && matchesStatus;
        });

        clientsTableBody.innerHTML = '';

        if (filtered.length === 0) {
            emptyClientState.classList.remove('hidden');
        } else {
            emptyClientState.classList.add('hidden');

            filtered.forEach(client => {
                const tr = document.createElement('tr');
                const statusClass = client.status.toLowerCase().replace(/\s+/g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                // Executivos e Comissões Dinâmicas
                let execsList = client.executives;
                if (!execsList || execsList.length === 0) {
                    execsList = [{ executive: client.executive || '', commission: client.commission !== undefined ? client.commission : 10.0 }];
                }

                let execCellHtml = '';
                let commissionCellHtml = '';

                execsList.forEach(item => {
                    const matchedCollab = collabs.find(c => 
                        c.code === item.executive || 
                        String(c.code).padStart(2, '0') === String(item.executive).padStart(2, '0') ||
                        c.name.toLowerCase().includes((item.executive || '').toLowerCase())
                    );
                    const nameStr = matchedCollab ? `<span class="collab-code-badge">${matchedCollab.code}</span> ${matchedCollab.name}` : `<strong>${item.executive || '-'}</strong>`;
                    
                    const pct = parseFloat(item.commission !== undefined ? item.commission : 10.0);
                    const val = (parseFloat(client.value || 0) * pct) / 100;

                    execCellHtml += `<div style="margin-bottom:0.25rem;">${nameStr}</div>`;
                    commissionCellHtml += `
                        <div class="commission-meta" style="margin-bottom:0.25rem;">
                            <span class="commission-badge">${pct.toFixed(1)}%</span>
                            <span class="commission-calc">${formatCurrency(val)}</span>
                        </div>
                    `;
                });

                tr.innerHTML = `
                    <td>
                        <div class="collab-cell">
                            <img src="${client.logo}" alt="${client.name}" class="collab-avatar">
                            <div class="collab-meta">
                                <span class="collab-name">${client.name}</span>
                                <span class="collab-email">${client.email} • ${client.phone}</span>
                            </div>
                        </div>
                    </td>
                    <td>${client.cnpj}</td>
                    <td><span class="segment-pill">${client.segment}</span></td>
                    <td>${execCellHtml}</td>
                    <td>${commissionCellHtml}</td>
                    <td><strong>${formatCurrency(client.value)}</strong></td>
                    <td>${formatDate(client.endDate)}</td>
                    <td>
                        <span class="status-badge ${statusClass}">
                            ● ${client.status}
                        </span>
                    </td>
                    <td class="text-right">
                        <div class="action-btns">
                            <button class="icon-action-btn edit-client" data-id="${client.id}" title="Editar Cliente">
                                <i data-lucide="edit-3"></i>
                            </button>
                            <button class="icon-action-btn delete-client delete" data-id="${client.id}" title="Excluir Cliente">
                                <i data-lucide="trash-2"></i>
                            </button>
                        </div>
                    </td>
                `;
                clientsTableBody.appendChild(tr);
            });
        }

        refreshIcons();
        attachClientTableEvents();
    }

    function attachClientTableEvents() {
        document.querySelectorAll('.icon-action-btn.edit-client').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const clients = await getClients();
                const target = clients.find(c => c.id === id);
                if (target) openClientModal(target);
            });
        });

        document.querySelectorAll('.icon-action-btn.delete-client').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.getAttribute('data-id');
                const clients = await getClients();
                const target = clients.find(c => c.id === id);

                if (target && confirm(`Tem certeza que deseja remover o cliente "${target.name}"?`)) {
                    await apiFetch(`/clients/${id}`, { method: 'DELETE' });
                    
                    const updated = clients.filter(c => c.id !== id);
                    localStorage.setItem('gfm_clients', JSON.stringify(updated));

                    loadDashboard();
                    renderClientsTable();
                    showToast(`Cliente ${target.name} removido com sucesso.`, 'info');
                }
            });
        });
    }

    searchClientInput.addEventListener('input', renderClientsTable);
    segmentFilterSelect.addEventListener('change', renderClientsTable);
    clientStatusFilterSelect.addEventListener('change', renderClientsTable);

    // --------------------------------------------------------------------------
    // Searchable Select Component & Dynamic Multi-Collaborator Management
    // --------------------------------------------------------------------------
    let currentClientCollaboratorRows = [];

    function createSearchableSelect(container, collabsList, selectedCode, onSelect) {
        container.innerHTML = '';
        container.className = 'searchable-select';

        let currentSelected = collabsList.find(c => 
            c.code === selectedCode || 
            String(c.code).padStart(2, '0') === String(selectedCode).padStart(2, '0') ||
            c.name.toLowerCase().includes((selectedCode || '').toLowerCase())
        );

        const trigger = document.createElement('div');
        trigger.className = 'searchable-trigger';
        
        function updateTriggerText() {
            if (currentSelected) {
                const code = currentSelected.code ? String(currentSelected.code).padStart(2, '0') : String(currentSelected.id).padStart(2, '0');
                trigger.innerHTML = `
                    <div class="searchable-trigger-content">
                        <i data-lucide="user-check" style="width:16px;height:16px;color:var(--primary-blue);"></i>
                        <span class="collab-code-badge">${code}</span>
                        <strong style="color:var(--text-title);">${currentSelected.name}</strong>
                        <span style="font-size:0.75rem;color:var(--text-muted);">(${currentSelected.dept})</span>
                    </div>
                    <i data-lucide="chevron-down" style="width:16px;height:16px;color:var(--text-muted);margin-left:auto;"></i>
                `;
            } else {
                trigger.innerHTML = `
                    <div class="searchable-trigger-content">
                        <i data-lucide="user-check" style="width:16px;height:16px;color:var(--text-muted);"></i>
                        <span class="searchable-placeholder">Selecione ou pesquise o colaborador por código ou nome...</span>
                    </div>
                    <i data-lucide="chevron-down" style="width:16px;height:16px;color:var(--text-muted);margin-left:auto;"></i>
                `;
            }
            refreshIcons();
        }
        updateTriggerText();

        const dropdown = document.createElement('div');
        dropdown.className = 'searchable-dropdown hidden';

        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'searchable-search-wrapper';
        searchWrapper.innerHTML = `
            <i data-lucide="search"></i>
            <input type="text" placeholder="Buscar por código (ex: 02), nome ou cargo...">
        `;

        const optionsList = document.createElement('div');
        optionsList.className = 'searchable-options-list';

        function renderOptions(filterQuery = '') {
            optionsList.innerHTML = '';
            const q = filterQuery.toLowerCase().trim();

            const filtered = collabsList.filter(c => {
                const codeStr = c.code ? String(c.code).padStart(2, '0') : String(c.id).padStart(2, '0');
                return codeStr.includes(q) ||
                       c.name.toLowerCase().includes(q) ||
                       c.role.toLowerCase().includes(q) ||
                       c.dept.toLowerCase().includes(q);
            });

            if (filtered.length === 0) {
                optionsList.innerHTML = '<div class="searchable-empty-msg">Nenhum colaborador encontrado com esses termos</div>';
                return;
            }

            filtered.forEach(c => {
                const code = c.code ? String(c.code).padStart(2, '0') : String(c.id).padStart(2, '0');
                const isSel = currentSelected && currentSelected.id === c.id;
                const item = document.createElement('div');
                item.className = `searchable-option-item ${isSel ? 'selected' : ''}`;
                item.innerHTML = `
                    <span class="collab-code-badge">${code}</span>
                    <img src="${c.avatar || DEFAULT_PHOTO}" alt="${c.name}" class="collab-avatar" style="width:28px;height:28px;">
                    <div class="searchable-option-meta">
                        <span class="searchable-option-name">${c.name}</span>
                        <span class="searchable-option-role">${c.role} • ${c.dept}</span>
                    </div>
                `;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentSelected = c;
                    updateTriggerText();
                    dropdown.classList.add('hidden');
                    container.classList.remove('open');
                    if (onSelect) onSelect(c);
                });
                optionsList.appendChild(item);
            });
        }

        renderOptions();

        const searchInput = searchWrapper.querySelector('input');
        searchInput.addEventListener('input', (e) => {
            renderOptions(e.target.value);
        });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.searchable-dropdown').forEach(d => {
                if (d !== dropdown) d.classList.add('hidden');
            });
            document.querySelectorAll('.searchable-select').forEach(s => {
                if (s !== container) s.classList.remove('open');
            });

            const isOpening = dropdown.classList.contains('hidden');
            dropdown.classList.toggle('hidden');
            container.classList.toggle('open', isOpening);
            if (isOpening) {
                searchInput.value = '';
                renderOptions('');
                setTimeout(() => searchInput.focus(), 50);
            }
        });

        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                dropdown.classList.add('hidden');
                container.classList.remove('open');
            }
        });

        dropdown.appendChild(searchWrapper);
        dropdown.appendChild(optionsList);
        container.appendChild(trigger);
        container.appendChild(dropdown);
        refreshIcons();

        return {
            getSelected: () => currentSelected
        };
    }

    function renderClientCollaboratorRows(collabsList, initialRows = []) {
        const listContainer = document.getElementById('clientCollaboratorsList');
        if (!listContainer) return;
        listContainer.innerHTML = '';
        currentClientCollaboratorRows = [];

        if (initialRows.length === 0) {
            initialRows.push({ executive: '', commission: 10.0 });
        }

        initialRows.forEach((row, index) => {
            const rowEl = document.createElement('div');
            rowEl.className = 'collab-row';
            
            const selectContainer = document.createElement('div');
            
            const commWrapper = document.createElement('div');
            commWrapper.className = 'input-group';
            commWrapper.style.marginBottom = '0';
            commWrapper.innerHTML = `
                <label style="font-size:0.75rem;margin-bottom:0.25rem;">Comissão (%)</label>
                <div class="input-wrapper">
                    <i data-lucide="percent" class="input-icon"></i>
                    <input type="number" class="row-commission-input" step="0.1" min="0" max="100" value="${row.commission !== undefined ? row.commission : 10.0}" placeholder="10.0" required style="padding-left:2.5rem;">
                </div>
            `;

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-collab-row-btn';
            removeBtn.title = 'Remover este colaborador';
            removeBtn.innerHTML = '<i data-lucide="trash-2"></i>';
            if (initialRows.length === 1) {
                removeBtn.style.opacity = '0.5';
                removeBtn.style.cursor = 'not-allowed';
            } else {
                removeBtn.addEventListener('click', () => {
                    const updatedRows = currentClientCollaboratorRows
                        .filter((_, i) => i !== index)
                        .map(r => ({
                            executive: r.selectable.getSelected() ? r.selectable.getSelected().code : r.executive,
                            commission: parseFloat(r.rowEl.querySelector('.row-commission-input').value) || 0
                        }));
                    renderClientCollaboratorRows(collabsList, updatedRows);
                });
            }

            const selectable = createSearchableSelect(selectContainer, collabsList, row.executive, (selectedCollab) => {
                row.executive = selectedCollab.code;
            });

            rowEl.appendChild(selectContainer);
            rowEl.appendChild(commWrapper);
            rowEl.appendChild(removeBtn);
            listContainer.appendChild(rowEl);

            currentClientCollaboratorRows.push({
                selectable,
                rowEl,
                executive: row.executive,
                commission: row.commission
            });
        });

        refreshIcons();
    }

    const addCollaboratorRowBtn = document.getElementById('addCollaboratorRowBtn');
    if (addCollaboratorRowBtn) {
        addCollaboratorRowBtn.addEventListener('click', async () => {
            const collabsList = await getCollaborators();
            const existingRows = currentClientCollaboratorRows.map(r => ({
                executive: r.selectable.getSelected() ? r.selectable.getSelected().code : r.executive,
                commission: parseFloat(r.rowEl.querySelector('.row-commission-input').value) || 0
            }));
            existingRows.push({ executive: '', commission: 10.0 });
            renderClientCollaboratorRows(collabsList, existingRows);
        });
    }

    searchClientInput.addEventListener('input', renderClientsTable);
    segmentFilterSelect.addEventListener('change', renderClientsTable);
    clientStatusFilterSelect.addEventListener('change', renderClientsTable);

    async function openClientModal(clientData = null) {
        clientForm.reset();

        const collabs = await getCollaborators();

        if (clientData) {
            clientModalTitle.textContent = 'Editar Cliente Anunciante';
            clientIdInput.value = clientData.id;
            clientNameInput.value = clientData.name;
            clientCnpjInput.value = clientData.cnpj;
            clientEmailInput.value = clientData.email;
            clientPhoneInput.value = clientData.phone;
            clientSegmentSelect.value = clientData.segment;
            clientValueInput.value = clientData.value;
            
            let initialRows = clientData.executives && clientData.executives.length > 0
                ? clientData.executives
                : [{ executive: clientData.executive || '', commission: clientData.commission !== undefined ? clientData.commission : 10.0 }];

            renderClientCollaboratorRows(collabs, initialRows);

            clientStartDateInput.value = clientData.startDate;
            clientEndDateInput.value = clientData.endDate;
            clientStatusSelect.value = clientData.status;
            currentClientLogoData = clientData.logo || DEFAULT_LOGO;
            clientLogoPreview.src = currentClientLogoData;
        } else {
            clientModalTitle.textContent = 'Cadastrar Novo Cliente Anunciante';
            clientIdInput.value = '';
            
            renderClientCollaboratorRows(collabs, [{ executive: '', commission: 10.0 }]);

            const today = new Date().toISOString().split('T')[0];
            const nextYear = new Date();
            nextYear.setFullYear(nextYear.getFullYear() + 1);
            clientStartDateInput.value = today;
            clientEndDateInput.value = nextYear.toISOString().split('T')[0];
            currentClientLogoData = DEFAULT_LOGO;
            clientLogoPreview.src = currentClientLogoData;
        }

        clientModal.classList.remove('hidden');
        refreshIcons();
    }

    function closeClientModal() {
        clientModal.classList.add('hidden');
    }

    openAddClientModalBtn.addEventListener('click', () => openClientModal());
    closeClientModalBtn.addEventListener('click', closeClientModal);
    cancelClientBtn.addEventListener('click', closeClientModal);

    clientModal.addEventListener('click', (e) => {
        if (e.target === clientModal) closeClientModal();
    });

    clientForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = clientIdInput.value;

        // Coletar múltiplos colaboradores e comissões
        const executivesList = currentClientCollaboratorRows.map(r => {
            const selected = r.selectable.getSelected();
            return {
                executive: selected ? selected.code : r.executive,
                commission: parseFloat(r.rowEl.querySelector('.row-commission-input').value) || 0
            };
        }).filter(item => item.executive !== '');

        const primaryExec = executivesList.length > 0 ? executivesList[0].executive : '';
        const primaryComm = executivesList.length > 0 ? executivesList[0].commission : 10.0;

        const newClient = {
            id: id || 'c' + Date.now().toString(),
            name: clientNameInput.value.trim(),
            cnpj: clientCnpjInput.value.trim(),
            email: clientEmailInput.value.trim(),
            phone: clientPhoneInput.value.trim(),
            segment: clientSegmentSelect.value,
            value: parseFloat(clientValueInput.value) || 0,
            executive: primaryExec,
            commission: primaryComm,
            executives: executivesList,
            startDate: clientStartDateInput.value,
            endDate: clientEndDateInput.value,
            status: clientStatusSelect.value,
            logo: currentClientLogoData || DEFAULT_LOGO
        };

        if (id) {
            await apiFetch(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(newClient) });
            showToast(`Cliente "${newClient.name}" atualizado com sucesso!`, 'success');
        } else {
            await apiFetch('/clients', { method: 'POST', body: JSON.stringify(newClient) });
            showToast(`Novo cliente "${newClient.name}" cadastrado!`, 'success');
        }

        loadDashboard();
        renderClientsTable();
        closeClientModal();
    });

    // --------------------------------------------------------------------------
    // 11. Toast Notification System
    // --------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle';
        if (type === 'error') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        refreshIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // --------------------------------------------------------------------------
    // 12. Radio Live Player Logic
    // --------------------------------------------------------------------------
    radioPlayBtn.addEventListener('click', () => {
        isRadioPlaying = !isRadioPlaying;

        if (isRadioPlaying) {
            radioPlayIcon.classList.add('hidden');
            radioPauseIcon.classList.remove('hidden');
            audioWavesIcon.classList.add('playing');
            showToast('Transmitindo Rádio Grande FM 94.5 Ao Vivo', 'success');
        } else {
            radioPlayIcon.classList.remove('hidden');
            radioPauseIcon.classList.add('hidden');
            audioWavesIcon.classList.remove('playing');
        }
    });

    // --------------------------------------------------------------------------
    // 13. Canvas Background Radio Waves
    // --------------------------------------------------------------------------
    const canvas = document.getElementById('wavesCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let step = 0;
    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const waveColor1 = isDark ? 'rgba(0, 120, 212, 0.12)' : 'rgba(0, 120, 212, 0.06)';
        const waveColor2 = isDark ? 'rgba(0, 210, 255, 0.08)' : 'rgba(0, 150, 255, 0.04)';

        step += 0.015;

        // Wave 1
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = waveColor1;
        for (let x = 0; x < canvas.width; x += 10) {
            const y = Math.sin(x * 0.003 + step) * 45 + Math.cos(x * 0.001 + step) * 20 + canvas.height * 0.65;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Wave 2
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = waveColor2;
        for (let x = 0; x < canvas.width; x += 10) {
            const y = Math.cos(x * 0.004 - step) * 35 + Math.sin(x * 0.002 + step) * 30 + canvas.height * 0.70;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

        requestAnimationFrame(drawWaves);
    }
    drawWaves();
});
