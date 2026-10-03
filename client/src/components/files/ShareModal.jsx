import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from '../ui/Modal'
import { CheckIcon, CopyIcon, Loader2Icon, XIcon } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import api from '../../config/api'
import toast from 'react-hot-toast'

const ShareModal = ({item, isOpen, onClose}) => {
    const [copied, setCopied] = useState(false)
    const [generatedLink, setGeneratedLink] = useState("")
    const [shareLinkId, setShareLinkId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const getOrCreateShareLink = useCallback(async () => {
        if(!item) return;

        setIsLoading(true)
        try {
            const { data } = await api.post("/api/shares", {
                resource_type: item.item_type === "folder" ? "folder" : "file",
                resource_id: item.id,
                permission: "download",
            })

            const link = data.share_link;
            if(link?.token){
                const fullUrl = `${window.location.origin}/s/${link.token}`;
                setGeneratedLink(fullUrl)
                setShareLinkId(link.id)
            }
        } catch (err) {
            toast.error(err.response?.data?.error || "Error generating share link.");
        }finally{
            setIsLoading(false)
        }
    },[item])

    useEffect(()=>{
        if (isOpen && item) {
            setCopied(false)
            setGeneratedLink("")
            setShareLinkId(null)
            getOrCreateShareLink()
        }
    },[isOpen, item, getOrCreateShareLink])

    const copyToClipboard = async ()=>{
        if(!generatedLink) return;

        try {
+           await navigator.clipboard.writeText(generatedLink)
            setCopied(true)
            toast.success("Link copied to clipboard!")
            setTimeout(()=> setCopied(false), 2000)
        } catch {
            toast.error("Could not copy the link. Copy it manually.")
        }
    }

    const handleDeleteShareLink = async () => {
        if(!shareLinkId) return;
        try {
            await api.delete(`/api/shares/${shareLinkId}`)
            toast.success("Share link deleted.")
            setGeneratedLink("")
            setShareLinkId(null)
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.error || "Error deleting share link.");
        }
    }


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Share "${item?.name}"`}>
        <div className="space-y-4">
            {/* Access Level Badge */}
            <div className='flex items-center gap-3 p-3 rounded-xl bg-orange-50/60'>
                <div>
                <p className="text-xs font-medium text-slate-800">Anyone with this link</p>
                 <p className="text-[11px] text-slate-500">
                    Can view and download this {item?.item_type === "folder" ? "folder" : "file"}
                </p>
                </div>
            </div>
            

            {/* Generated Link Box */}
            {isLoading ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-500">
                    <Loader2Icon className="size-5 animate-spin text-orange-600" />
                    <span className="text-xs font-medium">Generating share link...</span>
                </div>
            ) : generatedLink ? (
                <div className="space-y-4">
                    <div className="space-y-2">
                    <label className='block text-xs font-medium text-slate-700'>Shareable Link</label>
                    <div className="flex items-center gap-2">
                        <Input value={generatedLink} readOnly className="bg-slate-50 text-xs text-slate-700 select-all"/>
                        <Button variant="primary" className="shrink-0" onClick={copyToClipboard}>
                            {copied ? (
                                <>
                                <CheckIcon className="size-4"/>
                                <span>Copied</span>
                                </>
                            ) : (
                                <>
                                <CopyIcon className="size-4"/>
                                <span>Copy Link</span>
                                </>
                            )}
                        </Button>
                    </div>
                    </div>

                    {/* Delete Share Link Option */}
                    <div className="pt-2 border-t border-slate-100 text-slate-500 flex items-center justify-end gap-2">
                        <span className='text-xs'>Want to revoke access?</span>
                        <button type="button"
                            onClick={handleDeleteShareLink}
                            aria-label="Revoke share link"
                            className="p-1 hover:text-red-600" >
                          <XIcon className="size-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className='py-4 text-center'>
                    <Button variant='primary' onClick={getOrCreateShareLink} isLoading={isLoading}>
                         Generate Share Link
                    </Button>
                </div>
            )}
        </div>
    </Modal>
  )
}

export default ShareModal