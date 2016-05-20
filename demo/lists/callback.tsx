import * as React from 'react'
import AutoComplete from '../../src'

const opts = {
    url: '/api/auto-complete/basic',
    method: 'get',
    beforeSend: (value:any)=> {
        return {
            search: value
        }
    },
    complete: (res:any)=> {
        return res
    },
    delay: 200,
    onSelect: (value:any)=> {
        console.log(value)
    }
}

export default class Demo extends React.Component <any,any> {
    render() {
        return (
            <AutoComplete {...opts}/>
        )
    }
}