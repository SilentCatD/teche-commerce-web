// Short duration JWT token (5-10 min)
const authentication = {
    getJwtToken: () => {
        return sessionStorage.getItem("jwt")
    },
    getRefreshToken: () => {
        return sessionStorage.getItem("refreshToken")
    },
    setRefreshToken: (token) =>{
        sessionStorage.setItem("refreshToken", token)
    },
    setJwtToken: (token) => {
        sessionStorage.setItem("jwt", token)
    },
    sayHello: () => {
        console.log("hello");
    }
}
