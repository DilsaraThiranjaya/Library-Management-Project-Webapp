import { useState, useEffect, useCallback } from 'react'
import './App.css'
import { api, BASE_URL } from './services/api'

// ==================== HELPERS ====================
const getImageUrl = (url) => {
  if (!url) return null;
  
  // If it's a localhost URL (from old dev data), replace it with current BASE_URL
  if (url.includes('localhost:8080')) {
    return url.replace('http://localhost:8080/api', BASE_URL);
  }
  
  // If it's a direct GCS URL, convert it to our proxy URL
  if (url.includes('storage.googleapis.com')) {
    const filename = url.substring(url.lastIndexOf('/') + 1);
    return `${BASE_URL}/files/${filename}`;
  }
  
  return url;
};

// ==================== TOAST SYSTEM ====================
function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => onDismiss(t.id)}>
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

function useToast() {
  const [toasts, setToasts] = useState([])
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])
  const dismiss = useCallback(id => setToasts(prev => prev.filter(t => t.id !== id)), [])
  return { toasts, addToast, dismiss }
}

// ==================== CONFIRM MODAL ====================
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
        <div className="confirm-dialog">
          <div className="confirm-icon">⚠️</div>
          <p>{message}</p>
          <div className="btn-group" style={{ justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn-danger" onClick={onConfirm}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== BOOK FORM MODAL ====================
function BookFormModal({ book, onSave, onClose }) {
  const [form, setForm] = useState(book || { title: '', author: '', isbn: '', stock: 0 })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(book?.imageUrl || null)
  const [saving, setSaving] = useState(false)
  const isEdit = !!book?.id

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form, imageFile, isEdit)
      onClose()
    } catch { /* toast handled in parent */ }
    finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? '✏️ Edit Book' : '📖 Add New Book'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="The Great Gatsby" required />
          </div>
          <div className="form-group">
            <label>Author</label>
            <input type="text" value={form.author} onChange={e => setForm({...form, author: e.target.value})} placeholder="F. Scott Fitzgerald" required />
          </div>
          <div className="form-group">
            <label>ISBN</label>
            <input type="text" value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} placeholder="978-0743273565" required />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} min="0" required />
          </div>
          <div className="form-group">
            <label>Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div style={{ marginTop: '0.5rem', borderRadius: '8px', overflow: 'hidden', width: '120px', height: '160px' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== MEMBER FORM MODAL ====================
function MemberFormModal({ member, onSave, onClose }) {
  const [form, setForm] = useState(member || { name: '', email: '', phone: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(member?.imageUrl || null)
  const [saving, setSaving] = useState(false)
  const isEdit = !!member?.id

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(form, imageFile, isEdit)
      onClose()
    } catch { /* toast handled in parent */ }
    finally { setSaving(false) }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? '✏️ Edit Member' : '👤 Add New Member'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+94 71 234 5678" required />
          </div>
          <div className="form-group">
            <label>Profile Image (Optional)</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div style={{ marginTop: '0.5rem', borderRadius: '50%', overflow: 'hidden', width: '100px', height: '100px' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : (isEdit ? 'Update Member' : 'Register Member')}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ==================== BOOKS PAGE ====================
function BooksPage({ addToast }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBook, setSelectedBook] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editBook, setEditBook] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const data = await api.getAllBooks()
      setBooks(data)
    } catch (err) { addToast(err.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBooks() }, [])

  const handleSaveBook = async (form, imageFile, isEdit) => {
    try {
      let savedBook;
      if (isEdit) {
        savedBook = await api.updateBook(form.id, { title: form.title, author: form.author, isbn: form.isbn, stock: form.stock })
        addToast('Book updated successfully!')
      } else {
        savedBook = await api.createBook(form)
        addToast('Book added successfully!')
      }
      
      if (imageFile) {
        await api.uploadBookImage(savedBook.id, imageFile)
        addToast('Book image uploaded successfully!')
      }
      
      fetchBooks()
      setSelectedBook(null)
    } catch (err) { addToast(err.message, 'error'); throw err }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteBook(id)
      addToast('Book deleted successfully!')
      setConfirmDelete(null)
      setSelectedBook(null)
      fetchBooks()
    } catch (err) { addToast(err.message, 'error') }
  }

  const viewBook = async (id) => {
    try {
      const data = await api.getBookById(id)
      setSelectedBook(data)
    } catch (err) { addToast(err.message, 'error') }
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  // ---------- DETAIL VIEW ----------
  if (selectedBook) {
    return (
      <div className="detail-view">
        <div className="detail-header">
          <button className="back-btn" onClick={() => setSelectedBook(null)}>← Back to Books</button>
          <div className="btn-group">
            <button className="btn-secondary btn-sm" onClick={() => { setEditBook(selectedBook); setShowForm(true) }}>✏️ Edit</button>
            <button className="btn-danger btn-sm" onClick={() => setConfirmDelete(selectedBook.id)}>🗑 Delete</button>
          </div>
        </div>
          {selectedBook.imageUrl && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src={getImageUrl(selectedBook.imageUrl)} alt={selectedBook.title} style={{ width: '200px', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </div>
          )}
          <div className="detail-field"><label>ID</label><div className="value">#{selectedBook.id}</div></div>
          <div className="detail-field"><label>Title</label><div className="value">{selectedBook.title}</div></div>
          <div className="detail-field"><label>Author</label><div className="value">{selectedBook.author}</div></div>
          <div className="detail-field"><label>ISBN</label><div className="value">{selectedBook.isbn}</div></div>
          <div className="detail-field">
            <label>Stock</label>
            <div className="value">
              {selectedBook.stock}{' '}
              <span className={`badge ${selectedBook.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                {selectedBook.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        {showForm && <BookFormModal book={editBook} onSave={handleSaveBook} onClose={() => { setShowForm(false); setEditBook(null) }} />}
        {confirmDelete && <ConfirmModal message="Are you sure you want to delete this book?" onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
      </div>
    )
  }

  // ---------- LIST VIEW ----------
  return (
    <>
      <div className="page-header">
        <div>
          <h2>📚 Books</h2>
          <div className="subtitle">{books.length} book{books.length !== 1 ? 's' : ''} in the library</div>
        </div>
        <button className="btn-primary" onClick={() => { setEditBook(null); setShowForm(true) }}>+ Add Book</button>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No books yet</h3>
          <p>Start building your library collection by adding your first book.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Add First Book</button>
        </div>
      ) : (
        <div className="card-grid">
          {books.map(book => (
            <div key={book.id} className="item-card" onClick={() => viewBook(book.id)}>
              {book.imageUrl && (
                <div style={{ width: '100%', height: '140px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src={getImageUrl(book.imageUrl)} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div className="item-card-title">{book.title}</div>
              <div className="item-card-subtitle">by {book.author}</div>
              <div className="item-card-meta">
                <span className="meta-tag">📋 {book.isbn}</span>
                <span className={`badge ${book.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                  {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && <BookFormModal book={editBook} onSave={handleSaveBook} onClose={() => { setShowForm(false); setEditBook(null) }} />}
      {confirmDelete && <ConfirmModal message="Are you sure you want to delete this book?" onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </>
  )
}

// ==================== MEMBERS PAGE ====================
function MembersPage({ addToast }) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMember, setSelectedMember] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchMembers = async () => {
    setLoading(true)
    try {
      const data = await api.getAllMembers()
      setMembers(data)
    } catch (err) { addToast(err.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMembers() }, [])

  const handleSaveMember = async (form, imageFile, isEdit) => {
    try {
      let savedMember;
      if (isEdit) {
        savedMember = await api.updateMember(form.id, { name: form.name, email: form.email, phone: form.phone })
        addToast('Member updated successfully!')
      } else {
        savedMember = await api.createMember(form)
        addToast('Member registered successfully!')
      }

      if (imageFile) {
        await api.uploadMemberImage(savedMember.id, imageFile)
        addToast('Member profile image uploaded successfully!')
      }

      fetchMembers()
      setSelectedMember(null)
    } catch (err) { addToast(err.message, 'error'); throw err }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteMember(id)
      addToast('Member removed successfully!')
      setConfirmDelete(null)
      setSelectedMember(null)
      fetchMembers()
    } catch (err) { addToast(err.message, 'error') }
  }

  const viewMember = async (id) => {
    try {
      const data = await api.getMemberById(id)
      setSelectedMember(data)
    } catch (err) { addToast(err.message, 'error') }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  // ---------- DETAIL VIEW ----------
  if (selectedMember) {
    return (
      <div className="detail-view">
        <div className="detail-header">
          <button className="back-btn" onClick={() => setSelectedMember(null)}>← Back to Members</button>
          <div className="btn-group">
            <button className="btn-secondary btn-sm" onClick={() => { setEditMember(selectedMember); setShowForm(true) }}>✏️ Edit</button>
            <button className="btn-danger btn-sm" onClick={() => setConfirmDelete(selectedMember.id)}>🗑 Delete</button>
          </div>
        </div>
        <div className="detail-card">
          {selectedMember.imageUrl && (
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <img src={getImageUrl(selectedMember.imageUrl)} alt={selectedMember.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </div>
          )}
          <div className="detail-field"><label>ID</label><div className="value" style={{fontFamily:'monospace',fontSize:'0.85rem'}}>{selectedMember.id}</div></div>
          <div className="detail-field"><label>Full Name</label><div className="value">{selectedMember.name}</div></div>
          <div className="detail-field"><label>Email</label><div className="value">{selectedMember.email}</div></div>
          <div className="detail-field"><label>Phone</label><div className="value">{selectedMember.phone}</div></div>
          <div className="detail-field"><label>Joined</label><div className="value">{formatDate(selectedMember.joinedAt)}</div></div>
        </div>
        {showForm && <MemberFormModal member={editMember} onSave={handleSaveMember} onClose={() => { setShowForm(false); setEditMember(null) }} />}
        {confirmDelete && <ConfirmModal message="Are you sure you want to remove this member?" onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
      </div>
    )
  }

  // ---------- LIST VIEW ----------
  return (
    <>
      <div className="page-header">
        <div>
          <h2>👥 Members</h2>
          <div className="subtitle">{members.length} registered member{members.length !== 1 ? 's' : ''}</div>
        </div>
        <button className="btn-primary" onClick={() => { setEditMember(null); setShowForm(true) }}>+ Add Member</button>
      </div>

      {members.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No members yet</h3>
          <p>Register your first library member to get started.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Register Member</button>
        </div>
      ) : (
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} className="row-clickable" onClick={() => viewMember(m.id)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {m.imageUrl ? (
                        <img src={getImageUrl(m.imageUrl)} alt={m.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>👤</div>
                      )}
                      <span style={{fontWeight:500,color:'var(--text)'}}>{m.name}</span>
                    </div>
                  </td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>{formatDate(m.joinedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <MemberFormModal member={editMember} onSave={handleSaveMember} onClose={() => { setShowForm(false); setEditMember(null) }} />}
      {confirmDelete && <ConfirmModal message="Are you sure you want to remove this member?" onConfirm={() => handleDelete(confirmDelete)} onCancel={() => setConfirmDelete(null)} />}
    </>
  )
}

// ==================== FILES PAGE ====================
function FilesPage({ addToast }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const fetchFiles = async () => {
    setLoading(true)
    try {
      const data = await api.listFiles()
      setFiles(data)
    } catch (err) { addToast(err.message, 'error') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchFiles() }, [])

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      await api.uploadFile(file)
      addToast(`"${file.name}" uploaded successfully!`)
      fetchFiles()
    } catch (err) { addToast(err.message, 'error') }
    finally { setUploading(false) }
  }

  const handleDelete = async (filename) => {
    try {
      await api.deleteFile(filename)
      addToast('File deleted successfully!')
      setConfirmDelete(null)
      fetchFiles()
    } catch (err) { addToast(err.message, 'error') }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getFileIcon = (name) => {
    const ext = (name || '').split('.').pop().toLowerCase()
    const icons = { pdf: '📄', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', gif: '🖼️', svg: '🖼️', webp: '🖼️', doc: '📝', docx: '📝', xls: '📊', xlsx: '📊', csv: '📊', zip: '📦', rar: '📦', mp4: '🎬', avi: '🎬', mp3: '🎵', wav: '🎵', txt: '📃', json: '📃', xml: '📃' }
    return icons[ext] || '📎'
  }

  if (loading) return <div className="loading-spinner"><div className="spinner"></div></div>

  return (
    <>
      <div className="page-header">
        <div>
          <h2>☁️ Cloud Storage</h2>
          <div className="subtitle">{files.length} file{files.length !== 1 ? 's' : ''} in Google Cloud Storage</div>
        </div>
        <button className="btn-secondary" onClick={fetchFiles}>↻ Refresh</button>
      </div>

      <div
        className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <input type="file" onChange={(e) => handleUpload(e.target.files[0])} disabled={uploading} />
        <div className="upload-icon">{uploading ? '⏳' : '☁️'}</div>
        <div className="upload-text">{uploading ? 'Uploading...' : 'Drop files here or click to browse'}</div>
        <div className="upload-hint">Files are stored in Google Cloud Storage</div>
      </div>

      {files.length > 0 && (
        <div className="data-table-wrapper" style={{ marginTop: '1.5rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Preview</th>
                <th>File</th>
                <th>Type</th>
                <th>Size</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, i) => (
                <tr key={i}>
                  <td>
                    {file.contentType?.startsWith('image/') ? (
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                        <img src={getImageUrl(file.publicUrl)} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        {getFileIcon(file.filename)}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{getFileIcon(file.filename)}</span>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: '0.9rem' }}>
                          {file.originalFilename || file.filename}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {file.filename}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info">{file.contentType || 'unknown'}</span>
                  </td>
                  <td>{formatSize(file.size)}</td>
                  <td>
                    <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                      <a
                        href={api.getDownloadUrl(file.filename)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary btn-sm"
                        style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        ⬇ Download
                      </a>
                      <button className="btn-danger btn-sm" onClick={() => setConfirmDelete(file.filename)}>
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {files.length === 0 && !loading && (
        <div className="empty-state" style={{ paddingTop: '2rem' }}>
          <h3>No files uploaded</h3>
          <p>Use the upload area above to store files in the cloud.</p>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirmDelete}"?`}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </>
  )
}

// ==================== MAIN APP ====================
function App() {
  const [activeTab, setActiveTab] = useState('books')
  const { toasts, addToast, dismiss } = useToast()

  const tabs = [
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'files', label: 'Cloud Storage', icon: '☁️' },
  ]

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>Library Nexus</h1>
          <p>Management System</p>
        </div>
        <nav className="sidebar-nav">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>ECA Final Project · 2026</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'books' && <BooksPage addToast={addToast} />}
        {activeTab === 'members' && <MembersPage addToast={addToast} />}
        {activeTab === 'files' && <FilesPage addToast={addToast} />}
      </main>

      {/* Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export default App
