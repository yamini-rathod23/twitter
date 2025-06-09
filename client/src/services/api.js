import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // send cookies if using auth tokens
});

// Signup
export const signup = (userData) => API.post('/users', userData);

// Login
export const login = (userData) => API.post('/login', userData);

// POSTS
export const createPost = (postData) => API.post('/posts', postData);
export const getAllPosts = () => API.get('/posts');

// COMMENTS
export const createComment = (commentData) => API.post('/comments', commentData);
export const getCommentsByPost = (postId) => API.get(`/comments/post/${postId}`);


export const updateComment = (id, data) => axios.put(`/comments/${id}`, data);
export const deleteComment = (id) => axios.delete(`/comments/${id}`);

export default API;