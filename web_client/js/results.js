$('#retry').click(() => {
    removeCookies()
    window.location.href = '/predict'
});
