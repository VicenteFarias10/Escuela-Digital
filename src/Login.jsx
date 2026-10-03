import { useState } from 'react'
import {
  GoogleAuthProvider, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup,
} from 'firebase/auth'
import { auth } from './firebase'

const MENSAJES = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'El correo no es válido.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
  'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  'auth/popup-blocked': 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes.',
}
const IGNORAR = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request']

export default function Login({ aviso, setAviso }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [cargando, setCargando] = useState(false)

  async function intentar(accion) {
    setAviso(null)
    setCargando(true)
    try {
      await accion()
    } catch (e) {
      if (!IGNORAR.includes(e.code)) setAviso({ tipo: 'error', texto: MENSAJES[e.code] ?? 'No se pudo iniciar sesión.' })
    }
    setCargando(false)
  }

  function recuperar() {
    if (!email) return setAviso({ tipo: 'error', texto: 'Escribe tu correo para recuperar la contraseña.' })
    intentar(async () => {
      await sendPasswordResetEmail(auth, email)
      setAviso({ tipo: 'info', texto: `Si ${email} tiene cuenta, te llegará un enlace para crear una nueva contraseña.` })
    })
  }

  return (
    <div className="login">
      <aside className="login-marca">
        <p className="eyebrow">Plataforma de gestión</p>
        <h1>Escuela Digital</h1>
        <p>Seguimiento de ciclos, niveles y participantes en un solo lugar.</p>
      </aside>

      <main className="login-panel">
        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault()
            intentar(() => signInWithEmailAndPassword(auth, email, password))
          }}
        >
          <div>
            <h2>Iniciar sesión</h2>
            <p className="muted">Acceso exclusivo para administradores.</p>
          </div>

          {aviso && <p className={`aviso ${aviso.tipo}`} role="alert">{aviso.texto}</p>}

          <label>
            Correo
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label>
            Contraseña
            <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="button" className="link" onClick={recuperar}>¿Olvidaste tu contraseña?</button>

          <button className="btn primario" disabled={cargando}>Ingresar</button>

          <div className="separador">o</div>

          <button
            type="button"
            className="btn google"
            disabled={cargando}
            onClick={() => intentar(() => signInWithPopup(auth, new GoogleAuthProvider()))}
          >
            <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
            </svg>
            Continuar con Google
          </button>
        </form>
      </main>
    </div>
  )
}
