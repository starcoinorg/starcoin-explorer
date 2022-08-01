import {useNavigate,useLocation,useResolvedPath } from "react-router-dom";
import { Outlet } from 'react-router-dom'
import {useEffect,useState} from 'react'
import Cookies from 'js-cookie'

const useRouterBeforeEach = ()=>{
  const navigate = useNavigate()
  const location = useLocation()
  const [auth,setAuth] = useState(false)
  useEffect(()=>{
    if(!Cookies.get('wallet_status') && location.pathname.indexOf('/user') !== -1){
      navigate('/error')
    }
  },[])
} 
 
export default useRouterBeforeEach