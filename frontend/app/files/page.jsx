"use client"
import { useState } from 'react'
import useStore from '../../store/useStore'
import { toast } from 'react-toastify'

export default function FilesPage(){
  const files = useStore(s=>s.files)
  const addFile = useStore(s=>s.addFile)
  const setUploadProgress = useStore(s=>s.setUploadProgress)
  const uploads = useStore(s=>s.uploads)
  const [selected, setSelected] = useState(null)

  function uploadFile(file){
    const id = Date.now().toString()
    setUploadProgress(id, 0)
    const base = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000'
    const xhr = new XMLHttpRequest()
    const form = new FormData()
    form.append('file', file)
    xhr.open('POST', base + '/upload')
    xhr.upload.onprogress = (e)=>{
      if(e.lengthComputable) setUploadProgress(id, Math.round(e.loaded / e.total * 100))
    }
    xhr.onload = ()=>{
      if(xhr.status >=200 && xhr.status < 300){
        try{ const meta = JSON.parse(xhr.responseText); addFile(meta) }catch(err){ addFile({ name: file.name, url: base + '/uploads/' + file.name }) }
        setUploadProgress(id, 100)
        toast.success('Upload complete')
      } else {
        setUploadProgress(id, -1)
      }
    }
    xhr.onerror = ()=> setUploadProgress(id, -1)
    xhr.send(form)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="w-full max-w-4xl card-glass rounded-xl-very shadow-xl p-6">
        <h1 className="text-xl font-semibold mb-4 text-slate-800">Files</h1>

        <div className="bg-white rounded-lg p-4 mb-4">
          <label className="block mb-2">Upload a file</label>
          <input type="file" onChange={e=>{ if(e.target.files?.[0]) uploadFile(e.target.files[0]) }} />
          <div className="mt-3">
            {Object.keys(uploads).map(k=> (
              <div key={k} className="text-sm">Upload {k}: {uploads[k]}%</div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h3 className="font-semibold mb-2">Received / Sent Files</h3>
          <ul className="space-y-2">
            {files.map((f, idx)=> (
              <li key={idx} className="flex items-center justify-between p-2 border rounded">
                <div>{f.name}</div>
                <div className="flex gap-2">
                  {f.url ? <a className="text-sm text-slate-600" href={f.url} target="_blank">Download</a> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
