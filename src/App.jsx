import { useState } from 'react'
import './App.css'
import { api } from './services/api'

function App() {
  // Books State
  const [books, setBooks] = useState(null)
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', stock: 0 })
  
  // Members State
  const [members, setMembers] = useState(null)
  const [memberForm, setMemberForm] = useState({ name: '', email: '', phone: '' })
  
  // File State
  const [fileResponse, setFileResponse] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  
  // UI States
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFetchBooks = async () => {
    try {
      setLoading(true)
      const data = await api.getAllBooks()
      setBooks(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBook = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.createBook(bookForm)
      setBookForm({ title: '', author: '', isbn: '', stock: 0 })
      handleFetchBooks()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFetchMembers = async () => {
    try {
      setLoading(true)
      const data = await api.getAllMembers()
      setMembers(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      await api.createMember(memberForm)
      setMemberForm({ name: '', email: '', phone: '' })
      handleFetchMembers()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    if (!selectedFile) return
    try {
      setLoading(true)
      const data = await api.uploadFile(selectedFile)
      setFileResponse(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Library Nexus</h1>
        <p>Microservice Ecosystem Management</p>
      </header>

      {error && <div className="error-message">⚠️ Error: {error}</div>}
      {loading && <div style={{textAlign: 'center', marginBottom: '1rem'}}>Processing...</div>}

      <div className="grid">
        {/* Books Section */}
        <section className="card">
          <h2>📚 Books</h2>
          <button className="secondary" onClick={handleFetchBooks}>Load All Books</button>
          
          <form onSubmit={handleAddBook}>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                value={bookForm.title} 
                onChange={(e) => setBookForm({...bookForm, title: e.target.value})} 
                placeholder="The Great Gatsby"
                required
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input 
                type="text" 
                value={bookForm.author} 
                onChange={(e) => setBookForm({...bookForm, author: e.target.value})} 
                placeholder="F. Scott Fitzgerald"
                required
              />
            </div>
            <div className="form-group">
              <label>ISBN</label>
              <input 
                type="text" 
                value={bookForm.isbn} 
                onChange={(e) => setBookForm({...bookForm, isbn: e.target.value})} 
                placeholder="978-0743273565"
                required
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input 
                type="number" 
                value={bookForm.stock} 
                onChange={(e) => setBookForm({...bookForm, stock: parseInt(e.target.value)})}
                required
              />
            </div>
            <button className="primary" type="submit">Add New Book</button>
          </form>

          {books && (
            <div className="response-container">
              <h3>Inventory JSON</h3>
              <pre>{JSON.stringify(books, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* Members Section */}
        <section className="card">
          <h2>👥 Members</h2>
          <button className="secondary" onClick={handleFetchMembers}>Load All Members</button>
          
          <form onSubmit={handleAddMember}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                value={memberForm.name} 
                onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} 
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={memberForm.email} 
                onChange={(e) => setMemberForm({...memberForm, email: e.target.value})} 
                placeholder="john@example.com"
                required
              />
            </div>
             <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                value={memberForm.phone} 
                onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})} 
                placeholder="+1 234 567 890"
                required
              />
            </div>
            <button className="primary" type="submit">Register Member</button>
          </form>

          {members && (
            <div className="response-container">
              <h3>Directory JSON</h3>
              <pre>{JSON.stringify(members, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* File Upload Section */}
        <section className="card">
          <h2>☁️ Cloud Storage</h2>
          <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>Upload assets to Google Cloud Storage</p>
          
          <form onSubmit={handleFileUpload}>
            <div className="form-group file-input-wrapper">
               <button type="button" className="secondary">{selectedFile ? selectedFile.name : 'Select File'}</button>
               <input 
                type="file" 
                onChange={(e) => setSelectedFile(e.target.files[0])} 
              />
            </div>
            <button className="primary" type="submit" disabled={!selectedFile}>Upload to GCS</button>
          </form>

          {fileResponse && (
            <div className="response-container">
              <h3>Upload Success JSON</h3>
              <pre>{JSON.stringify(fileResponse, null, 2)}</pre>
              {fileResponse.publicUrl && (
                <div style={{marginTop: '1rem'}}>
                  <a href={fileResponse.publicUrl} target="_blank" rel="noreferrer" style={{color: 'var(--accent)'}}>View Uploaded File</a>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default App
