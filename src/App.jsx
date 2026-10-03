import { useEffect, useState } from 'react'
import { onAuthStateChanged, sendEmailVerification, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import Login from './Login'

export default function App() {
  const [user, setUser] = useState(undefined) // undefined = cargando
  const [aviso, setAviso] = useState(null) // { tipo: 'error' | 'info', texto }

  useEffect(() => onAuthStateChanged(auth, async (u) => {
    if (!u) return setUser(null)
    setUser(undefined)
    if (!u.emailVerified) {
      // Cuentas con contraseña nacen sin verificar y las reglas las rechazan.
      await sendEmailVerification(u).catch(() => {})
      setAviso({ tipo: 'info', texto: `Te enviamos un enlace de verificación a ${u.email}. Verifica tu correo y vuelve a ingresar.` })
      return signOut(auth)
    }
    try {
      // Las reglas solo dejan leer esto a quien está en admins/{email}.
      await getDoc(doc(db, 'admins', u.email))
      setUser(u)
    } catch {
      setAviso({ tipo: 'error', texto: `${u.email} no tiene acceso.` })
      signOut(auth)
    }
  }), [])

  if (user === undefined) return <div className="cargando">Cargando…</div>
  if (!user) return <Login aviso={aviso} setAviso={setAviso} />

  return (
    <>
      <header className="topbar">
        <strong>Escuela Digital</strong>
        <span className="muted email">{user.email}</span>
        <button className="btn secundario" onClick={() => signOut(auth)}>Cerrar sesión</button>
      </header>
      <main className="contenido">
        <div className="tarjeta">
          <h2>Hola{user.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}</h2>
          <p className="muted">Base lista. Próximo: importador de Excel y tabla de personas.</p>
        </div>
      </main>
    </>
  )
}
