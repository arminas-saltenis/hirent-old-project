export const checkConnection = () => {
  const noInternetBlock = window.document.querySelector('.no-internet');
  window.addEventListener('online', function (e) {
    noInternetBlock.style.display = 'none';
  });
  window.addEventListener('offline', function (e) {
    noInternetBlock.style.display = 'block';
  });
}