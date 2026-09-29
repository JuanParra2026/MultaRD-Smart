/**
 * ============================================================================
 * MULTARD SMART - SISTEMA EDUCATIVO DE GESTIÓN Y CÁLCULO DE MULTAS DE TRÁNSITO
 * ============================================================================
 * Archivo: script.js
 * Descripción: Lógica completa de la aplicación en Vanilla JavaScript (ES6+)
 * Incluye: State management con localStorage, cálculo dinámico, gráficos con Chart.js,
 * motor de análisis de datos, filtros en vivo, exportación JSON/CSV e impresión de comprobante.
 * ============================================================================
 */

(function () {
    'use strict';

    // ------------------------------------------------------------------------
    // 1. CONSTANTES & DATOS POR DEFECTO (DEMO INICIAL)
    // ------------------------------------------------------------------------
    const STORAGE_KEYS = {
        FINES: 'MULTARD_SMART_FINES_V1',
        CATALOG: 'MULTARD_SMART_CATALOG_V1',
        CONFIG: 'MULTARD_SMART_CONFIG_V1',
        THEME: 'MULTARD_SMART_THEME'
    };

    // Catálogo inicial demostrativo de infracciones
    const DEFAULT_CATALOG = [
        {
            code: 'INF-001',
            nombre: 'Exceso de velocidad',
            categoria: 'Tránsito y Velocidad',
            nivel: 'Grave',
            monto: 1667.00,
            activo: true,
            descripcion: 'Superar los límites de velocidad fijados por las señales viales correspondientes.'
        },
        {
            code: 'INF-002',
            nombre: 'No utilizar cinturón de seguridad',
            categoria: 'Seguridad Pasiva',
            nivel: 'Moderada',
            monto: 1000.00,
            activo: true,
            descripcion: 'Conducir o transitar sin llevar abrochado debidamente el cinturón de seguridad reglamentario.'
        },
        {
            code: 'INF-003',
            nombre: 'Conducir utilizando el teléfono celular',
            categoria: 'Distracción al Volante',
            nivel: 'Grave',
            monto: 1667.00,
            activo: true,
            descripcion: 'Operar o sostener dispositivos móviles de comunicación mientras el vehículo está en marcha.'
        },
        {
            code: 'INF-004',
            nombre: 'Estacionamiento indebido o en zona prohibida',
            categoria: 'Vía Pública',
            nivel: 'Leve',
            monto: 1000.00,
            activo: true,
            descripcion: 'Aparcar en aceras, paradas de autobús, rampas para discapacitados o frente a hidrantes.'
        },
        {
            code: 'INF-005',
            nombre: 'Pasar semáforo en luz roja',
            categoria: 'Señalización Vial',
            nivel: 'Muy Grave',
            monto: 2500.00,
            activo: true,
            descripcion: 'Cruzar intersecciones viales cuando la señal luminosa del semáforo indica alto obligatorio.'
        },
        {
            code: 'INF-006',
            nombre: 'No respetar señal de tránsito (PARE / CEDA)',
            categoria: 'Señalización Vial',
            nivel: 'Moderada',
            monto: 1200.00,
            activo: true,
            descripcion: 'Ignorar u omitir señales viales verticales y horizontales de prioridad de paso.'
        },
        {
            code: 'INF-007',
            nombre: 'Conducir sin documentación vigente',
            categoria: 'Documentación Legal',
            nivel: 'Moderada',
            monto: 1000.00,
            activo: true,
            descripcion: 'No portar licencia de conducir, marbete de circulación o póliza de seguro al día.'
        },
        {
            code: 'INF-008',
            nombre: 'Conducción temeraria o bajo efectos de alcohol',
            categoria: 'Delito Vial Crítico',
            nivel: 'Muy Grave',
            monto: 5000.00,
            activo: true,
            descripcion: 'Poner en peligro manifiesto la vida de terceros por maniobras imprudentes o estado de embriaguez.'
        },
        {
            code: 'INF-009',
            nombre: 'Giro prohibido en U o en intersección',
            categoria: 'Maniobra Indebida',
            nivel: 'Leve',
            monto: 800.00,
            activo: true,
            descripcion: 'Efectuar maniobras de giro en lugares expresamente señalizados como prohibidos.'
        }
    ];

    // Registros iniciales de prueba (ficticios)
    const DEFAULT_FINES = [
        {
            id: 'MRD-2026-0001',
            fecha: '2026-09-28',
            hora: '08:45',
            conductor: 'Juan Carlos Pérez Gómez',
            licencia: '001-1234567-8',
            placa: 'A548921',
            vehiculo: 'Automóvil Privado',
            lugar: 'Av. 27 de Febrero esq. Winston Churchill',
            infraccion: 'Exceso de velocidad',
            categoria: 'Tránsito y Velocidad',
            nivel: 'Grave',
            montoBase: 1667.00,
            cantidad: 1,
            recargoPorc: 0,
            recargoMonto: 0.00,
            descuentoPorc: 20,
            descuentoMonto: 333.40,
            total: 1333.60,
            estado: 'Pagada',
            agente: 'Oficial R. Méndez (ID #4092)',
            observaciones: 'Conductor colaboró y realizó el pronto pago bancario demostrativo.'
        },
        {
            id: 'MRD-2026-0002',
            fecha: '2026-09-28',
            hora: '10:15',
            conductor: 'María Elena Rosario Díaz',
            licencia: '402-9876543-1',
            placa: 'G339012',
            vehiculo: 'Jeepeta / SUV',
            lugar: 'Av. John F. Kennedy esq. Máximo Gómez',
            infraccion: 'Pasar semáforo en luz roja',
            categoria: 'Señalización Vial',
            nivel: 'Muy Grave',
            montoBase: 2500.00,
            cantidad: 1,
            recargoPorc: 0,
            recargoMonto: 0.00,
            descuentoPorc: 0,
            descuentoMonto: 0.00,
            total: 2500.00,
            estado: 'Pendiente',
            agente: 'Oficial S. Tavárez (ID #1184)',
            observaciones: 'Vehículo captado por cámara de fiscalización en intersección.'
        },
        {
            id: 'MRD-2026-0003',
            fecha: '2026-09-27',
            hora: '14:20',
            conductor: 'Pedro Alejandro Morales Santana',
            licencia: '001-5566778-9',
            placa: 'K782341',
            vehiculo: 'Motocicleta',
            lugar: 'Autopista de Las Américas Km 12',
            infraccion: 'No utilizar cinturón de seguridad',
            categoria: 'Seguridad Pasiva',
            nivel: 'Moderada',
            montoBase: 1000.00,
            cantidad: 1,
            recargoPorc: 0,
            recargoMonto: 0.00,
            descuentoPorc: 0,
            descuentoMonto: 0.00,
            total: 1000.00,
            estado: 'Pendiente',
            agente: 'Oficial M. Castillo (ID #5521)',
            observaciones: 'Conductor sin casco protector reglamentario homologado.'
        },
        {
            id: 'MRD-2026-0004',
            fecha: '2026-09-27',
            hora: '19:40',
            conductor: 'Luis Alberto Fermín Ramos',
            licencia: '031-4455661-2',
            placa: 'L203948',
            vehiculo: 'Camión de Carga',
            lugar: 'Autopista Duarte Km 9',
            infraccion: 'Conducir utilizando el teléfono celular',
            categoria: 'Distracción al Volante',
            nivel: 'Grave',
            montoBase: 1667.00,
            cantidad: 1,
            recargoPorc: 15,
            recargoMonto: 250.05,
            descuentoPorc: 0,
            descuentoMonto: 0.00,
            total: 1917.05,
            estado: 'En revisión',
            agente: 'Oficial R. Méndez (ID #4092)',
            observaciones: 'Infracción cometida en horario nocturno con recargo aplicado.'
        },
        {
            id: 'MRD-2026-0005',
            fecha: '2026-09-26',
            hora: '11:10',
            conductor: 'Ana Sofía Batista Ventura',
            licencia: '001-3322114-5',
            placa: 'A991283',
            vehiculo: 'Automóvil Privado',
            lugar: 'Calle El Conde esq. Las Damas, Zona Colonial',
            infraccion: 'Estacionamiento indebido o en zona prohibida',
            categoria: 'Vía Pública',
            nivel: 'Leve',
            montoBase: 1000.00,
            cantidad: 1,
            recargoPorc: 0,
            recargoMonto: 0.00,
            descuentoPorc: 20,
            descuentoMonto: 200.00,
            total: 800.00,
            estado: 'Pagada',
            agente: 'Oficial D. Almonte (ID #8874)',
            observaciones: 'Vehículo obstaculizaba rampa de acceso peatonal.'
        },
        {
            id: 'MRD-2026-0006',
            fecha: '2026-09-25',
            hora: '16:55',
            conductor: 'Carlos Manuel Tejeda Pimentel',
            licencia: '002-8877665-0',
            placa: 'C451209',
            vehiculo: 'Vehículo de Transporte Público (Concho)',
            lugar: 'Av. Nicolás de Ovando esq. Duarte',
            infraccion: 'No respetar señal de tránsito (PARE / CEDA)',
            categoria: 'Señalización Vial',
            nivel: 'Moderada',
            montoBase: 1200.00,
            cantidad: 1,
            recargoPorc: 0,
            recargoMonto: 0.00,
            descuentoPorc: 0,
            descuentoMonto: 0.00,
            total: 1200.00,
            estado: 'Pagada',
            agente: 'Oficial S. Tavárez (ID #1184)',
            observaciones: 'Conductor detuvo el vehículo de manera imprudente en intersección.'
        },
        {
            id: 'MRD-2026-0007',
            fecha: '2026-09-24',
            hora: '22:15',
            conductor: 'Roberto Antonio Cedeño Gil',
            licencia: '001-7788990-1',
            placa: 'A674512',
            vehiculo: 'Automóvil Privado',
            lugar: 'Av. Abraham Lincoln esq. Gustavo Mejía Ricart',
            infraccion: 'Exceso de velocidad',
            categoria: 'Tránsito y Velocidad',
            nivel: 'Grave',
            montoBase: 1667.00,
            cantidad: 1,
            recargoPorc: 15,
            recargoMonto: 250.05,
            descuentoPorc: 0,
            descuentoMonto: 0.00,
            total: 1917.05,
            estado: 'Pendiente',
            agente: 'Oficial R. Méndez (ID #4092)',
            observaciones: 'Velocidad detectada: 98 km/h en zona urbana de 50 km/h.'
        },
        {
            id: 'MRD-2026-0008',
            fecha: '2026-09-23',
            hora: '15:30',
            conductor: 'Esteban José Núñez Marte',
            licencia: '001-9988776-3',
            placa: 'G889123',
            vehiculo: 'Jeepeta / SUV',
            lugar: 'Av. Luperón frente a Plaza Luperón',
            infraccion: 'Conducir sin documentación vigente',
            categoria: 'Documentación Legal',
            nivel: 'Moderada',
            montoBase: 1000.00,
            cantidad: 1,
            recargoPorc: 0,
            recargoMonto: 0.00,
            descuentoPorc: 0,
            descuentoMonto: 0.00,
            total: 1000.00,
            estado: 'Anulada',
            agente: 'Oficial M. Castillo (ID #5521)',
            observaciones: 'Anulada por comprobación posterior de seguro digital vigente en fiscalía.'
        }
    ];

    // ------------------------------------------------------------------------
    // 2. ESTADO DE LA APLICACIÓN (APP STATE)
    // ------------------------------------------------------------------------
    const state = {
        fines: [],
        catalog: [],
        config: {
            tariffLastUpdated: '28/09/2026',
            autoIncrementCounter: 9
        },
        charts: {
            dashInfracciones: null,
            dashEstados: null,
            statsType: null,
            statsEstados: null,
            statsNiveles: null,
            statsTimeline: null
        },
        pendingDeleteId: null
    };

    // ------------------------------------------------------------------------
    // 3. INICIALIZACIÓN & PERSISTENCIA (LOCALSTORAGE)
    // ------------------------------------------------------------------------
    function initApp() {
        loadTheme();
        loadStateFromStorage();
        startLiveClock();
        setupNavigation();
        setupFormListeners();
        setupHistoryFilters();
        setupCatalogListeners();
        setupBackupListeners();
        setupModalListeners();

        // Renderizado inicial de vistas
        populateInfractionSelect();
        setFormDefaultDates();
        updateAutoIdPreview();
        calculateLiveFormTotals();
        renderAllViews();

        console.log('🚗 MultaRD Smart inicializado con éxito.');
    }

    function loadStateFromStorage() {
        try {
            const savedFines = localStorage.getItem(STORAGE_KEYS.FINES);
            state.fines = savedFines ? JSON.parse(savedFines) : [...DEFAULT_FINES];

            const savedCatalog = localStorage.getItem(STORAGE_KEYS.CATALOG);
            state.catalog = savedCatalog ? JSON.parse(savedCatalog) : [...DEFAULT_CATALOG];

            const savedConfig = localStorage.getItem(STORAGE_KEYS.CONFIG);
            if (savedConfig) {
                state.config = JSON.parse(savedConfig);
            } else {
                state.config.autoIncrementCounter = state.fines.length + 1;
            }
        } catch (e) {
            console.error('Error al cargar datos desde localStorage:', e);
            state.fines = [...DEFAULT_FINES];
            state.catalog = [...DEFAULT_CATALOG];
        }

        saveStateToStorage();
    }

    function saveStateToStorage() {
        try {
            localStorage.setItem(STORAGE_KEYS.FINES, JSON.stringify(state.fines));
            localStorage.setItem(STORAGE_KEYS.CATALOG, JSON.stringify(state.catalog));
            localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(state.config));
        } catch (e) {
            console.error('Error al guardar datos en localStorage:', e);
            showToast('No se pudo guardar la información en memoria local.', 'error');
        }
    }

    // ------------------------------------------------------------------------
    // 4. SISTEMA DE TEMAS (DARK / LIGHT MODE)
    // ------------------------------------------------------------------------
    function loadTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        const themeToggleBtn = document.getElementById('themeToggleBtn');
        if (themeToggleBtn) {
            themeToggleBtn.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme') || 'dark';
                const nextTheme = current === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', nextTheme);
                localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
                showToast(`Modo ${nextTheme === 'dark' ? 'Oscuro 🌙' : 'Claro ☀️'} activado`, 'info');
                
                // Re-render charts for theme contrast
                setTimeout(() => renderCharts(), 150);
            });
        }
    }

    // ------------------------------------------------------------------------
    // 5. RELOJ Y FECHAS
    // ------------------------------------------------------------------------
    function startLiveClock() {
        const clockEl = document.getElementById('liveClock');
        function updateClock() {
            const now = new Date();
            if (clockEl) {
                clockEl.textContent = now.toLocaleTimeString('es-DO', { hour12: false });
            }
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    function setFormDefaultDates() {
        const inputFecha = document.getElementById('inputFecha');
        const inputHora = document.getElementById('inputHora');
        const now = new Date();

        if (inputFecha && !inputFecha.value) {
            inputFecha.value = now.toISOString().split('T')[0];
        }
        if (inputHora && !inputHora.value) {
            const hours = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            inputHora.value = `${hours}:${mins}`;
        }
    }

    function formatCurrency(amount) {
        const num = Number(amount) || 0;
        return 'RD$ ' + num.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatDateDisplay(dateStr) {
        if (!dateStr) return '-';
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dateStr;
    }

    // ------------------------------------------------------------------------
    // 6. NAVEGACIÓN Y TÍTULOS DINÁMICOS
    // ------------------------------------------------------------------------
    function setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        const pageTitle = document.getElementById('currentPageTitle');
        const pageSubtitle = document.getElementById('currentPageSubtitle');
        const sidebar = document.getElementById('sidebar');
        const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
        const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

        const sectionMeta = {
            'section-dashboard': { title: 'Panel Principal', subtitle: 'Resumen general y estadísticas en tiempo real' },
            'section-nueva-multa': { title: 'Calculadora / Nueva Multa', subtitle: 'Formulario de registro y cálculo automático de liquidación' },
            'section-historial': { title: 'Historial de Infracciones', subtitle: 'Buscador inteligente, filtros y gestión de registros' },
            'section-estadisticas': { title: 'Estadísticas & Gráficos', subtitle: 'Métricas de recaudación, estados y volúmenes de infracción' },
            'section-analisis': { title: 'Centro de Análisis Inteligente', subtitle: 'Detección automática de patrones, horas pico y recomendaciones' },
            'section-tarifas': { title: 'Catálogo de Tarifas', subtitle: 'Administración de tipos de infracción y montos sancionatorios' },
            'section-backup': { title: 'Copia de Seguridad & Datos', subtitle: 'Exportación en JSON / CSV, importación y seguridad local' },
            'section-normativa': { title: 'Marco Normativo', subtitle: 'Fundamentos de referencia y propósito educativo (Ley 63-17)' }
        };

        function switchSection(targetId) {
            document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
            navLinks.forEach(lnk => lnk.classList.remove('active'));

            const targetSection = document.getElementById(targetId);
            const activeLink = document.querySelector(`.nav-link[data-target="${targetId}"]`);

            if (targetSection) {
                targetSection.classList.add('active');
            }
            if (activeLink) {
                activeLink.classList.add('active');
            }

            if (sectionMeta[targetId]) {
                pageTitle.textContent = sectionMeta[targetId].title;
                pageSubtitle.textContent = sectionMeta[targetId].subtitle;
            }

            if (sidebar && window.innerWidth <= 860) {
                sidebar.classList.remove('open');
            }

            // Refrescar vistas específicas al entrar
            if (targetId === 'section-dashboard' || targetId === 'section-estadisticas') {
                renderCharts();
            } else if (targetId === 'section-analisis') {
                renderAnalysisCenter();
            } else if (targetId === 'section-historial') {
                renderHistorialTable();
            }
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('data-target');
                switchSection(target);
            });
        });

        // Botones de acceso rápido
        const btnQuickNewFine = document.getElementById('btnQuickNewFine');
        if (btnQuickNewFine) {
            btnQuickNewFine.addEventListener('click', () => switchSection('section-nueva-multa'));
        }

        const btnGoToHistorial = document.getElementById('btnGoToHistorial');
        if (btnGoToHistorial) {
            btnGoToHistorial.addEventListener('click', () => switchSection('section-historial'));
        }

        // Toggle Sidebar Mobile
        if (sidebarToggleBtn && sidebar) {
            sidebarToggleBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
        }
        if (sidebarCloseBtn && sidebar) {
            sidebarCloseBtn.addEventListener('click', () => sidebar.classList.remove('open'));
        }
    }

    // ------------------------------------------------------------------------
    // 7. CALCULADORA & FORMULARIO DE NUEVA MULTA
    // ------------------------------------------------------------------------
    function getNextFineId() {
        const year = new Date().getFullYear();
        const num = String(state.config.autoIncrementCounter || (state.fines.length + 1)).padStart(4, '0');
        return `MRD-${year}-${num}`;
    }

    function updateAutoIdPreview() {
        const display = document.getElementById('displayAutoId');
        if (display) {
            display.textContent = getNextFineId();
        }
    }

    function populateInfractionSelect() {
        const select = document.getElementById('selectInfraccion');
        if (!select) return;

        select.innerHTML = '';
        const activeItems = state.catalog.filter(i => i.activo !== false);

        activeItems.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.nombre;
            opt.textContent = `${item.nombre} (${item.nivel}) - ${formatCurrency(item.monto)}`;
            opt.dataset.code = item.code;
            opt.dataset.monto = item.monto;
            opt.dataset.nivel = item.nivel;
            opt.dataset.categoria = item.categoria;
            opt.dataset.descripcion = item.descripcion || '';
            select.appendChild(opt);
        });

        updateInfractionPreviewCard();
    }

    function updateInfractionPreviewCard() {
        const select = document.getElementById('selectInfraccion');
        if (!select || !select.selectedOptions.length) return;

        const opt = select.selectedOptions[0];
        const name = opt.value;
        const monto = parseFloat(opt.dataset.monto || 0);
        const nivel = opt.dataset.nivel || 'Leve';
        const categoria = opt.dataset.categoria || 'General';
        const descripcion = opt.dataset.descripcion || 'Sin descripción adicional.';

        const previewName = document.getElementById('previewInfractionName');
        const previewCat = document.getElementById('previewCategory');
        const previewLvl = document.getElementById('previewLevel');
        const previewBase = document.getElementById('previewBaseAmount');
        const previewDesc = document.getElementById('previewDescription');

        if (previewName) previewName.textContent = name;
        if (previewCat) previewCat.textContent = categoria;
        if (previewBase) previewBase.textContent = formatCurrency(monto);
        if (previewDesc) previewDesc.textContent = descripcion;

        if (previewLvl) {
            previewLvl.textContent = nivel;
            previewLvl.className = `badge-level level-${getLevelSlug(nivel)}`;
        }
    }

    function getLevelSlug(nivel) {
        const n = String(nivel).toLowerCase();
        if (n.includes('muy')) return 'muy-grave';
        if (n.includes('grave')) return 'grave';
        if (n.includes('mod')) return 'moderada';
        return 'leve';
    }

    function calculateLiveFormTotals() {
        const selectInf = document.getElementById('selectInfraccion');
        const inputQty = document.getElementById('inputCantidad');
        const selectRec = document.getElementById('selectRecargo');
        const selectDesc = document.getElementById('selectDescuento');

        let baseAmount = 0;
        if (selectInf && selectInf.selectedOptions.length) {
            baseAmount = parseFloat(selectInf.selectedOptions[0].dataset.monto || 0);
        }

        const qty = Math.max(1, parseInt(inputQty ? inputQty.value : 1) || 1);
        const subtotal = baseAmount * qty;

        const recargoPct = parseFloat(selectRec ? selectRec.value : 0) || 0;
        const recargoAmount = subtotal * (recargoPct / 100);

        const descuentoPct = parseFloat(selectDesc ? selectDesc.value : 0) || 0;
        const descuentoAmount = (subtotal + recargoAmount) * (descuentoPct / 100);

        const total = Math.max(0, subtotal + recargoAmount - descuentoAmount);

        // Update UI Live Display
        const lblBase = document.getElementById('calcLiveBase');
        const lblQty = document.getElementById('calcLiveQty');
        const lblSubtotal = document.getElementById('calcLiveSubtotal');
        const lblRecPct = document.getElementById('calcLiveRecargoPercent');
        const lblRecAmt = document.getElementById('calcLiveRecargoAmount');
        const lblDescPct = document.getElementById('calcLiveDescuentoPercent');
        const lblDescAmt = document.getElementById('calcLiveDescuentoAmount');
        const lblTotal = document.getElementById('calcLiveTotal');

        if (lblBase) lblBase.textContent = formatCurrency(baseAmount);
        if (lblQty) lblQty.textContent = `x ${qty}`;
        if (lblSubtotal) lblSubtotal.textContent = formatCurrency(subtotal);
        if (lblRecPct) lblRecPct.textContent = `${recargoPct}%`;
        if (lblRecAmt) lblRecAmt.textContent = `+ ${formatCurrency(recargoAmount)}`;
        if (lblDescPct) lblDescPct.textContent = `${descuentoPct}%`;
        if (lblDescAmt) lblDescAmt.textContent = `- ${formatCurrency(descuentoAmount)}`;
        if (lblTotal) lblTotal.textContent = formatCurrency(total);

        return {
            baseAmount,
            qty,
            subtotal,
            recargoPct,
            recargoAmount,
            descuentoPct,
            descuentoAmount,
            total
        };
    }

    function setupFormListeners() {
        const form = document.getElementById('formNuevaMulta');
        const selectInf = document.getElementById('selectInfraccion');
        const inputQty = document.getElementById('inputCantidad');
        const selectRec = document.getElementById('selectRecargo');
        const selectDesc = document.getElementById('selectDescuento');
        const btnReset = document.getElementById('btnResetForm');

        if (selectInf) {
            selectInf.addEventListener('change', () => {
                updateInfractionPreviewCard();
                calculateLiveFormTotals();
            });
        }

        if (inputQty) inputQty.addEventListener('input', calculateLiveFormTotals);
        if (selectRec) selectRec.addEventListener('change', calculateLiveFormTotals);
        if (selectDesc) selectDesc.addEventListener('change', calculateLiveFormTotals);

        if (btnReset) {
            btnReset.addEventListener('click', () => {
                form.reset();
                setFormDefaultDates();
                updateInfractionPreviewCard();
                calculateLiveFormTotals();
                clearValidationErrors();
                showToast('Formulario limpiado.', 'info');
            });
        }

        // Form Submit Handler
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleFormSubmit();
            });
        }
    }

    function clearValidationErrors() {
        document.querySelectorAll('.input-field').forEach(f => f.classList.remove('has-error'));
        document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    }

    function validateField(inputEl, errorEl, condition, message) {
        if (!condition) {
            inputEl.closest('.input-field').classList.add('has-error');
            errorEl.textContent = message;
            return false;
        }
        inputEl.closest('.input-field').classList.remove('has-error');
        errorEl.textContent = '';
        return true;
    }

    function handleFormSubmit() {
        clearValidationErrors();

        const inputConductor = document.getElementById('inputConductor');
        const inputLicencia = document.getElementById('inputLicencia');
        const inputPlaca = document.getElementById('inputPlaca');
        const selectVehiculo = document.getElementById('selectTipoVehiculo');
        const inputLugar = document.getElementById('inputLugar');
        const inputFecha = document.getElementById('inputFecha');
        const inputHora = document.getElementById('inputHora');
        const selectInf = document.getElementById('selectInfraccion');
        const selectEstado = document.getElementById('selectEstadoMulta');
        const inputAgente = document.getElementById('inputAgente');
        const inputObs = document.getElementById('inputObs');

        const errorConductor = document.getElementById('errorConductor');
        const errorLicencia = document.getElementById('errorLicencia');
        const errorPlaca = document.getElementById('errorPlaca');
        const errorLugar = document.getElementById('errorLugar');

        let isValid = true;

        if (!validateField(inputConductor, errorConductor, inputConductor.value.trim().length >= 3, 'Ingrese el nombre completo del conductor.')) {
            isValid = false;
        }

        if (!validateField(inputLicencia, errorLicencia, inputLicencia.value.trim().length >= 4, 'Ingrese un número de licencia o cédula válido.')) {
            isValid = false;
        }

        const placaVal = inputPlaca.value.trim().toUpperCase();
        if (!validateField(inputPlaca, errorPlaca, placaVal.length >= 3, 'Ingrese un formato de placa válido (Ej. A123456).')) {
            isValid = false;
        }

        if (!validateField(inputLugar, errorLugar, inputLugar.value.trim().length >= 3, 'Especifique la calle, avenida o lugar del hecho.')) {
            isValid = false;
        }

        if (!isValid) {
            showToast('Por favor, complete todos los campos obligatorios.', 'error');
            return;
        }

        const calc = calculateLiveFormTotals();
        const selectedOpt = selectInf.selectedOptions[0];
        const newId = getNextFineId();

        const newRecord = {
            id: newId,
            fecha: inputFecha.value || new Date().toISOString().split('T')[0],
            hora: inputHora.value || '12:00',
            conductor: inputConductor.value.trim(),
            licencia: inputLicencia.value.trim(),
            placa: placaVal,
            vehiculo: selectVehiculo.value,
            lugar: inputLugar.value.trim(),
            infraccion: selectedOpt.value,
            categoria: selectedOpt.dataset.categoria || 'General',
            nivel: selectedOpt.dataset.nivel || 'Leve',
            montoBase: calc.baseAmount,
            cantidad: calc.qty,
            recargoPorc: calc.recargoPct,
            recargoMonto: calc.recargoAmount,
            descuentoPorc: calc.descuentoPct,
            descuentoMonto: calc.descuentoAmount,
            total: calc.total,
            estado: selectEstado ? selectEstado.value : 'Pendiente',
            agente: inputAgente ? inputAgente.value.trim() : 'Oficial Fiscalizador',
            observaciones: document.getElementById('inputObservaciones').value.trim() || 'Sin observaciones.'
        };

        // Agregar al inicio del arreglo
        state.fines.unshift(newRecord);
        state.config.autoIncrementCounter = (state.config.autoIncrementCounter || state.fines.length) + 1;
        saveStateToStorage();

        // Mostrar confirmación
        showToast(`✓ Multa ${newId} registrada correctamente.`, 'success');

        // Abrir automáticamente el comprobante generado
        openReceiptModal(newRecord);

        // Resetear formulario para el siguiente registro
        document.getElementById('formNuevaMulta').reset();
        setFormDefaultDates();
        updateAutoIdPreview();
        calculateLiveFormTotals();
        renderAllViews();
    }

    // ------------------------------------------------------------------------
    // 8. HISTORIAL & BUSCADOR INTELIGENTE CON FILTROS
    // ------------------------------------------------------------------------
    function setupHistoryFilters() {
        const searchInput = document.getElementById('filterSearchInput');
        const clearBtn = document.getElementById('btnClearSearch');
        const filterEstado = document.getElementById('filterEstado');
        const filterNivel = document.getElementById('filterNivel');
        const filterFecha = document.getElementById('filterFecha');
        const btnResetFilters = document.getElementById('btnResetFilters');
        const btnExportFilteredCSV = document.getElementById('btnExportFilteredCSV');

        function triggerFilter() {
            if (clearBtn) {
                clearBtn.style.display = searchInput.value ? 'inline-block' : 'none';
            }
            renderHistorialTable();
        }

        if (searchInput) searchInput.addEventListener('input', triggerFilter);
        if (filterEstado) filterEstado.addEventListener('change', triggerFilter);
        if (filterNivel) filterNivel.addEventListener('change', triggerFilter);
        if (filterFecha) filterFecha.addEventListener('change', triggerFilter);

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                triggerFilter();
            });
        }

        if (btnResetFilters) {
            btnResetFilters.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (filterEstado) filterEstado.value = 'TODOS';
                if (filterNivel) filterNivel.value = 'TODOS';
                if (filterFecha) filterFecha.value = '';
                triggerFilter();
                showToast('Filtros restablecidos.', 'info');
            });
        }

        if (btnExportFilteredCSV) {
            btnExportFilteredCSV.addEventListener('click', () => {
                const filtered = getFilteredFines();
                exportFinesToCSV(filtered, 'multas_filtradas.csv');
            });
        }
    }

    function getFilteredFines() {
        const searchVal = (document.getElementById('filterSearchInput')?.value || '').toLowerCase().trim();
        const estadoVal = document.getElementById('filterEstado')?.value || 'TODOS';
        const nivelVal = document.getElementById('filterNivel')?.value || 'TODOS';
        const fechaVal = document.getElementById('filterFecha')?.value || '';

        return state.fines.filter(fine => {
            // Buscador global inteligente
            if (searchVal) {
                const matchConductor = fine.conductor.toLowerCase().includes(searchVal);
                const matchLicencia = fine.licencia.toLowerCase().includes(searchVal);
                const matchPlaca = fine.placa.toLowerCase().includes(searchVal);
                const matchId = fine.id.toLowerCase().includes(searchVal);
                const matchInf = fine.infraccion.toLowerCase().includes(searchVal);
                const matchLugar = fine.lugar.toLowerCase().includes(searchVal);

                if (!matchConductor && !matchLicencia && !matchPlaca && !matchId && !matchInf && !matchLugar) {
                    return false;
                }
            }

            // Filtro por estado
            if (estadoVal !== 'TODOS' && fine.estado !== estadoVal) {
                return false;
            }

            // Filtro por nivel
            if (nivelVal !== 'TODOS' && fine.nivel !== nivelVal) {
                return false;
            }

            // Filtro por fecha
            if (fechaVal && fine.fecha !== fechaVal) {
                return false;
            }

            return true;
        });
    }

    function renderHistorialTable() {
        const tbody = document.getElementById('tbodyHistorialFines');
        const emptyState = document.getElementById('emptyHistorialFines');
        const countText = document.getElementById('filterCountText');
        const badgeTotal = document.getElementById('badgeTotalTableCount');

        if (!tbody) return;

        const filtered = getFilteredFines();
        tbody.innerHTML = '';

        if (countText) {
            countText.textContent = `Mostrando ${filtered.length} de ${state.fines.length} registros`;
        }
        if (badgeTotal) {
            badgeTotal.textContent = `${filtered.length} Multas`;
        }

        if (filtered.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        filtered.forEach(fine => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong class="text-primary-amount">${fine.id}</strong></td>
                <td>
                    <div style="display:flex; flex-direction:column;">
                        <span>${formatDateDisplay(fine.fecha)}</span>
                        <small style="color:var(--text-muted); font-size:0.75rem;"><i class="fa-regular fa-clock"></i> ${fine.hora}</small>
                    </div>
                </td>
                <td>
                    <strong>${fine.conductor}</strong>
                </td>
                <td><span style="font-family:monospace; font-size:0.8rem;">${fine.licencia}</span></td>
                <td><span class="plate-badge">${fine.placa}</span></td>
                <td>
                    <div style="display:flex; flex-direction:column; gap:2px;">
                        <span>${fine.infraccion}</span>
                        <span class="badge-level level-${getLevelSlug(fine.nivel)}" style="width:fit-content; font-size:0.68rem;">${fine.nivel}</span>
                    </div>
                </td>
                <td><small style="color:var(--text-secondary);">${fine.lugar}</small></td>
                <td><strong class="text-primary-amount">${formatCurrency(fine.total)}</strong></td>
                <td>
                    <span class="status-badge status-${getStatusSlug(fine.estado)}">${fine.estado}</span>
                </td>
                <td class="text-center">
                    <div style="display:inline-flex; gap:4px;">
                        <button class="btn-icon btn-action-view" title="Ver Comprobante / Imprimir" data-id="${fine.id}">
                            <i class="fa-solid fa-receipt text-info"></i>
                        </button>
                        <button class="btn-icon btn-action-edit" title="Editar Registro" data-id="${fine.id}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon btn-action-toggle-status" title="Cambiar Estado Rápido" data-id="${fine.id}">
                            <i class="fa-solid fa-arrows-rotate text-warning"></i>
                        </button>
                        <button class="btn-icon btn-action-delete" title="Eliminar Registro" data-id="${fine.id}">
                            <i class="fa-solid fa-trash text-danger"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Event Delegation for action buttons
        tbody.querySelectorAll('.btn-action-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const fine = state.fines.find(f => f.id === btn.dataset.id);
                if (fine) openReceiptModal(fine);
            });
        });

        tbody.querySelectorAll('.btn-action-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const fine = state.fines.find(f => f.id === btn.dataset.id);
                if (fine) openEditModal(fine);
            });
        });

        tbody.querySelectorAll('.btn-action-toggle-status').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleFineStatusQuick(btn.dataset.id);
            });
        });

        tbody.querySelectorAll('.btn-action-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                promptDeleteFine(btn.dataset.id);
            });
        });
    }

    function getStatusSlug(estado) {
        const s = String(estado).toLowerCase();
        if (s.includes('pag')) return 'pagada';
        if (s.includes('rev')) return 'revision';
        if (s.includes('anu')) return 'anulada';
        return 'pendiente';
    }

    function toggleFineStatusQuick(id) {
        const fine = state.fines.find(f => f.id === id);
        if (!fine) return;

        const cycle = ['Pendiente', 'Pagada', 'En revisión', 'Anulada'];
        const currentIdx = cycle.indexOf(fine.estado);
        const nextIdx = (currentIdx + 1) % cycle.length;
        fine.estado = cycle[nextIdx];

        saveStateToStorage();
        renderAllViews();
        showToast(`Estado de ${id} actualizado a: ${fine.estado}`, 'info');
    }

    function promptDeleteFine(id) {
        const fine = state.fines.find(f => f.id === id);
        if (!fine) return;

        state.pendingDeleteId = id;
        const msg = document.getElementById('confirmDeleteMessage');
        if (msg) {
            msg.textContent = `¿Está seguro de que desea eliminar la multa ${fine.id} a nombre de "${fine.conductor}" (RD$ ${fine.total.toFixed(2)})?`;
        }

        const modal = document.getElementById('modalConfirmDelete');
        if (modal) modal.classList.add('active');
    }

    // ------------------------------------------------------------------------
    // 9. DASHBOARD Y RESUMEN GENERAL (KPIS)
    // ------------------------------------------------------------------------
    function renderDashboard() {
        const totalMultas = state.fines.length;
        const pendientes = state.fines.filter(f => f.estado === 'Pendiente');
        const pagadas = state.fines.filter(f => f.estado === 'Pagada');

        const sumTotal = state.fines.reduce((acc, f) => acc + (f.total || 0), 0);
        const sumPendiente = pendientes.reduce((acc, f) => acc + (f.total || 0), 0);
        const sumPagada = pagadas.reduce((acc, f) => acc + (f.total || 0), 0);
        const avg = totalMultas > 0 ? sumTotal / totalMultas : 0;

        // KPI Element Updates
        const elTotal = document.getElementById('kpiTotalMultas');
        const elPend = document.getElementById('kpiPendientes');
        const elPendAmt = document.getElementById('kpiPendientesAmount');
        const elPag = document.getElementById('kpiPagadas');
        const elPagAmt = document.getElementById('kpiPagadasAmount');
        const elRecaudado = document.getElementById('kpiTotalRecaudado');
        const elAvg = document.getElementById('kpiAvgAmount');
        const navCounter = document.getElementById('navCounterTotal');
        const headerTariff = document.getElementById('headerTariffDate');
        const catalogLastUpdate = document.getElementById('catalogLastUpdateDisplay');

        if (elTotal) elTotal.textContent = totalMultas;
        if (elPend) elPend.textContent = pendientes.length;
        if (elPendAmt) elPendAmt.textContent = `${formatCurrency(sumPendiente)} por cobrar`;
        if (elPag) elPag.textContent = pagadas.length;
        if (elPagAmt) elPagAmt.textContent = `${formatCurrency(sumPagada)} recaudado`;
        if (elRecaudado) elRecaudado.textContent = formatCurrency(sumTotal);
        if (elAvg) elAvg.textContent = `Promedio: ${formatCurrency(avg)}`;
        if (navCounter) navCounter.textContent = totalMultas;

        if (headerTariff) headerTariff.textContent = state.config.tariffLastUpdated || '28/09/2026';
        if (catalogLastUpdate) catalogLastUpdate.textContent = state.config.tariffLastUpdated || '28/09/2026';

        // Render Recent Table (Top 5)
        renderRecentFinesTable();
    }

    function renderRecentFinesTable() {
        const tbody = document.getElementById('tbodyRecentFines');
        const emptyState = document.getElementById('emptyRecentFines');
        if (!tbody) return;

        tbody.innerHTML = '';
        const recent = state.fines.slice(0, 5);

        if (recent.length === 0) {
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        recent.forEach(fine => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong class="text-primary-amount">${fine.id}</strong></td>
                <td>${formatDateDisplay(fine.fecha)} ${fine.hora}</td>
                <td><strong>${fine.conductor}</strong></td>
                <td><span class="plate-badge">${fine.placa}</span></td>
                <td>${fine.infraccion}</td>
                <td><strong class="text-primary-amount">${formatCurrency(fine.total)}</strong></td>
                <td><span class="status-badge status-${getStatusSlug(fine.estado)}">${fine.estado}</span></td>
                <td>
                    <button class="btn btn-outline btn-xs btn-dash-view" data-id="${fine.id}">
                        <i class="fa-solid fa-receipt"></i> Ver
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-dash-view').forEach(btn => {
            btn.addEventListener('click', () => {
                const fine = state.fines.find(f => f.id === btn.dataset.id);
                if (fine) openReceiptModal(fine);
            });
        });
    }

    // ------------------------------------------------------------------------
    // 10. GRÁFICOS INTERACTIVOS (CHART.JS)
    // ------------------------------------------------------------------------
    function renderCharts() {
        if (typeof Chart === 'undefined') return;

        const isDark = (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
        const textColor = isDark ? '#94a3b8' : '#475569';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

        // Chart defaults
        Chart.defaults.color = textColor;
        Chart.defaults.font.family = 'Inter, sans-serif';

        // 1. Dashboard Mini Infracciones Doughnut
        renderDashInfraccionesChart(isDark);
        // 2. Dashboard Mini Estados Pie
        renderDashEstadosChart(isDark);
        // 3. Stats Section Charts
        renderStatsFullCharts(textColor, gridColor);
    }

    function renderDashInfraccionesChart(isDark) {
        const canvas = document.getElementById('chartDashboardInfracciones');
        if (!canvas) return;

        if (state.charts.dashInfracciones) {
            state.charts.dashInfracciones.destroy();
        }

        const counts = {};
        state.fines.forEach(f => {
            counts[f.infraccion] = (counts[f.infraccion] || 0) + 1;
        });

        const labels = Object.keys(counts);
        const data = Object.values(counts);

        if (labels.length === 0) {
            labels.push('Sin registros');
            data.push(1);
        }

        state.charts.dashInfracciones = new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#64748b'
                    ],
                    borderWidth: 2,
                    borderColor: isDark ? '#0f172a' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, font: { size: 11 } }
                    }
                }
            }
        });
    }

    function renderDashEstadosChart(isDark) {
        const canvas = document.getElementById('chartDashboardEstados');
        if (!canvas) return;

        if (state.charts.dashEstados) {
            state.charts.dashEstados.destroy();
        }

        const counts = { 'Pendiente': 0, 'Pagada': 0, 'En revisión': 0, 'Anulada': 0 };
        state.fines.forEach(f => {
            if (counts[f.estado] !== undefined) counts[f.estado]++;
            else counts[f.estado] = 1;
        });

        state.charts.dashEstados = new Chart(canvas, {
            type: 'pie',
            data: {
                labels: ['Pendiente', 'Pagada', 'En revisión', 'Anulada'],
                datasets: [{
                    data: [counts['Pendiente'], counts['Pagada'], counts['En revisión'], counts['Anulada']],
                    backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e'],
                    borderWidth: 2,
                    borderColor: isDark ? '#0f172a' : '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, font: { size: 11 } }
                    }
                }
            }
        });
    }

    function renderStatsFullCharts(textColor, gridColor) {
        // Update Stats KPIs
        renderStatsKPIs();

        // 1. Infracciones Type Bar/Doughnut
        const canvasType = document.getElementById('chartInfraccionesType');
        if (canvasType) {
            if (state.charts.statsType) state.charts.statsType.destroy();

            const counts = {};
            state.fines.forEach(f => counts[f.infraccion] = (counts[f.infraccion] || 0) + 1);

            state.charts.statsType = new Chart(canvasType, {
                type: 'bar',
                data: {
                    labels: Object.keys(counts),
                    datasets: [{
                        label: 'Cantidad de Infracciones',
                        data: Object.values(counts),
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: gridColor }, ticks: { font: { size: 10 } } },
                        y: { grid: { color: gridColor }, beginAtZero: true, ticks: { stepSize: 1 } }
                    },
                    plugins: { legend: { display: false } }
                }
            });
        }

        // 2. Estados Doughnut
        const canvasEst = document.getElementById('chartEstados');
        if (canvasEst) {
            if (state.charts.statsEstados) state.charts.statsEstados.destroy();

            const counts = { 'Pendiente': 0, 'Pagada': 0, 'En revisión': 0, 'Anulada': 0 };
            state.fines.forEach(f => counts[f.estado] = (counts[f.estado] || 0) + 1);

            state.charts.statsEstados = new Chart(canvasEst, {
                type: 'doughnut',
                data: {
                    labels: ['Pendiente', 'Pagada', 'En revisión', 'Anulada'],
                    datasets: [{
                        data: [counts['Pendiente'], counts['Pagada'], counts['En revisión'], counts['Anulada']],
                        backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#f43f5e']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // 3. Niveles Polar/Bar
        const canvasNiveles = document.getElementById('chartNiveles');
        if (canvasNiveles) {
            if (state.charts.statsNiveles) state.charts.statsNiveles.destroy();

            const levelCounts = { 'Leve': 0, 'Moderada': 0, 'Grave': 0, 'Muy Grave': 0 };
            state.fines.forEach(f => {
                if (levelCounts[f.nivel] !== undefined) levelCounts[f.nivel]++;
            });

            state.charts.statsNiveles = new Chart(canvasNiveles, {
                type: 'polarArea',
                data: {
                    labels: ['Leve', 'Moderada', 'Grave', 'Muy Grave'],
                    datasets: [{
                        data: [levelCounts['Leve'], levelCounts['Moderada'], levelCounts['Grave'], levelCounts['Muy Grave']],
                        backgroundColor: [
                            'rgba(16, 185, 129, 0.75)',
                            'rgba(6, 182, 212, 0.75)',
                            'rgba(245, 158, 11, 0.75)',
                            'rgba(244, 63, 94, 0.75)'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // 4. Timeline Line Chart
        const canvasTime = document.getElementById('chartTimeline');
        if (canvasTime) {
            if (state.charts.statsTimeline) state.charts.statsTimeline.destroy();

            // Agrupar por fecha
            const dateMap = {};
            state.fines.forEach(f => {
                const d = formatDateDisplay(f.fecha);
                dateMap[d] = (dateMap[d] || 0) + (f.total || 0);
            });

            const dateLabels = Object.keys(dateMap).slice(-7);
            const dateValues = dateLabels.map(k => dateMap[k]);

            state.charts.statsTimeline = new Chart(canvasTime, {
                type: 'line',
                data: {
                    labels: dateLabels,
                    datasets: [{
                        label: 'Monto Emitido (RD$)',
                        data: dateValues,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        fill: true,
                        tension: 0.35,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: { grid: { color: gridColor } },
                        y: { grid: { color: gridColor }, beginAtZero: true }
                    }
                }
            });
        }
    }

    function renderStatsKPIs() {
        // Infracción más frecuente
        const counts = {};
        state.fines.forEach(f => counts[f.infraccion] = (counts[f.infraccion] || 0) + 1);

        let topInf = '-';
        let topCount = 0;
        for (const [k, v] of Object.entries(counts)) {
            if (v > topCount) {
                topCount = v;
                topInf = k;
            }
        }

        const elTopName = document.getElementById('statMostFrequentName');
        const elTopCount = document.getElementById('statMostFrequentCount');
        if (elTopName) elTopName.textContent = topInf;
        if (elTopCount) elTopCount.textContent = `${topCount} incidencias (${state.fines.length > 0 ? ((topCount / state.fines.length) * 100).toFixed(0) : 0}%)`;

        // Total Monetario
        const sumTotal = state.fines.reduce((a, b) => a + (b.total || 0), 0);
        const avg = state.fines.length > 0 ? sumTotal / state.fines.length : 0;
        const elMonetary = document.getElementById('statTotalMonetary');
        const elAvgMonetary = document.getElementById('statAvgMonetary');
        if (elMonetary) elMonetary.textContent = formatCurrency(sumTotal);
        if (elAvgMonetary) elAvgMonetary.textContent = `Promedio por multa: ${formatCurrency(avg)}`;

        // Tasa de Cobro
        const paidCount = state.fines.filter(f => f.estado === 'Pagada').length;
        const rate = state.fines.length > 0 ? ((paidCount / state.fines.length) * 100).toFixed(1) : '0.0';
        const elRate = document.getElementById('statPaymentRate');
        const elRateCount = document.getElementById('statPaymentCount');
        if (elRate) elRate.textContent = `${rate}%`;
        if (elRateCount) elRateCount.textContent = `${paidCount} pagadas de ${state.fines.length} totales`;

        // Día con más infracciones
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayCounts = [0, 0, 0, 0, 0, 0, 0];

        state.fines.forEach(f => {
            if (f.fecha) {
                const dayIdx = new Date(f.fecha + 'T12:00:00').getDay();
                if (!isNaN(dayIdx)) dayCounts[dayIdx]++;
            }
        });

        let maxDayIdx = 0;
        let maxDayCount = 0;
        dayCounts.forEach((c, i) => {
            if (c > maxDayCount) {
                maxDayCount = c;
                maxDayIdx = i;
            }
        });

        const elPeakDay = document.getElementById('statPeakDay');
        const elPeakCount = document.getElementById('statPeakDayCount');
        if (elPeakDay) elPeakDay.textContent = maxDayCount > 0 ? dayNames[maxDayIdx] : '-';
        if (elPeakCount) elPeakCount.textContent = `${maxDayCount} registros cometidos`;
    }

    // ------------------------------------------------------------------------
    // 11. CENTRO DE ANÁLISIS INTELIGENTE (PATRONES & RECOMENDACIONES)
    // ------------------------------------------------------------------------
    function renderAnalysisCenter() {
        const container = document.getElementById('insightsGridContainer');
        const recContainer = document.getElementById('recommendationsListContainer');
        if (!container) return;

        container.innerHTML = '';
        if (recContainer) recContainer.innerHTML = '';

        const total = state.fines.length;
        if (total === 0) {
            container.innerHTML = `<p style="color:var(--text-muted);">No hay suficientes datos para generar análisis estadísticos. Registre al menos una infracción.</p>`;
            return;
        }

        // 1. Análisis de Infracción Dominante
        const infCounts = {};
        state.fines.forEach(f => infCounts[f.infraccion] = (infCounts[f.infraccion] || 0) + 1);
        let topInf = '', topCount = 0;
        for (const [k, v] of Object.entries(infCounts)) {
            if (v > topCount) { topCount = v; topInf = k; }
        }
        const topPercent = ((topCount / total) * 100).toFixed(1);

        // 2. Análisis de Día Crítico
        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const dayCounts = [0, 0, 0, 0, 0, 0, 0];
        state.fines.forEach(f => {
            const d = new Date(f.fecha + 'T12:00:00').getDay();
            if (!isNaN(d)) dayCounts[d]++;
        });
        let maxDayIdx = 0, maxDayCount = 0;
        dayCounts.forEach((c, i) => {
            if (c > maxDayCount) { maxDayCount = c; maxDayIdx = i; }
        });
        const peakDayName = dayNames[maxDayIdx];
        const peakDayPct = ((maxDayCount / total) * 100).toFixed(1);

        // 3. Análisis de Tipo de Vehículo
        const vehCounts = {};
        state.fines.forEach(f => vehCounts[f.vehiculo] = (vehCounts[f.vehiculo] || 0) + 1);
        let topVeh = '', topVehCount = 0;
        for (const [k, v] of Object.entries(vehCounts)) {
            if (v > topVehCount) { topVehCount = v; topVeh = k; }
        }
        const topVehPct = ((topVehCount / total) * 100).toFixed(1);

        // 4. Tasa de Eficiencia de Recaudación
        const pagadas = state.fines.filter(f => f.estado === 'Pagada').length;
        const payRate = ((pagadas / total) * 100).toFixed(1);

        // Insights Cards
        const insights = [
            {
                tag: 'Volumen y Tendencia Principal',
                title: `${topInf} lidera las infracciones`,
                desc: `Las infracciones de tipo <strong>${topInf}</strong> representan el <strong>${topPercent}%</strong> de todas las multas registradas en el sistema (${topCount} de ${total} registros).`,
                metric: `Concentración: ${topPercent}% del total registrado`
            },
            {
                tag: 'Comportamiento Temporal',
                title: `Mayor incidencia los días ${peakDayName}`,
                desc: `El día con mayor concentración de faltas cometidas es el <strong>${peakDayName}</strong>, acumulando el <strong>${peakDayPct}%</strong> de los registros activos.`,
                metric: `Pico registrado: ${maxDayCount} multas en día ${peakDayName}`
            },
            {
                tag: 'Segmentación de Vehículos',
                title: `${topVeh} con mayor índice de faltas`,
                desc: `La categoría vehicular <strong>${topVeh}</strong> concentra <strong>${topVehCount} infracciones</strong> (${topVehPct}% del parque fiscalizado).`,
                metric: `Impacto Vehicular: ${topVehPct}%`
            },
            {
                tag: 'Efectividad de Liquidación',
                title: `Tasa de cumplimiento del ${payRate}%`,
                desc: `Se han liquidado satisfactoriamente <strong>${pagadas} de ${total}</strong> multas emitidas. Las restantes permanecen en estado pendiente o en revisión legal.`,
                metric: `Cobro Efectivo: ${payRate}%`
            }
        ];

        insights.forEach(ins => {
            const card = document.createElement('div');
            card.className = 'insight-card glass-card';
            card.innerHTML = `
                <div class="insight-card-header">
                    <span class="insight-type-tag"><i class="fa-solid fa-sparkles"></i> ${ins.tag}</span>
                </div>
                <h4>${ins.title}</h4>
                <p>${ins.desc}</p>
                <div class="insight-metric-pill">
                    <i class="fa-solid fa-chart-line text-info"></i> ${ins.metric}
                </div>
            `;
            container.appendChild(card);
        });

        // Recommendations List
        if (recContainer) {
            const recommendations = [
                {
                    title: `Reforzar la presencia de fiscalización en días ${peakDayName}`,
                    text: `Dado el pico de ${peakDayPct}% registrado los ${peakDayName}, se aconseja intensificar patrullajes preventivos y señalización inteligente.`
                },
                {
                    title: `Campaña educativa enfocada en "${topInf}"`,
                    text: `Priorizar campañas institucionales de concientización y recordatorios sobre las consecuencias de ${topInf.toLowerCase()}.`
                },
                {
                    title: 'Incentivos de pronto pago y digitalización',
                    text: 'Promover descuentos por pronto pago para acelerar la tasa de liquidación en multas con más de 15 días en estado pendiente.'
                }
            ];

            recommendations.forEach(rec => {
                const item = document.createElement('div');
                item.className = 'recommendation-item';
                item.innerHTML = `
                    <i class="fa-solid fa-shield-halved"></i>
                    <div>
                        <h5>${rec.title}</h5>
                        <p>${rec.text}</p>
                    </div>
                `;
                recContainer.appendChild(item);
            });
        }
    }

    // ------------------------------------------------------------------------
    // 12. GESTIÓN DEL CATÁLOGO DE INFRACCIONES & TARIFAS
    // ------------------------------------------------------------------------
    function renderCatalogTable() {
        const tbody = document.getElementById('tbodyCatalog');
        if (!tbody) return;

        tbody.innerHTML = '';
        state.catalog.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong style="font-family:monospace; color:var(--primary-400);">${item.code}</strong></td>
                <td>
                    <strong>${item.nombre}</strong>
                    <small style="display:block; color:var(--text-muted); font-size:0.75rem;">${item.descripcion || ''}</small>
                </td>
                <td><span style="font-size:0.82rem; color:var(--text-secondary);">${item.categoria}</span></td>
                <td><span class="badge-level level-${getLevelSlug(item.nivel)}">${item.nivel}</span></td>
                <td><strong class="text-primary-amount">${formatCurrency(item.monto)}</strong></td>
                <td>
                    <span class="status-badge ${item.activo !== false ? 'status-pagada' : 'status-anulada'}">
                        ${item.activo !== false ? 'Activa' : 'Inactiva'}
                    </span>
                </td>
                <td class="text-center">
                    <div style="display:inline-flex; gap:4px;">
                        <button class="btn-icon btn-catalog-edit" title="Editar Tarifa" data-code="${item.code}">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-icon btn-catalog-toggle" title="${item.activo !== false ? 'Desactivar' : 'Activar'}" data-code="${item.code}">
                            <i class="fa-solid ${item.activo !== false ? 'fa-ban text-danger' : 'fa-check text-success'}"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('.btn-catalog-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = state.catalog.find(c => c.code === btn.dataset.code);
                if (item) openCatalogModal(item);
            });
        });

        tbody.querySelectorAll('.btn-catalog-toggle').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = state.catalog.find(c => c.code === btn.dataset.code);
                if (item) {
                    item.activo = item.activo === false ? true : false;
                    saveStateToStorage();
                    populateInfractionSelect();
                    renderCatalogTable();
                    showToast(`Infracción "${item.nombre}" ${item.activo ? 'activada' : 'desactivada'}.`, 'info');
                }
            });
        });
    }

    function setupCatalogListeners() {
        const btnOpenAdd = document.getElementById('btnOpenAddCatalogModal');
        const form = document.getElementById('formCatalogItem');
        const btnUpdateDate = document.getElementById('btnUpdateCatalogDate');
        const btnResetDefaults = document.getElementById('btnResetCatalogDefaults');

        if (btnOpenAdd) {
            btnOpenAdd.addEventListener('click', () => openCatalogModal(null));
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSaveCatalogItem();
            });
        }

        if (btnUpdateDate) {
            btnUpdateDate.addEventListener('click', () => {
                const today = new Date();
                const d = String(today.getDate()).padStart(2, '0');
                const m = String(today.getMonth() + 1).padStart(2, '0');
                const y = today.getFullYear();
                state.config.tariffLastUpdated = `${d}/${m}/${y}`;
                saveStateToStorage();
                renderDashboard();
                showToast(`Fecha de tarifas actualizada a hoy (${state.config.tariffLastUpdated}).`, 'success');
            });
        }

        if (btnResetDefaults) {
            btnResetDefaults.addEventListener('click', () => {
                if (confirm('¿Desea restaurar el catálogo inicial de tarifas sugeridas?')) {
                    state.catalog = [...DEFAULT_CATALOG];
                    saveStateToStorage();
                    populateInfractionSelect();
                    renderCatalogTable();
                    calculateLiveFormTotals();
                    showToast('Catálogo de tarifas restaurado a valores por defecto.', 'success');
                }
            });
        }
    }

    function openCatalogModal(item) {
        const modal = document.getElementById('modalCatalogItem');
        const title = document.getElementById('catalogModalTitle');
        const inputCode = document.getElementById('catalogItemCode');
        const inputNombre = document.getElementById('catalogItemNombre');
        const inputCat = document.getElementById('catalogItemCategoria');
        const selectNivel = document.getElementById('catalogItemNivel');
        const inputMonto = document.getElementById('catalogItemMonto');
        const selectActivo = document.getElementById('catalogItemActivo');
        const inputDesc = document.getElementById('catalogItemDescripcion');

        if (item) {
            title.textContent = `Editar Infracción (${item.code})`;
            inputCode.value = item.code;
            inputNombre.value = item.nombre;
            inputCat.value = item.categoria;
            selectNivel.value = item.nivel;
            inputMonto.value = item.monto;
            selectActivo.value = item.activo !== false ? 'true' : 'false';
            inputDesc.value = item.descripcion || '';
        } else {
            title.textContent = 'Agregar Nueva Infracción al Catálogo';
            inputCode.value = '';
            inputNombre.value = '';
            inputCat.value = 'General';
            selectNivel.value = 'Moderada';
            inputMonto.value = '1500';
            selectActivo.value = 'true';
            inputDesc.value = '';
        }

        if (modal) modal.classList.add('active');
    }

    function handleSaveCatalogItem() {
        const inputCode = document.getElementById('catalogItemCode');
        const inputNombre = document.getElementById('catalogItemNombre');
        const inputCat = document.getElementById('catalogItemCategoria');
        const selectNivel = document.getElementById('catalogItemNivel');
        const inputMonto = document.getElementById('catalogItemMonto');
        const selectActivo = document.getElementById('catalogItemActivo');
        const inputDesc = document.getElementById('catalogItemDescripcion');

        const code = inputCode.value;
        const nombre = inputNombre.value.trim();
        const categoria = inputCat.value.trim() || 'General';
        const nivel = selectNivel.value;
        const monto = parseFloat(inputMonto.value) || 0;
        const activo = selectActivo.value === 'true';
        const descripcion = inputDesc.value.trim();

        if (!nombre || monto <= 0) {
            showToast('Complete los campos requeridos con un monto válido.', 'error');
            return;
        }

        if (code) {
            // Edit existing
            const item = state.catalog.find(c => c.code === code);
            if (item) {
                item.nombre = nombre;
                item.categoria = categoria;
                item.nivel = nivel;
                item.monto = monto;
                item.activo = activo;
                item.descripcion = descripcion;
                showToast(`✓ Infracción "${nombre}" actualizada.`, 'success');
            }
        } else {
            // Create new
            const newCode = 'INF-' + String(state.catalog.length + 1).padStart(3, '0');
            state.catalog.push({
                code: newCode,
                nombre,
                categoria,
                nivel,
                monto,
                activo,
                descripcion
            });
            showToast(`✓ Infracción "${nombre}" agregada al catálogo.`, 'success');
        }

        saveStateToStorage();
        populateInfractionSelect();
        renderCatalogTable();
        calculateLiveFormTotals();

        const modal = document.getElementById('modalCatalogItem');
        if (modal) modal.classList.remove('active');
    }

    // ------------------------------------------------------------------------
    // 13. COPIA DE SEGURIDAD & EXPORTACIÓN (JSON / CSV / IMPORT)
    // ------------------------------------------------------------------------
    function setupBackupListeners() {
        const btnExportJSON = document.getElementById('btnExportJSON');
        const btnExportCSV = document.getElementById('btnExportCSV');
        const btnTrigger = document.getElementById('btnTriggerFileInput');
        const fileInput = document.getElementById('fileInputImport');
        const dropzone = document.getElementById('importDropzone');
        const btnResetDemo = document.getElementById('btnResetAllDemoData');

        if (btnExportJSON) {
            btnExportJSON.addEventListener('click', exportFullBackupJSON);
        }

        if (btnExportCSV) {
            btnExportCSV.addEventListener('click', () => {
                exportFinesToCSV(state.fines, 'multas_completas.csv');
            });
        }

        if (btnTrigger && fileInput) {
            btnTrigger.addEventListener('click', () => fileInput.click());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    handleImportJSONFile(e.target.files[0]);
                }
            });
        }

        // Drag and drop handler
        if (dropzone) {
            ['dragenter', 'dragover'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.style.borderColor = 'var(--primary-500)';
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropzone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropzone.style.borderColor = '';
                });
            });

            dropzone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files && files[0]) {
                    handleImportJSONFile(files[0]);
                }
            });
        }

        if (btnResetDemo) {
            btnResetDemo.addEventListener('click', () => {
                if (confirm('¿Restablecer todos los registros y tarifas al estado inicial de demostración?')) {
                    state.fines = [...DEFAULT_FINES];
                    state.catalog = [...DEFAULT_CATALOG];
                    state.config.tariffLastUpdated = '28/09/2026';
                    state.config.autoIncrementCounter = state.fines.length + 1;
                    saveStateToStorage();
                    populateInfractionSelect();
                    renderAllViews();
                    showToast('Datos de demostración restablecidos con éxito.', 'success');
                }
            });
        }
    }

    function exportFullBackupJSON() {
        const payload = {
            appName: 'MultaRD Smart',
            version: '1.0.0',
            exportDate: new Date().toISOString(),
            fines: state.fines,
            catalog: state.catalog,
            config: state.config
        };

        const jsonStr = JSON.stringify(payload, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `MultaRD_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('✓ Respaldo JSON exportado correctamente.', 'success');
    }

    function exportFinesToCSV(finesArray, filename) {
        if (!finesArray || !finesArray.length) {
            showToast('No hay registros para exportar.', 'warning');
            return;
        }

        const headers = [
            'ID Registro',
            'Fecha',
            'Hora',
            'Conductor',
            'Licencia',
            'Placa',
            'Vehiculo',
            'Lugar',
            'Infraccion',
            'Nivel',
            'Monto Base',
            'Recargo',
            'Descuento',
            'Total',
            'Estado',
            'Observaciones'
        ];

        const rows = finesArray.map(f => [
            `"${f.id}"`,
            `"${f.fecha}"`,
            `"${f.hora}"`,
            `"${(f.conductor || '').replace(/"/g, '""')}"`,
            `"${f.licencia}"`,
            `"${f.placa}"`,
            `"${f.vehiculo}"`,
            `"${(f.lugar || '').replace(/"/g, '""')}"`,
            `"${(f.infraccion || '').replace(/"/g, '""')}"`,
            `"${f.nivel}"`,
            f.montoBase || 0,
            f.recargoMonto || 0,
            f.descuentoMonto || 0,
            f.total || 0,
            `"${f.estado}"`,
            `"${(f.observaciones || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || 'multas_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('✓ Archivo CSV generado para Excel.', 'success');
    }

    function handleImportJSONFile(file) {
        if (!file.name.endsWith('.json')) {
            showToast('Por favor, seleccione un archivo con extensión .json válido.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.fines && Array.isArray(data.fines)) {
                    state.fines = data.fines;
                    if (data.catalog && Array.isArray(data.catalog)) {
                        state.catalog = data.catalog;
                    }
                    if (data.config) {
                        state.config = data.config;
                    }

                    saveStateToStorage();
                    populateInfractionSelect();
                    renderAllViews();
                    showToast(`✓ Copia restaurada: ${data.fines.length} multas importadas.`, 'success');
                } else {
                    showToast('El archivo JSON no contiene un formato de respaldo válido.', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Error al leer el archivo JSON.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // ------------------------------------------------------------------------
    // 14. MODALES (COMPROBANTE, EDICIÓN Y CONFIRMACIÓN)
    // ------------------------------------------------------------------------
    function setupModalListeners() {
        // Modal Comprobante
        const modalReceipt = document.getElementById('modalComprobante');
        const btnCloseReceipt = document.getElementById('btnCloseReceiptModal');
        const btnCloseReceiptBottom = document.getElementById('btnCloseReceiptBtnBottom');
        const btnPrintReceipt = document.getElementById('btnPrintReceiptBtn');

        function closeReceipt() {
            if (modalReceipt) modalReceipt.classList.remove('active');
        }

        if (btnCloseReceipt) btnCloseReceipt.addEventListener('click', closeReceipt);
        if (btnCloseReceiptBottom) btnCloseReceiptBottom.addEventListener('click', closeReceipt);
        if (btnPrintReceipt) {
            btnPrintReceipt.addEventListener('click', () => {
                window.print();
            });
        }

        // Modal Edit Fine
        const modalEdit = document.getElementById('modalEditFine');
        const btnCloseEdit = document.getElementById('btnCloseEditModal');
        const btnCancelEdit = document.getElementById('btnCancelEditModal');
        const formEdit = document.getElementById('formEditFine');

        function closeEdit() {
            if (modalEdit) modalEdit.classList.remove('active');
        }

        if (btnCloseEdit) btnCloseEdit.addEventListener('click', closeEdit);
        if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeEdit);
        if (formEdit) {
            formEdit.addEventListener('submit', (e) => {
                e.preventDefault();
                handleSaveEditFine();
            });
        }

        // Modal Catalog
        const modalCatalog = document.getElementById('modalCatalogItem');
        const btnCloseCatalog = document.getElementById('btnCloseCatalogModal');
        const btnCancelCatalog = document.getElementById('btnCancelCatalogModal');

        if (btnCloseCatalog) btnCloseCatalog.addEventListener('click', () => modalCatalog.classList.remove('active'));
        if (btnCancelCatalog) btnCancelCatalog.addEventListener('click', () => modalCatalog.classList.remove('active'));

        // Modal Confirm Delete
        const modalDelete = document.getElementById('modalConfirmDelete');
        const btnCancelDel = document.getElementById('btnCancelDelete');
        const btnConfirmDel = document.getElementById('btnConfirmDeleteAction');

        if (btnCancelDel) btnCancelDel.addEventListener('click', () => modalDelete.classList.remove('active'));
        if (btnConfirmDel) {
            btnConfirmDel.addEventListener('click', () => {
                if (state.pendingDeleteId) {
                    const idToDelete = state.pendingDeleteId;
                    state.fines = state.fines.filter(f => f.id !== idToDelete);
                    state.pendingDeleteId = null;
                    saveStateToStorage();
                    renderAllViews();
                    modalDelete.classList.remove('active');
                    showToast(`✓ Multa ${idToDelete} eliminada correctamente.`, 'info');
                }
            });
        }

        // Close on backdrop click
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                e.target.classList.remove('active');
            }
        });
    }

    function openReceiptModal(fine) {
        const modal = document.getElementById('modalComprobante');
        if (!modal || !fine) return;

        // Elements
        const vId = document.getElementById('voucherId');
        const vDate = document.getElementById('voucherDateTime');
        const vConductor = document.getElementById('voucherConductor');
        const vLicencia = document.getElementById('voucherLicencia');
        const vPlaca = document.getElementById('voucherPlaca');
        const vVehiculo = document.getElementById('voucherVehiculo');
        const vInfraccion = document.getElementById('voucherInfraccion');
        const vLugar = document.getElementById('voucherLugar');
        const vNivel = document.getElementById('voucherNivel');
        const vAgente = document.getElementById('voucherAgente');
        const vObs = document.getElementById('voucherObservaciones');
        const vMontoBase = document.getElementById('voucherMontoBase');
        const vRecargo = document.getElementById('voucherRecargo');
        const vDescuento = document.getElementById('voucherDescuento');
        const vTotal = document.getElementById('voucherTotal');
        const vEstado = document.getElementById('voucherEstado');

        if (vId) vId.textContent = fine.id;
        if (vDate) vDate.textContent = `${formatDateDisplay(fine.fecha)} ${fine.hora}`;
        if (vConductor) vConductor.textContent = fine.conductor;
        if (vLicencia) vLicencia.textContent = fine.licencia;
        if (vPlaca) vPlaca.textContent = fine.placa;
        if (vVehiculo) vVehiculo.textContent = fine.vehiculo;
        if (vInfraccion) vInfraccion.textContent = fine.infraccion;
        if (vLugar) vLugar.textContent = fine.lugar;
        if (vAgente) vAgente.textContent = fine.agente || 'Oficial Fiscalizador';
        if (vObs) vObs.textContent = fine.observaciones || 'Ninguna';

        if (vNivel) {
            vNivel.textContent = fine.nivel;
            vNivel.className = `badge-level level-${getLevelSlug(fine.nivel)}`;
        }

        if (vMontoBase) vMontoBase.textContent = formatCurrency(fine.montoBase);
        if (vRecargo) vRecargo.textContent = `+ ${formatCurrency(fine.recargoMonto || 0)}`;
        if (vDescuento) vDescuento.textContent = `- ${formatCurrency(fine.descuentoMonto || 0)}`;
        if (vTotal) vTotal.textContent = formatCurrency(fine.total);

        if (vEstado) {
            vEstado.textContent = fine.estado;
            vEstado.className = `status-badge status-${getStatusSlug(fine.estado)}`;
        }

        modal.classList.add('active');
    }

    function openEditModal(fine) {
        const modal = document.getElementById('modalEditFine');
        const title = document.getElementById('editModalFineIdTitle');
        const inputId = document.getElementById('editFineId');
        const inputCond = document.getElementById('editConductor');
        const inputLic = document.getElementById('editLicencia');
        const inputPlaca = document.getElementById('editPlaca');
        const inputLugar = document.getElementById('editLugar');
        const selectEst = document.getElementById('editEstado');
        const inputTotal = document.getElementById('editTotal');
        const inputObs = document.getElementById('editObservaciones');

        if (title) title.textContent = `(${fine.id})`;
        if (inputId) inputId.value = fine.id;
        if (inputCond) inputCond.value = fine.conductor;
        if (inputLic) inputLic.value = fine.licencia;
        if (inputPlaca) inputPlaca.value = fine.placa;
        if (inputLugar) inputLugar.value = fine.lugar;
        if (selectEst) selectEst.value = fine.estado;
        if (inputTotal) inputTotal.value = fine.total;
        if (inputObs) inputObs.value = fine.observaciones || '';

        if (modal) modal.classList.add('active');
    }

    function handleSaveEditFine() {
        const inputId = document.getElementById('editFineId');
        const inputCond = document.getElementById('editConductor');
        const inputLic = document.getElementById('editLicencia');
        const inputPlaca = document.getElementById('editPlaca');
        const inputLugar = document.getElementById('editLugar');
        const selectEst = document.getElementById('editEstado');
        const inputTotal = document.getElementById('editTotal');
        const inputObs = document.getElementById('editObservaciones');

        const id = inputId.value;
        const fine = state.fines.find(f => f.id === id);

        if (fine) {
            fine.conductor = inputCond.value.trim();
            fine.licencia = inputLic.value.trim();
            fine.placa = inputPlaca.value.trim().toUpperCase();
            fine.lugar = inputLugar.value.trim();
            fine.estado = selectEst.value;
            fine.total = parseFloat(inputTotal.value) || fine.total;
            fine.observaciones = inputObs.value.trim();

            saveStateToStorage();
            renderAllViews();
            showToast(`✓ Registro ${id} actualizado correctamente.`, 'success');
        }

        const modal = document.getElementById('modalEditFine');
        if (modal) modal.classList.remove('active');
    }

    // ------------------------------------------------------------------------
    // 15. SISTEMA DE ALERTAS (TOAST NOTIFICATIONS)
    // ------------------------------------------------------------------------
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const icons = {
            success: 'fa-circle-check',
            error: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || 'fa-circle-info'} toast-icon"></i>
            <span class="toast-msg">${message}</span>
        `;

        container.appendChild(toast);

        // Auto remove after 3.8s
        setTimeout(() => {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, 3800);
    }

    // ------------------------------------------------------------------------
    // 16. RENDERIZADO GLOBAL
    // ------------------------------------------------------------------------
    function renderAllViews() {
        renderDashboard();
        renderHistorialTable();
        renderCatalogTable();
        renderCharts();
        renderAnalysisCenter();
    }

    // Iniciar cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', initApp);

})();
