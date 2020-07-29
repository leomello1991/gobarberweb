import React, { createContext, useCallback, useState, useContext} from 'react'
import api from '../services/api'

//usa um contexto de criação sempre que for reutilizar aqueles dados
//dentro da aplicação
interface AuthState {
  token: string;
  user: object;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

 const AuthProvider: React.FC = ({ children}) =>{
  //cria um estado para sempre que for precisar reutilizar os dados do cliente nao precisar buscar no localStorage
  const [data, setData] = useState<AuthState>(() => {
   const token = localStorage.getItem('@GoBarber:token');
   const user = localStorage.getItem('@GoBarber:user');

    if(token && user){
      return {token, user: JSON.parse(user)}
    }
    return {} as AuthState
  })

  const signIn = useCallback( async ({email, password}) => {
     const response = await api.post  ('sessions',{
       email,
       password
     })

     const {token, user} = response.data;

     localStorage.setItem('@GoBarber:token', token) //usa uma nomeclatura para nao confundir com outros tokem do projeot
     localStorage.setItem('@GoBarber:user', JSON.stringify(user)) //usa o JSON.stringfy pq o user é um objeto

     setData({ token, user })
  }, [])

  const signOut = useCallback(() =>{
    localStorage.removeItem('@GoBarber:token')
    localStorage.removeItem('@GoBarber:user')

    setData({} as AuthState)
  }, [])
  return (
    <AuthContext.Provider value={{user: data.user, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextData{
  const context = useContext(AuthContext)

  if(!context){
    throw new Error ('useAuth must be used within an AuthProvider')
  }

  return context;
}

export { AuthProvider, useAuth}

