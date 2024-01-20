function getToken() {
  const token = localStorage.getItem('phonenumbers-user-token');
  return token;
}

function setToken(token: string) {
  localStorage.setItem('phonenumbers-user-token', token);
}

function clearToken() {
  localStorage.removeItem('phonenumbers-user-token');
}

export { getToken, setToken, clearToken };
