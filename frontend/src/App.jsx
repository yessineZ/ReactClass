
import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Listarticles from "./components/articles/Listarticles"
import Menu from "./components/Menu"
import Listcategories from "./components/categories/Listcategories"
import Listscategories from "./components/scategories/Listscategories"
import Insertcategorie from "./components/categories/Insertcategorie"
import Insertarticle from "./components/articles/Insertarticle"
import Editarticle from "./components/articles/Editarticle"
import HomeCategories from "./components/scategories/HomeCategories"
import CategoryPage from "./components/scategories/CategoryPage"
import LoginPage from "./user/LoginPage"
import SignUpPage from "./user/SignUp" ;
import { useEffect } from "react"
import { useUserStore } from "./store/useUserStore"
import { useProductStore } from "./store/useProductStore"
import { useCartStore } from "./store/useCartStore" ; 
import CartPage from "./components/pages/cartPage" ; 
import PurchaseSuccessPage from "./components/pages/SuccessPurchase"




function App() {
  const { getMe , user} = useUserStore()  ;
  const {getCartItems} = useCartStore() ; 
  useEffect(() => {
    getMe() ; 


  },[]);
  
  useEffect(() => {
    if(user) {
      getCartItems() ;
    }
  },[user]);
  return (
    <>
    <div className='min-h-screen bg-[#1a1919] relative overflow-hidden'>
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
      <div className='relative z-50 pt-20  '>
      <Menu />
      <Routes>

        <Route path="/" element={<HomeCategories />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/articles" element={<Listarticles />} />
        <Route path="/articles/add" element={<Insertarticle />} />
        <Route path="/articles/edit/:id" element={<Editarticle />} />
        <Route path="/categories" element={<Listcategories />} />
        <Route path="/scategories" element={<Listscategories />} />
        <Route path="/categories/add" element={<Insertcategorie />} />
        <Route path="/Category/:category" element={<CategoryPage />} />
        <Route path='/cart' element={<CartPage/>} />
        <Route path='/purchase-success' element={user && <PurchaseSuccessPage/>}></Route>
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
      </div>
    </div>
    </>
  )
}
export default App ; 




