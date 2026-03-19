const BASE_URL = 'http://localhost:8080/api';

export const api = {
    // ==================== BOOKS ====================
    getAllBooks: async () => {
        const response = await fetch(`${BASE_URL}/books`);
        if (!response.ok) throw new Error('Failed to fetch books');
        return response.json();
    },

    getBookById: async (id) => {
        const response = await fetch(`${BASE_URL}/books/${id}`);
        if (!response.ok) throw new Error('Failed to fetch book');
        return response.json();
    },

    createBook: async (bookData) => {
        const response = await fetch(`${BASE_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error('Failed to create book');
        return response.json();
    },

    updateBook: async (id, bookData) => {
        const response = await fetch(`${BASE_URL}/books/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if (!response.ok) throw new Error('Failed to update book');
        return response.json();
    },

    deleteBook: async (id) => {
        const response = await fetch(`${BASE_URL}/books/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete book');
    },

    uploadBookImage: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${BASE_URL}/books/${id}/image`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload book image');
        return response.json();
    },

    deleteBookImage: async (id) => {
        const response = await fetch(`${BASE_URL}/books/${id}/image`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete book image');
        return response.json();
    },

    // ==================== MEMBERS ====================
    getAllMembers: async () => {
        const response = await fetch(`${BASE_URL}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
        return response.json();
    },

    getMemberById: async (id) => {
        const response = await fetch(`${BASE_URL}/members/${id}`);
        if (!response.ok) throw new Error('Failed to fetch member');
        return response.json();
    },

    createMember: async (memberData) => {
        const response = await fetch(`${BASE_URL}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData)
        });
        if (!response.ok) throw new Error('Failed to create member');
        return response.json();
    },

    updateMember: async (id, memberData) => {
        const response = await fetch(`${BASE_URL}/members/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData)
        });
        if (!response.ok) throw new Error('Failed to update member');
        return response.json();
    },

    deleteMember: async (id) => {
        const response = await fetch(`${BASE_URL}/members/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete member');
    },

    uploadMemberImage: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${BASE_URL}/members/${id}/image`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload member image');
        return response.json();
    },

    deleteMemberImage: async (id) => {
        const response = await fetch(`${BASE_URL}/members/${id}/image`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete member image');
        return response.json();
    },

    // ==================== FILES ====================
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${BASE_URL}/files/upload`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload file');
        return response.json();
    },

    listFiles: async () => {
        const response = await fetch(`${BASE_URL}/files/list`);
        if (!response.ok) throw new Error('Failed to fetch files');
        return response.json();
    },

    getDownloadUrl: (filename) => `${BASE_URL}/files/${encodeURIComponent(filename)}`,

    deleteFile: async (filename) => {
        const response = await fetch(`${BASE_URL}/files/${encodeURIComponent(filename)}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete file');
        return response.json();
    }
};
