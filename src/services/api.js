const BASE_URL = 'http://localhost:8080/api';

export const api = {
    // Books
    getAllBooks: async () => {
        const response = await fetch(`${BASE_URL}/books`);
        if (!response.ok) throw new Error('Failed to fetch books');
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

    // Members
    getAllMembers: async () => {
        const response = await fetch(`${BASE_URL}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
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

    // Files
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
    }
};
