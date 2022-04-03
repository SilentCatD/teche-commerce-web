// Short duration JWT token (5-10 min)
 const authentication = {
    getJwtToken: () => {
        return localStorage.getItem("jwt");
    },
    getRefreshToken: () => {
        return localStorage.getItem("refreshToken");
    },
    setRefreshToken: (token) =>{
        localStorage.setItem("refreshToken", token);
    },
    setJwtToken: (token) => {
        localStorage.setItem("jwt", token);
    },
    getHeaders: (token) => {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    },
    removeToken: () => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("jwt");
        localStorage.removeItem("userName");
    },
    getUserName: () => {
        return localStorage.getItem("userName");
    },
    setUserName: (name) =>{
        localStorage.setItem("userName",name );
    },
    sayHello: () => {
        console.log("hello");
    },
};

export default authentication;