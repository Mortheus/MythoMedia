import axios from 'axios'

    function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    timeout: 5000,
    headers: {
        'Authorization': 'JWT ' + sessionStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X_CSRFToken': csrftoken,
    }
});

// axiosInstance.defaults.headers['Content-Type'] += ', multipart/form-data';

export default axiosInstance