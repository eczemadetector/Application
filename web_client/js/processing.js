window.setInterval(() => {

    httpPostAsync('/getStatus', {}, res => {

        res = parseInt(res)

        if (res == 1) { // Hand has eczema
            console.log('infected')
            document.cookie = "infected=1; path=/"
            window.location.href = '/results'

        } else if (res == 0) { // Hand is normal
            console.log('not infected')
            document.cookie = "infected=0; path=/"
            window.location.href = '/results'

        } else console.log('wtf??')
    })

}, 1000)

