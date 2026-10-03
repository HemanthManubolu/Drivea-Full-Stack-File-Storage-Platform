import { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import api from '../config/api'
import { Spinner } from '../components/ui/Spinner'
import { DownloadIcon, LockIcon, LucideFolder } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { formatBytes, getFileIcon } from '../assets/assets'

const SharedWithMe = () => {

  const {token} = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  useEffect(()=>{
    setIsLoading(true)
    api.get(`/api/shares/access/${token}`).then((res)=>{
      setData(res.data)
    }).catch((err)=>{
      setError(err.response?.data?.error || "Unable to load shared item.");
    }).finally(()=> setIsLoading(false))
  },[token])


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Minimal Header */}
      <header className='h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between'>
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.svg" alt="logo" className="size-7"/>
          <span className='text-2xl font-medium text-slate-900'>Drivea</span>
        </Link>
        <Link to="/login" className="text-xs font-semibold text-orange-600 hover:underline">
          Sign In
        </Link>
      </header>

       {/* Content Container */}
       <main className="flex-1 flex items-center justify-center p-6">
          {isLoading ? (
            <div className="text-center space-y-3">
              <Spinner size='lg' className="text-orange-600"/>
              <p className="text-sm text-slate-500 font-medium">Loading shared item...</p>
            </div>
          ) : error ? (
            <div className='max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-4'>
              <div className="size-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
                <LockIcon className="size-6"/>
              </div>
              <h3>Link Unavailable</h3>
              <p>{error}</p>
              <div className='pt-2'>
                <Link to="/">
                  <Button variant='secondary' size='sm'>Go to Homepage</Button>
                </Link>
              </div>
            </div>
          ) : data?.resource_type === "file" ? (
            <div className="max-w-xl w-full p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-6 animate-fade-in">
              <div className='w-20 h-20 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto'>
                {getFileIcon(data.file.mime_type, "size-10")}
              </div>

              <div>
                <h2 className="text-xl font-medium text-slate-900 mb-1">{data.file.name}</h2>
                <p className="text-xs text-slate-500">
                  Size: {formatBytes(data.file.size)} • Shared by {data.owner?.name || "User"}
                </p>
              </div>

              {data.permission === "download" ? (
                <div className='p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-medium'>
                  This link grants <span className="text-orange-600 font-semibold">download-only</span> permission.
                </div>
              ) : null}

              {data.url && (
                <a href={data.url} download={data.file.name} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg transition">
                  <DownloadIcon className="size-4"/>
                  <span>Download File</span>
                </a>
              )}
            </div>
          ) : (
            // Folder view
            <div className='max-w-2xl w-full p-8 bg-white border border-slate-200 rounded-3xl space-y-6'>
              <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                    <LucideFolder className="size-6 fill-orange-500/20"/>
                  </div>
                  <div>
                    <h2>{data.folder.name}</h2>
                    <p className="text-xs text-slate-500">Shared Folder by {data.owner?.name || "User"}</p>
                  </div>
              </div>

              <div className='space-y-2'>
                <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contents</h2>

                {!data.files || data.files.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 font-medium">
                    This folder is empty.
                  </div>
                ): (
                  <div className="divide-y divide-slate-200 bg-slate-50/50 border border-slate-200 rounded-xl overflow-hidden">
                    {data.files.map((f)=>(
                      <div key={f.id} className='p-3.5 flex items-center justify-between hover:bg-slate-100/80 transition'>
                        <div className='flex items-center gap-3 min-w-0 pr-3'>
                          {getFileIcon(f.mime_type, "size-5 shrink-0")}
                           <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                            <p className="text-xs text-slate-500">{formatBytes(f.size)}</p>
                          </div>
                        </div>
                        {f.url && (
                          <a href={f.url} download={f.name} target="_blank" rel="noreferrer" className='inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-lg transition shrink-0'>
                             <DownloadIcon className="size-3.5" />
                             <span>Download</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
       </main>
    </div>
  )
}

export default SharedWithMe