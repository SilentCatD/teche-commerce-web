function formatPathAccessToken(role){
    return `${role}-access-token`;
}

function formatPathRefreshToken(role){
    return `${role}-refresh-token`;
}

function assertRole(role){
    if(!['admin', 'user'].includes(role)){
        throw new Error("invalid token role");
    }
}

const TokenService = {
    accessToken: {
        get: (role) => {
            assertRole(role);
            const key = formatPathAccessToken(role);
            return localStorage.getItem(key);
            
        },
        set: (role, token) =>{
            assertRole(role);
            const key = formatPathAccessToken(role);
            localStorage.setItem(key, token);
        },
        del: (role)=>{
            assertRole(role);
            const key = formatPathAccessToken(role);
            localStorage.removeItem(key);
        }
    },

    refreshToken: {
        get:(role) =>{
            assertRole(role);
            const key = formatPathRefreshToken(role);
            return localStorage.getItem(key);
        },
        set: (role, token) => {
            assertRole(role);
            const key = formatPathRefreshToken(role);
            localStorage.setItem(key, token);
        },
        del: (role)=>{
            assertRole(role);
            const key = formatPathRefreshToken(role);
            localStorage.removeItem(key);
        }
    }

}

export default TokenService;