import React, { useEffect, useState } from 'react'
import ParticlesBg from 'particles-bg'
import Logo from '../../components/Logo';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../../services/firebaseConfig";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

const Home = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [employeeName, setEmployeeName] = useState("");
    const [employeeToken, setEmployeeToken] = useState("");

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

      
    function handleClick(e: any){
        e.preventDefault();
        signInWithEmailAndPassword(email, password);
    }

    if (loading) {
        return <p>Carregando...</p>;
      }

    if (user) {
        return (
            <Link to="/checkin"> <div className="text-3xl flex justify-center items-center p-10 bg-blue-400 w-[50%] mx-auto font-bold mt-36 rounded-xl"> Realizar Check-In </div></Link>
        )
    }

    if (error) {
        return alert("Informações não são válidas. Tente novamente ou registre-se.");
    }
    

  return (
    <>
        <ParticlesBg type="lines" bg={true} />
        <div className=" w-[100svw] h-[100svh] flex justify-center items-center text-slate-200">
            <Logo />
            <div className="flex flex-col justify-center items-center rounded-xl shadow-2xl w-[30%] h-[50%] gap-11" style={{background: 'rgba(0, 0, 0, 0.8)', border: '1px'}}>
                
                <div className="text-center">
                    <p className='mb-2 font-bold text-sm mr-[50%]'>Email:</p>
                    <input type="text" className='w-[60%] rounded-sm text-slate-800' onChange={e => setEmail(e.target.value)} placeholder='Digite seu nome'/>
                </div>
                <div className="text-center">
                    <p className='mb-2 font-bold text-sm mr-[50%]'>Senha:</p>
                    <input type="text" className='w-[60%] rounded-sm text-slate-800' onChange={e => setPassword(e.target.value)} placeholder='Digite seu token'/>
                </div>
                    <button className='px-8 py-1 rounded-xl bg-pink-400 text-white mb-7 shadow-xl font-bold hover:bg-white
                    hover:text-black hover:scale-105 transition-all duration-150' onClick={(e) => handleClick(e)}>Entrar</button>
            </div>
        </div>
        
    </>
  )
}

export default Home