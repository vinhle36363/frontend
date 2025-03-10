import React from 'react';


const Login = () => {
    return (
        <>
            <div className='root-login-page'>
                <div className='container-login-div'>
                    <div className='login-title'>Log In</div>
                    <div>
                        <div className="input-group mb-3" >
                            <input type="text" className='form-control' placeholder="Tài Khoản" aria-label='Tai-khoan' aria-describedby='basic-addon1' />
                        </div>

                        <div className="input-group mb-3" >
                            <input type="password" className='form-control' placeholder="Mật Khẩu" aria-label='Mat-khau' aria-describedby='basic-addon1' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login