function getToken() {
  const token = localStorage.getItem('library-user-token');
  return token;
}

function setToken(token) {
  localStorage.setItem('library-user-token', token);
}

function clearToken() {
  localStorage.removeItem('library-user-token');
}

export { getToken, setToken, clearToken };
