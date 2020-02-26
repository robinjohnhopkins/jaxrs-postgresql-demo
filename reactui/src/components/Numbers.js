import React from 'react';
import Client from './Client';


export default class Numbers extends React.Component {

    constructor (props){
        super(props);
        this.client = new Client();
        this.state = {numbers:[]};
        var me = this;
        this.client.numbers().then (r => me.setState({numbers: r}));
    }

    render (){
        console.log('render numbers ', this.state.numbers);
        return <div>access numbers from REST
            <section>
                {
                    this.state.numbers.map((n,index) => <div key={index} >{n}</div>)
                }
            </section>

        </div>;
    }
}