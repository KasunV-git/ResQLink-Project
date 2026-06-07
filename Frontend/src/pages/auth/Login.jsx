// frontend/src/pages/auth/Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ShieldAlert, Eye, EyeOff } from 'lucide-react'
import { loginUser } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const onChange = (e) =>
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!form.email || !form.password) {
            setError('Please fill in all fields.')
            return
        }
        setLoading(true)
        try {
            const { data } = await loginUser(form)
            login(data.token, data.user)
            navigate('/citizen/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={s.wrapper}>
            <div style={s.logo}>
                <ShieldAlert size={24} color="#1a9e7a" />
                <span style={s.logoText}>ResQLink</span>
            </div>

            <h2 style={s.title}>Welcome back</h2>
            <p style={s.sub}>Sign in to your citizen portal</p>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={s.form}>
                {/* Email */}
                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div style={{ position: 'relative' }}>
                        <Mail size={16} color="#a0aec0" style={s.inputIcon} />
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="you@example.com"
                            className="form-input"
                            style={{ paddingLeft: 40, width: '100%' }}
                        />
                    </div>
                </div>

                {/* Password */}
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={16} color="#a0aec0" style={s.inputIcon} />
                        <input
                            name="password"
                            type={showPass ? 'text' : 'password'}
                            value={form.password}
                            onChange={onChange}
                            placeholder="Enter your password"
                            className="form-input"
                            style={{ paddingLeft: 40, paddingRight: 40, width: '100%' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            style={s.eyeBtn}
                        >
                            {showPass ? <EyeOff size={15} color="#a0aec0" /> : <Eye size={15} color="#a0aec0" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ ...s.submitBtn, opacity: loading ? .7 : 1 }}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
            </form>

            <p style={s.switchText}>
                Don't have an account?{' '}
                <Link to="/register" style={s.link}>Create one</Link>
            </p>
        </div>
    )
}

const s = {
    wrapper: { width: '100%', maxWidth: 380 },
    logo: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 },
    logoText: { fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: '#1a202c' },
    title: { fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, color: '#1a202c', marginBottom: 6 },
    sub: { color: '#718096', fontSize: 14, marginBottom: 28 },
    error: { background: '#fff5f5', border: '1px solid #fed7d7', color: '#c53030', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 },
    form: { display: 'flex', flexDirection: 'column', gap: 18 },
    inputIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' },
    eyeBtn: { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 },
    submitBtn: { padding: '13px', background: 'linear-gradient(135deg, #1a9e7a, #147a5f)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginTop: 4, fontFamily: "'DM Sans',sans-serif" },
    switchText: { textAlign: 'center', fontSize: 13, color: '#718096', marginTop: 20 },
    link: { color: '#1a9e7a', fontWeight: 600 },
}

export default Login