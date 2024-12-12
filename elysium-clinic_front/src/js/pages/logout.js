function logout() {
    // Eliminar el token de localStorage
    localStorage.removeItem('accessToken');
    // Redirigir al login
    window.location.href = '/login';
}
