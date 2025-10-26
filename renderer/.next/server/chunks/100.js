"use strict";
exports.id = 100;
exports.ids = [100];
exports.modules = {

/***/ 100:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(997);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(648);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(853);
/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(689);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(271);
/* harmony import */ var sweetalert2__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(sweetalert2__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var electron_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(681);
/* harmony import */ var electron_store__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(electron_store__WEBPACK_IMPORTED_MODULE_5__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([axios__WEBPACK_IMPORTED_MODULE_1__]);
axios__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];






const Login = ()=>{
    const route = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();
    const { 0: Email , 1: setEmail  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)("");
    const { 0: Password , 1: setPassword  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)("");
    const { 0: showPassword , 1: setShowPassword  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const { 0: loginForm , 1: setLoginForm  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(false);
    const { 0: adminLogin , 1: setAdminLogin  } = (0,react__WEBPACK_IMPORTED_MODULE_3__.useState)(true);
    const store = new (electron_store__WEBPACK_IMPORTED_MODULE_5___default())();
    let parsedEmail;
    let parsedPassword;
    try {
        parsedEmail = store.get("admin_mail");
        parsedPassword = store.get("admin_pass");
    } catch (error) {
        console.error("Failed to parse JSON data:", error);
        // Handle the error or provide a default value for parsedData
        parsedEmail = null;
        parsedPassword = null;
    }
    const login = (e)=>{
        e.preventDefault();
        const data = {
            email: Email.toLowerCase(),
            password: Password
        };
        if (adminLogin) {
            axios__WEBPACK_IMPORTED_MODULE_1__["default"].post("companies/login", data).then((res)=>{
                store.set("admin_mail", Email.toLowerCase());
                store.set("admin_pass", Password);
                sweetalert2__WEBPACK_IMPORTED_MODULE_4___default().fire({
                    timer: 1000,
                    title: "Success",
                    text: "Successfully logged in you'll be redirected in 1 sec",
                    icon: "success"
                });
                store.set("companyInfo", JSON.stringify(res.data));
                setTimeout(()=>{
                    route.push({
                        pathname: "/pages/Home/HomePage"
                    });
                }, 1100);
            }).catch((err)=>{
                console.log(err.response.data.message);
                sweetalert2__WEBPACK_IMPORTED_MODULE_4___default().fire("Oops", `${err.response.data.message}`, "error");
            });
        } else {
            axios__WEBPACK_IMPORTED_MODULE_1__["default"].post("agents/login/admin", data).then((res)=>{
                sweetalert2__WEBPACK_IMPORTED_MODULE_4___default().fire({
                    timer: 1000,
                    title: "Success",
                    text: "Successfully logged in you'll be redirected in 1 sec",
                    icon: "success"
                });
                console.log(res.data);
                store.set("companyInfo", JSON.stringify(res.data));
                setTimeout(()=>{
                    route.push({
                        pathname: "/pages/Home/HomePage"
                    });
                }, 1100);
            }).catch((err)=>{
                console.log(err.response.data.message);
                sweetalert2__WEBPACK_IMPORTED_MODULE_4___default().fire("Oops", `${err.response.data.message}`, "error");
            });
        }
    };
    const autoLogin = (e)=>{
        const data = {
            email: parsedEmail,
            password: parsedPassword
        };
        if (parsedEmail != null && parsedPassword != null) {
            axios__WEBPACK_IMPORTED_MODULE_1__["default"].post("companies/login", data).then((res)=>{
                sweetalert2__WEBPACK_IMPORTED_MODULE_4___default().fire({
                    timer: 1000,
                    title: "Success",
                    text: "Successfully logged in you'll be redirected in 1 sec",
                    icon: "success"
                });
                store.set("companyInfo", JSON.stringify(res.data));
                setTimeout(()=>{
                    route.push({
                        pathname: "/pages/Home/HomePage"
                    });
                }, 1100);
            }).catch((err)=>{
                console.log(err.response.data.message);
                sweetalert2__WEBPACK_IMPORTED_MODULE_4___default().fire("Oops", `${err.response.data.message}`, "error");
            });
        }
    };
    (0,react__WEBPACK_IMPORTED_MODULE_3__.useEffect)(()=>{
        autoLogin();
    }, []);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react__WEBPACK_IMPORTED_MODULE_3___default().Fragment), {
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", {
            className: " flex flex-row h-[100vh] w-full justify-center ",
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "relative w-8/12 bg-[#4B2DCC]",
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                            src: "/images/QMSLogo.svg",
                            className: " absolute top-5 left-5",
                            alt: ""
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("img", {
                            src: "/images/loginBg.png",
                            alt: "",
                            className: " absolute w-full top-0 z-50"
                        })
                    ]
                }),
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "w-4/12 bg-white justify-center flex flex-col relative",
                    children: [
                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                            className: "flex flex-col mx-auto w-10/12 space-y-14",
                            children: [
                                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                    className: " space-y-5",
                                    children: [
                                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                                            className: "text-3xl font-medium text-[#5A5A5A]",
                                            children: [
                                                "Welcome to ",
                                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                                    className: "font-semibold text-[#4B2DCC]",
                                                    children: "Ignite QMS"
                                                }),
                                                " Monitor"
                                            ]
                                        }),
                                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("p", {
                                            className: " text-lg text-[#5A5A5A] font-medium ",
                                            children: loginForm === true && (adminLogin ? "Super admin login" : "Admin login")
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", {
                                        onSubmit: login,
                                        children: [
                                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                className: "space-y-4",
                                                children: [
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: " flex flex-col space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                                                                htmlFor: "email",
                                                                className: " font-medium text-[#5A5A5A]",
                                                                children: "Email"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                                                type: "text",
                                                                id: "email",
                                                                placeholder: "example@admin.com",
                                                                onChange: (e)=>{
                                                                    setEmail(e.target.value);
                                                                },
                                                                value: Email,
                                                                className: " text-lg rounded-lg border-gray-400 focus:border-[#4B2DCC] focus:ring-1 focus:ring-[#4B2DCC]"
                                                            })
                                                        ]
                                                    }),
                                                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                                                        className: " flex flex-col space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                                                                htmlFor: "password",
                                                                children: "Password"
                                                            }),
                                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                                                id: "password",
                                                                placeholder: "•••••••••••",
                                                                onChange: (e)=>{
                                                                    setPassword(e.target.value);
                                                                },
                                                                type: showPassword ? "text" : "password",
                                                                value: Password,
                                                                onMouseEnter: ()=>{
                                                                    setShowPassword(true);
                                                                },
                                                                onMouseLeave: ()=>{
                                                                    setShowPassword(false);
                                                                },
                                                                className: " text-lg rounded-lg border-gray-400 focus:border-[#4B2DCC] focus:ring-1 focus:ring-[#4B2DCC]"
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
                                                type: "submit",
                                                className: " mt-4 w-full text-white bg-[#5B3CE0] p-3 rounded-lg text-lg font-medium shadow-lg drop-shadow-sn shadow-[#9BB6FF] ",
                                                children: "Sign in"
                                            })
                                        ]
                                    })
                                })
                            ]
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                            className: " absolute bottom-10",
                            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                                className: "text-black mt-10 ml-48 ",
                                children: [
                                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("a", {
                                        href: "https://www.igniteae.com/",
                                        rel: "noreferrer",
                                        target: "_blank",
                                        children: "IGNITE TECHNOLOGIES"
                                    }),
                                    " 2023 \xa9"
                                ]
                            })
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Login);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;