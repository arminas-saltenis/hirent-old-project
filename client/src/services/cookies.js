class Cookies {
  setCookie(cookieKey, cookieValue, expiresIn) {
    const date = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(date.getDate() + expiresIn || 30);

    document.cookie = `${cookieKey}=${cookieValue}; expires=${expirationDate}; path=/`;
  }

  getCookie(cookieKey) {
    let cookieName = `${cookieKey}=`;
    let cookieArray = document.cookie.split(';');

    for (let cookie of cookieArray) {

      while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
  
      if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
  }

  removeCookie(cookieKey) {
    document.cookie = `${cookieKey}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}

export default new Cookies();