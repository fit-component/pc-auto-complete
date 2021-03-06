import $ from 'jquery'
import mock from 'jquery-mockjax'

let mockjax = mock($, window)

mockjax({
    url: "/api/auto-complete/basic",
    contentType: "application/json",
    response: function (settings) {
        let response = []
        for (let i = 0; i < 10; i++) {
            response.push({
                text: settings.data.search + 'test' + i,
                value: i
            })
        }
        this.responseText = response
    }
})
