import {Navigate, Outlet, useLocation} from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Spinner } from '../ui/Spinner'

const ProtectedRoute = ({children}) => {
    const {isAuthenticated, isLoading, authError, retryAuthentication} = useApp()
    const location = useLocation();

    if(isLoading){
        return (
            <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3'>
                <Spinner size="lg" className="text-orange-600"/>
                <p className="text-sm text-slate-500 font-medium">Loading Drivea...</p>
            </div>
        )
    }

    if(authError){
        return (
            <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 px-6 text-center'>
                <div>
                    <p className='text-base text-slate-900 font-semibold'>Unable to load Drivea</p>
                    <p className='text-sm text-slate-500 mt-1'>{authError}</p>
                </div>
                <button type="button" onClick={retryAuthentication} className='px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium transition'>Try again</button>
            </div>
        )
    }

    if(!isAuthenticated){
        return <Navigate to="/login" state={{ from: location }} replace/>
    }

  return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute
