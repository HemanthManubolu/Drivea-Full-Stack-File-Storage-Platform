import { CheckIcon, CopyIcon, ExternalLinkIcon, Trash2Icon, UsersIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { Spinner } from '../components/ui/Spinner'
import { copyShareLink, getFileIcon } from '../assets/assets'
import { format } from 'date-fns'
import api from '../config/api'
import toast from 'react-hot-toast'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'

const SharedFile = () => {

  const [shares, setShares] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingShare, setDeletingShare] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [copiedToken, setCopiedToken] = useState(null)

   const fetchShares = async (params) => {
     setIsLoading(true);
     try {
      const { data } = await api.get("/api/shares")
      setShares(data.share_links || [])
     } catch {
       toast.error("Error loading shared links.");
     }finally{
      setIsLoading(false)
     }
   }

   useEffect(()=>{
    fetchShares()
   },[])

   const handleCopy = (token)=>{
      copyShareLink(token)
      setCopiedToken(token)
      setTimeout(()=> setCopiedToken(null), 2000)
   }

    const handleDeleteShare = async () => {
      if(!deletingShare) return;

      setIsDeleting(true)
      try {
        await api.delete(`/api/shares/${deletingShare.id}`)
         toast.success("Share link deleted.");
         setShares((prev)=> prev.filter((s)=>s.id !== deletingShare.id))
      } catch (err) {
        toast.error(err.response?.data?.error || "Error deleting share link.");
      } finally{
        setIsDeleting(false)
        setDeletingShare(null)
      }
    }

  return (
    <div className="space-y-6">
      {/* page title & desc */}
       <div className="flex items-center gap-3">
          <div className='p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100'>
            <UsersIcon className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-slate-900">Shared Links</h2>
            <p className='text-xs text-slate-500'>Share links you have created</p>
          </div>
      </div>

      {/* page content  */}
      {isLoading ? (
        <div className='py-20 flex justify-center'>
          <Spinner size="lg" className="text-orange-600"/>
        </div>
      ) : shares.length === 0 ? (
        <EmptyState title='No shared links yet' description='Links you generate for sharing files and folders will appear here.' icon={UsersIcon}/>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shares.map((share)=>(
            <div key={share.id} className='bg-white border border-slate-200 rounded-2xl p-4 space-y-3 flex flex-col justify-between'>
              {/* card top */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {getFileIcon(share.resource?.mime_type)}
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{share.resource?.name || "Shared Item"}</h4>
                  </div>
                  <button onClick={()=> setDeletingShare(share)} className='p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition shrink-0' title='Delete Share Link'>
                    <Trash2Icon className="size-4"/>
                  </button>
                </div>
                <div className='text-xs text-slate-500 space-y-1 mt-3'>
                  <p>Access: <span className="text-slate-800 font-medium">Anyone with link</span></p>
                  <p>Views: <span className="text-slate-800 font-medium">{share.access_count ?? 0}</span></p>
                  <p>Created: {" "}<span className="text-slate-800 font-medium">
                    {format(new Date(share.created_at), "MMM d, yyyy")}</span></p>
                </div>
              </div>
              {/* card bottom  */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button  onClick={()=> handleCopy(share.token)} className='inline-flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 transition'>
                  {copiedToken === share.token ? (
                    <>
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600"/>
                    <span className="text-emerald-600 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="w-3.5 h-3.5"/>
                    <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a href={`/s/${share.token}`} target='_blank' rel='noreferrer' className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition"  title="Open public link">
                  <ExternalLinkIcon className="w-3.5 h-3.5"/>
                </a>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Share Link Dialog */}
      {deletingShare && (
        <ConfirmDialog 
        isOpen={!!deletingShare} 
        onClose={()=> setDeletingShare(null)}
        onConfirm={handleDeleteShare}
        title={`Delete share link for "${deletingShare.resource?.name || "this item"}"?`}
        message='Anyone who currently has this link will no longer be able to access the shared file or folder.'
        confirmText='Delete Link'
        isLoading={isDeleting}
        />
      )}

    </div>
  )
}

export default SharedFile