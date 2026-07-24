import { SupabaseAdapter } from '../patterns/adapter/SupabaseAdapter.js';

class AuthController {
    constructor() {
        this.adapter = new SupabaseAdapter();
        this.init();
    }

    init() {
        // Si ya existe una sesión activa, redirigir automáticamente
        const userSession = this.getUserSession();
        if (userSession) {
            this.redirectByRole(userSession.rol);
            return;
        }

        this.setupListeners();
    }

    setupListeners() {
        const form = document.getElementById('form-login');
        const btnAdmin = document.getElementById('btn-fill-admin');
        const btnClient = document.getElementById('btn-fill-client');

        // Botón de Autollenado Admin
        btnAdmin?.addEventListener('click', () => {
            document.getElementById('login-email').value = 'admin@gasadmin.com';
            document.getElementById('login-password').value = 'admin123';
        });

        // Botón de Autollenado Cliente
        btnClient?.addEventListener('click', () => {
            document.getElementById('login-email').value = 'juan@gmail.com';
            document.getElementById('login-password').value = 'user123';
        });

        // Evento Submit de Login
        form?.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.login();
        });
    }

    async login() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errorBox = document.getElementById('login-error');
        const btnSubmit = document.getElementById('btn-submit-login');

        errorBox.classList.add('hidden');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span>Verificando...</span>`;

        try {
            // Consultar usuario en la BD mediante el Adapter
            const user = await this.adapter.autenticarUsuario(email, password);

            if (!user) {
                throw new Error('Credenciales inválidas. Verifica tu correo y contraseña.');
            }

            // Guardar sesión en localStorage
            localStorage.setItem('gasadmin_user', JSON.stringify({
                id: user.id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }));

            // Redirigir según el rol
            this.redirectByRole(user.rol);

        } catch (err) {
            errorBox.textContent = err.message;
            errorBox.classList.remove('hidden');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = `<span>Ingresar al Sistema</span><span class="material-symbols-outlined text-lg">arrow_forward</span>`;
        }
    }

    getUserSession() {
        const session = localStorage.getItem('gasadmin_user');
        return session ? JSON.parse(session) : null;
    }

    redirectByRole(rol) {
        if (rol === 'admin') {
            window.location.href = 'index.html'; // Dashboard Admin
        } else {
            window.location.href = 'ventas.html'; // Clientes van directo a comprar/ventas
        }
    }

    // Método utilitario estático para cerrar sesión desde cualquier vista
    static logout() {
        // 1. Limpiar todos los datos de sesión guardados
        localStorage.removeItem('gasadmin_user');
        sessionStorage.clear();

        // 2. Redirigir al Login inmediatamente
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', () => new AuthController());