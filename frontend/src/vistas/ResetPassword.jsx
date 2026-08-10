import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        
        if (!token) {
            setError('No hay un token de recuperación válido.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al restablecer la contraseña');
            }

            setMessage(data.message);
            setTimeout(() => navigate('/'), 3000); // Redirigir después de 3 segundos
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Restablecer Contraseña</h2>
                    <p>Ingresa tu nueva contraseña a continuación.</p>
                </div>
                
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nueva Contraseña</label>
                        <div className="input-with-icon">
                            <span className="material-icons-outlined input-icon">lock</span>
                            <input
                                type="password"
                                placeholder="Minimo 6 caracteres"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Confirmar Contraseña</label>
                        <div className="input-with-icon">
                            <span className="material-icons-outlined input-icon">lock_outline</span>
                            <input
                                type="password"
                                placeholder="Confirma tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength="6"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
                    </button>

                    <div className="form-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/" className="forgot-password">Volver al inicio de sesión</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
