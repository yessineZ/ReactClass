import {create } from 'zustand' ; 
import {toast} from 'react-hot-toast' ; 
import axios from 'axios' ; 


export const useUserStore = create((set,get) => ({
    user : null , 
    loading : false , 
    checkingAuth : true , 

    setUser: (user) => set({user}),

    getMe : async () => {
        set({loading : true}) ; 
        
        try {
            const res = await axios.get('/api/users/getMe') ; 
            set({user : res.data.user, loading : false , checkingAuth : false }) ; 
            console.log(res.data) ;

        }catch(err) {
            console.log(err.message) ; 
            set({loading : false}) ; 
            toast.error('Failed to get user') ;
        }
    },

    logout : async () => {
        set({user : null, loading : false}) ; 
        try {
            const response = await axios.get('/api/auth/logout') ;

            toast.success(response.data?.message || 'logout successfully') ;
            
        }catch(err) {
            console.log(err.message) ; 
            toast.error('Failed to logout') ;
        }finally {
            set({loading : false}) ;
        }
    },
    checkAuth: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.get("api/auth/getMe");
			set({ user: response.data, checkingAuth: false });
		} catch (error) {
			console.log(error.message);
			set({ checkingAuth: false, user: null });
		}
	},
    

    
}));

// Axios interceptor for token refresh
let refreshPromise = null;

