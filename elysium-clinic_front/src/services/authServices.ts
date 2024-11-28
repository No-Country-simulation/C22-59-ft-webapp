export const authService = {
    // Guardar token
    setToken(token: string) {
        localStorage.setItem('accessToken', token);
    },

    // Obtener token
    getToken(): string | null {
        return localStorage.getItem('accessToken');
    },

    // Borrar token (logout)
    removeToken() {
        localStorage.removeItem('accessToken');
    },

    // Verificar si está autenticado
    isAuthenticated(): boolean {
        return !!this.getToken();
    },
};
