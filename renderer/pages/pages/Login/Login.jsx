import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Store from "electron-store"


const Login = () => {

    const route = useRouter();
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loginForm, setLoginForm] = useState(false)
    const [adminLogin, setAdminLogin] = useState(true)

    const store = new Store()
    let parsedEmail;
    let parsedPassword;
    try {
        parsedEmail = store.get("admin_mail");
        parsedPassword = store.get("admin_pass")
    } catch (error) {
        console.error('Failed to parse JSON data:', error);
        // Handle the error or provide a default value for parsedData
        parsedEmail = null
        parsedPassword = null
    }

    const login = (e) => {
        e.preventDefault()
        const data = {
            email: Email.toLowerCase(),
            password: Password
        }

        if (adminLogin) {
            axios.post("companies/login", data)
                .then(res => {
                    store.set("admin_mail", Email.toLowerCase())
                    store.set("admin_pass", Password)
                    Swal.fire({
                        timer: 1000,
                        title: "Success",
                        text: "Successfully logged in you'll be redirected in 1 sec",
                        icon: "success"
                    })
                    store.set("companyInfo", JSON.stringify(res.data))
                    setTimeout(() => {
                        route.push({
                            pathname: "/pages/Home/HomePage",
                        })
                    }, 1100);
                })
                .catch(err => {
                    console.log(err.response.data.message)
                    Swal.fire(
                        "Oops",
                        `${err.response.data.message}`,
                        "error"
                    )
                })
        } else {
            axios.post("agents/login/admin", data)
                .then(res => {
                    Swal.fire({
                        timer: 1000,
                        title: "Success",
                        text: "Successfully logged in you'll be redirected in 1 sec",
                        icon: "success"
                    })
                    console.log(res.data)
                    store.set("companyInfo", JSON.stringify(res.data))
                    setTimeout(() => {
                        route.push({
                            pathname: "/pages/Home/HomePage",
                        })
                    }, 1100);
                })
                .catch(err => {
                    console.log(err.response.data.message)
                    Swal.fire(
                        "Oops",
                        `${err.response.data.message}`,
                        "error"
                    )
                })
        }
    }

    const autoLogin = (e) => {
        const data = {
            email: parsedEmail,
            password: parsedPassword
        }
        if (parsedEmail != null && parsedPassword != null) {
            axios.post("companies/login", data)
                .then(res => {
                    Swal.fire({
                        timer: 1000,
                        title: "Success",
                        text: "Successfully logged in you'll be redirected in 1 sec",
                        icon: "success"
                    })
                    store.set("companyInfo", JSON.stringify(res.data))
                    setTimeout(() => {
                        route.push({
                            pathname: "/pages/Home/HomePage",
                        })
                    }, 1100);
                })
                .catch(err => {
                    console.log(err.response.data.message)
                    Swal.fire(
                        "Oops",
                        `${err.response.data.message}`,
                        "error"
                    )
                })
        } 
    }

    useEffect(() => {
        autoLogin()
    }, [])


    return (
        <React.Fragment>
            <section className=' flex flex-row h-[100vh] w-full justify-center '>
                <div className='relative w-8/12 bg-[#4B2DCC]'>
                    <img src="/images/QMSLogo.svg" className=' absolute top-5 left-5' alt="" />
                    <img src={"/images/loginBg.png"} alt="" className=' absolute w-full top-0 z-50' />
                </div>
                <div className='w-4/12 bg-white justify-center flex flex-col relative'>
                    <div className='flex flex-col mx-auto w-10/12 space-y-14'>
                        <div className=' space-y-5'>
                            <p className='text-3xl font-medium text-[#5A5A5A]'>Welcome to <span className='font-semibold text-[#4B2DCC]'>Ignite QMS</span> Monitor</p>
                            <p className=' text-lg text-[#5A5A5A] font-medium '>{loginForm === true && (adminLogin ? 'Super admin login' : 'Admin login')}</p>
                        </div>
                        {/* {
                            !loginForm ?
                                <div className='container mx-auto items-center bg-[#FFF] bg-opacity-80 max-w-[440px] p-5 rounded-3xl z-50 space-y-5'>
                                    <button
                                        onClick={() => { setAdminLogin(true); setLoginForm(true) }}
                                        className='mt-4 w-full text-white bg-[#5B3CE0] p-3 rounded-lg text-lg font-medium shadow-lg drop-shadow-sn shadow-[#9BB6FF]'
                                    >Super admin</button>
                                    <button
                                        onClick={() => { setAdminLogin(false); setLoginForm(true) }}
                                        className='mt-4 w-full text-white bg-[#5B3CE0] p-3 rounded-lg text-lg font-medium shadow-lg drop-shadow-sn shadow-[#9BB6FF]'
                                    >Admin</button>
                                </div>
                                : */}
                        <div>
                            <form onSubmit={login}>
                                <div className='space-y-4'>
                                    <div className=' flex flex-col space-y-4'>
                                        <label htmlFor="email" className=' font-medium text-[#5A5A5A]'>Email</label>
                                        <input type="text" id='email' placeholder='example@admin.com'
                                            onChange={(e) => { setEmail(e.target.value) }}
                                            value={Email}
                                            className=' text-lg rounded-lg border-gray-400 focus:border-[#4B2DCC] focus:ring-1 focus:ring-[#4B2DCC]'
                                        />
                                    </div>
                                    <div className=' flex flex-col space-y-4'>
                                        <label htmlFor="password">Password</label>
                                        <input id='password' placeholder='•••••••••••'
                                            onChange={(e) => { setPassword(e.target.value) }}
                                            type={showPassword ? "text" : "password"}
                                            value={Password}
                                            onMouseEnter={() => { setShowPassword(true) }}
                                            onMouseLeave={() => { setShowPassword(false) }}
                                            className=' text-lg rounded-lg border-gray-400 focus:border-[#4B2DCC] focus:ring-1 focus:ring-[#4B2DCC]'
                                        />
                                    </div>
                                </div>
                                <button type='submit' className=' mt-4 w-full text-white bg-[#5B3CE0] p-3 rounded-lg text-lg font-medium shadow-lg drop-shadow-sn shadow-[#9BB6FF] '>Sign in</button>
                            </form>
                            {/* <div className=' flex flex-col text-start text-white space-y-4'>
                                <button
                                    type='button'
                                    onClick={() => { setLoginForm(false); setEmail(''); setPassword('') }}
                                    className='p-3 rounded-lg font-bold text-black hover:scale-105 transition duration-300 text-center'>
                                    Change Positon ?
                                </button>
                            </div> */}
                        </div>
                        {/* } */}
                    </div>
                    <div className=' absolute bottom-10'>
                        <span className='text-black mt-10 ml-48 '>
                            <a href='https://www.igniteae.com/' rel='noreferrer' target={"_blank"}>IGNITE TECHNOLOGIES</a> 2023 ©
                        </span>
                    </div>
                </div>
            </section>
        </React.Fragment>
    )
}

export default Login