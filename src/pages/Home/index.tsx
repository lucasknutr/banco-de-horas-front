import { useState, useEffect } from 'react';
import Logo from '../../components/Logo';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../services/firebaseConfig";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

const Home = () => {
    const [email, setEmail] = useState(""); // Initialize email state with an empty string
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    useEffect(() => {
        // Check if there is a stored email in localStorage and set it as the initial value
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    function handleClick(e:any) {
        e.preventDefault();
        signInWithEmailAndPassword(email, password);
    }

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (user) {
        // Store the email in localStorage when the user signs in
        localStorage.setItem('email', user.user?.email!);
        return navigate("/banco-de-horas-front/checkin");
    }

    if (error) {
        alert("Informações não são válidas. Tente novamente ou registre-se.");
        console.log(error);
        window.location.reload();
    }

    return (
        <>
            <div className=" w-[100svw] h-[100svh] flex justify-center items-center text-slate-200">
                <Logo />
                <div className="flex flex-col justify-center items-center rounded-xl shadow-2xl w-[30%] h-[50%] gap-11" style={{ background: 'rgba(0, 0, 0, 0.8)', border: '1px' }}>

                    <div className="text-center">
                        <p className='mb-2 font-bold text-sm mr-[50%]'>Email:</p>
                        <input
                            type="email"
                            className='w-[60%] rounded-sm text-slate-800'
                            value={email} // Bind the input value to the email state
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='Digite seu nome'
                        />
                    </div>
                    <div className="text-center">
                        <p className='mb-2 font-bold text-sm mr-[50%]'>Senha:</p>
                        <input
                            type="password"
                            className='w-[60%] rounded-sm text-slate-800'
                            value={password} // Bind the input value to the password state
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Digite seu token'
                        />
                    </div>
                    <button
                        className='px-8 py-1 rounded-xl bg-pink-400 text-white mb-7 shadow-xl font-bold hover:bg-white hover:text-black hover:scale-105 transition-all duration-150'
                        onClick={(e) => handleClick(e)}
                    >
                        Entrar
                    </button>
                </div>
            </div>
        </>
    );
};

export default Home;
