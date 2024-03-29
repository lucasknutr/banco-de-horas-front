
import { Tilt } from 'react-tilt'
import logo from '../../assets/logo.png'
import './style.css'


const Logo = () => {
    const defaultOptions = {
        reverse:        false,  // reverse the tilt direction
        max:            25,     // max tilt rotation (degrees)
        perspective:    1000,   // Transform perspective, the lower the more extreme the tilt gets.
        scale:          1.1,    // 2 = 200%, 1.5 = 150%, etc..
        speed:          1000,   // Speed of the enter/exit transition
        transition:     true,   // Set a transition on enter/exit.
        axis:           null,   // What axis should be disabled. Can be X or Y.
        reset:          true,    // If the tilt effect has to be reset on exit.
        easing:         "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    }

  return (
    <div className="m-20 mt-0 flex justify-center md:justify-start">
      
        <Tilt className="rounded-xl border-2 shadow-2xl bg-slate-200" options={defaultOptions} style={{ height: 150, width: 150 }}>
          <a href="https://github.com/lucasknutr" target='_blank'>
              <div className='Tilt-inner flex flex-col'><img src={logo} alt="logo" /><p className='text-center font-extrabold text-xl'>banco<span className='text-pink-400'>-pontos</span></p></div>
          </a>
        </Tilt>
        
    </div>
  );
};

export default Logo;