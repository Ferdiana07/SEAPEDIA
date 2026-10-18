import { useEffect, useMemo, useRef, useState } from 'react'
import { ImageSquare, UploadSimple, X } from '@phosphor-icons/react'
import ProductImage from './ProductImage'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024

export default function ProductImageUpload({ inputId, file, currentImage, error, onChange, onError }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const previewUrl = useMemo(() => file ? URL.createObjectURL(file) : currentImage, [file, currentImage])

  useEffect(() => () => {
    if (file && previewUrl) URL.revokeObjectURL(previewUrl)
  }, [file, previewUrl])

  const selectFile = (nextFile) => {
    if (!nextFile) return
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      onError('Format gambar harus JPG, PNG, atau WebP.')
      return
    }
    if (nextFile.size > MAX_SIZE) {
      onError('Ukuran gambar maksimal 2 MB.')
      return
    }
    onError('')
    onChange(nextFile)
  }

  const clearSelection = () => {
    onChange(null)
    onError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-semibold text-slate-700">Foto produk</label>
        <span className="text-xs text-slate-400">JPG, PNG, WebP · maks. 2 MB</span>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => selectFile(event.target.files?.[0])}
      />

      <div
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${isDragging ? 'border-primary-500 bg-primary-50' : error ? 'border-danger-300 bg-danger-50/40' : 'border-slate-200 bg-slate-50 hover:border-primary-300'}`}
        onDragEnter={(event) => { event.preventDefault(); setIsDragging(true) }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          selectFile(event.dataTransfer.files?.[0])
        }}
      >
        {previewUrl ? (
          <div className="grid min-h-44 grid-cols-[8rem_1fr] items-center gap-4 p-4">
            <div className="h-32 w-32 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <ProductImage src={previewUrl} alt="Pratinjau produk" iconSize={28} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{file?.name || 'Foto produk saat ini'}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · siap diunggah` : 'Pilih foto baru jika ingin menggantinya.'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-primary-300 hover:text-primary-700">
                  <UploadSimple size={16} /> Ganti foto
                </label>
                {file && (
                  <button type="button" onClick={clearSelection} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-danger-600 hover:bg-danger-50">
                    <X size={16} /> Batalkan
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <label htmlFor={inputId} className="flex min-h-44 cursor-pointer flex-col items-center justify-center px-6 py-8 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-primary-700 shadow-card"><ImageSquare size={26} weight="duotone" /></span>
            <span className="mt-3 text-sm font-bold text-slate-800">Pilih atau tarik foto ke sini</span>
            <span className="mt-1 text-xs text-slate-500">Gunakan foto persegi dengan pencahayaan yang jelas.</span>
          </label>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-danger-600">{error}</p>}
    </div>
  )
}
