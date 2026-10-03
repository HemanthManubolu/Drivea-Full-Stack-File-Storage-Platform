import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api, { setAccessTokenGetter } from "../config/api";
import { useAuth } from "@clerk/react";

const AppContext = createContext()

const ROOT_BREADCRUMB = [{id: null, name: "My Drive"}]
export const AppProvider = ({children})=>{

     const navigate = useNavigate();

     const [user, setUser] = useState(null)
     const [isLoading, setIsLoading] = useState(true)
     const [authError, setAuthError] = useState(null)
     const { isLoaded, isSignedIn, getToken, signOut } = useAuth();

     // Upload Global State
      const [isUploading, setIsUploading] = useState(false);
      const [uploadProgress, setUploadProgress] = useState(0);

      // Drive View State
      const [currentFolderId, setCurrentFolderId] = useState(null)
      const [breadcrumbs, setBreadcrumbs] = useState(ROOT_BREADCRUMB)
      const [folders, setFolders] = useState([])
      const [files, setFiles] = useState([]);
      const [isDriveLoading, setIsDriveLoading] = useState(false)

      // Filter & Sort State
      const [searchQuery, setSearchQuery] = useState("")
      const [sortBy, setSortBy] = useState("name_asc")

     // Refresh User Profile & Storage Stats
     const refreshUser = useCallback(async ()=>{
        if (!isSignedIn) {
            setUser(null);
            setAuthError(null);
            return null;
        }
        try {
            const {data} = await api.get("/api/auth/me");
            setUser(data.user)
            setAuthError(null);
            return data.user;
        } catch (error) {
            setUser(null)
            setAuthError("We couldn't connect your Drivea account. Check the server connection and try again.");
            return null
        }
     },[isSignedIn])

     useEffect(() => {
        setAccessTokenGetter(isSignedIn ? getToken : null);
        return () => setAccessTokenGetter(null);
     }, [getToken, isSignedIn]);

     // Check Auth Status on App Load
     useEffect(()=>{
        if (!isLoaded) return;
        setIsLoading(true);
        refreshUser().finally(()=> setIsLoading(false))
     },[isLoaded, refreshUser])

    const logout = async ()=>{
        try {
            await signOut()
            setUser(null)
            setAuthError(null);
            navigate("/login", { replace: true });
            toast.success("Logged out")
        } catch (error) {
            toast.error("Logout error");
        }
    }

    const retryAuthentication = async () => {
        setIsLoading(true);
        setAuthError(null);
        await refreshUser();
        setIsLoading(false);
    };

     const fetchDriveContent = useCallback(
        async (folderId = currentFolderId, search = searchQuery, sort = sortBy)=>{
            if(!user) return;
            setIsDriveLoading(true)
            try {
                const parentParam = folderId || "null";
                const [folderRes, fileRes, detailRes] = await Promise.all([
                    api.get("/api/folders", {params: { parent_id: parentParam }}),
                    api.get("/api/files", {params: { folder_id: parentParam, search, sort }}),
                    folderId ? api.get(`/api/folders/${folderId}`) : null,
                ])

                setFolders(folderRes.data.folders);
                setFiles(fileRes.data.files);
                setBreadcrumbs(detailRes?.data?.breadcrumbs || ROOT_BREADCRUMB)
            } catch {
                toast.error("Error loading drive contents");
            }finally{
                setIsDriveLoading(false)
            }
        },
        [user, currentFolderId, searchQuery, sortBy]
     )

     const value = {
        user, setUser, logout,
        // Clerk marks the session active after its authentication flow completes.
        // The bootstrap request below supplies Drivea's application user record.
        // Clerk can report an active session one render before /api/auth/me has
        // populated Drivea's user. Keep protected routes in their loading state
        // during that handoff instead of redirecting back to /login.
        isLoading: isLoading || !isLoaded || (isSignedIn && !user && !authError),
        isAuthenticated: Boolean(isSignedIn && user),
        authError,
        retryAuthentication,
        isUploading,
        setIsUploading,
        uploadProgress,
        setUploadProgress,
        refreshUser,
        currentFolderId,
        setCurrentFolderId,
        breadcrumbs,
        folders,
        setFolders,
        files,
        setFiles,
        isDriveLoading,
        fetchDriveContent,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
     }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useApp = ()=> useContext(AppContext);
