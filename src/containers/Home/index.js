import React from 'react'
import ExchangeCompare from '../../components/exchangeCompare'



const Home = props => {

    return (
        <div className="row">
            <ExchangeCompare 
                errors={props.errors}
                setErrors={props.setErrors}
            />
        </div>
    )
}

export default Home