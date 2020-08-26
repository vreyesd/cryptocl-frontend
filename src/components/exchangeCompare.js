import React, {useState, useEffect} from 'react'
import axios from 'axios'

const styles = {
    inputsContainer: {
        fontSize: '1.25rem'
    },
    inputsContainer__inputs: {
        borderTop: 0,
        borderLeft: 0,
        borderRight: 0,
        borderRadius: 0,
    },
    inputsContainer__text: {
        lineHeight: 1.5,
        textAlign: 'center',
        marginTop:'.8rem'
    }
}


const calcTotal = (amount, book) => {
    let toSell = amount
    let i = 0
    let toReceive = 0

    while(toSell &&  i < book.length) {
        const preCalc = Number(book[i][1]) - toSell
        
        if(preCalc >= 0) {
            toReceive += toSell * Number(book[i][0])
            toSell = 0
        } else {
            toSell -= Number(book[i][1])
            toReceive += Number(book[i][1]) * Number(book[i][0])
        }
        i++
    }

    return toReceive
}

const formatTotal = (amount, currency) => {
    let digits = 6
    const fiat = ['clp']

    if(fiat.indexOf(currency) > - 1)
        digits = 0
    
    return amount.toLocaleString(undefined, {maximumFractionDigits: digits})
}

const Inputs = props => {
    return (
        <div className="row mb-5" style={styles.inputsContainer}>
            <div className="col-12">
                <div className="form-row">
                    <div className="col-md-2 mb-2">
                        <select className="form-control form-control-lg" defaultValue={props.operation} disabled={true} onChange={e => props.setOperation(e.target.value)} style={styles.inputsContainer__inputs}>
                            <option value="sell">vender</option>
                            <option value="buy">comprar</option>
                        </select>
                    </div>
                    <div className="col-md-3 mb-2">
                        <input type="number" value={props.amount} onChange={e => props.setAmount(e.target.value)} className="form-control form-control-lg" placeholder="Cantidad de" style={styles.inputsContainer__inputs}/>
                    </div>
                    <div className="col-md-2 mb-2 pl-md-3">
                        <select className="form-control form-control-lg" defaultValue={props.toGive} onChange={e => props.setToGive(e.target.value)} style={styles.inputsContainer__inputs}>
                            <option value="btc">BTC</option>
                            <option value="eth">ETH</option>
                        </select>
                    </div>
                    <div className="col-md-2 mb-2" style={styles.inputsContainer__text}>
                        <p>por</p>
                    </div>
                    <div className="col-md-2 mb-2 pl-md-3">
                        <select className="form-control form-control-lg" disabled={true} defaultValue={props.toReceive} onChange={e => props.setToReceive(e.target.value)} style={styles.inputsContainer__inputs}>
                            <option value="clp">clp</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="form-check">
                    <input 
                        type="checkbox"
                        className="form-check-input"
                        id="toWithdraw"
                        checked={props.showWithdrawFee}
                        onChange={e => props.setShowWithdrawFee(!props.showWithdrawFee)}
                        />
                    <label className="form-check-label" htmlFor="toWithdraw">con comisión de retiro?</label>
                </div>
            </div>
        </div>
    )
}




const DataTableRow = props => {   
    return (
        <tr>
            <td><a href={props.url}>{props.name}</a></td>
            <td>
                <input type="number" value={props.newFee || props.fee} onChange={e => props.setNewFee(e.target.value)} />
            </td>
            {props.showWithdrawFee && <td>{props.withdrawFee}</td>}
            <td>{formatTotal(props.total, props.currency)}</td>
        </tr>
    )
}



const DataTable = props => {
    const [newFee, setNewFee] = useState(0)

    return (
        <div className="row">
            <div className="col table-responsive">

            <table className="table">
                <thead>
                    <tr>
                        <th>Exchange</th>
                        <th>Comisión</th>
                        {props.showWithdrawFee && <th>Comisión de Retiro</th>}
                        <th>Total({props.toReceive})</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props.exchanges).map(exchange => {
                        const ex = props.exchanges[exchange]
                        const toReceive = calcTotal(Number(props.amount), ex.book)
                        const total = (toReceive * (1 - (newFee || ex.fee))) - (props.showWithdrawFee? ex.withdrawFee: 0)

                        return(
                            <DataTableRow 
                                currency={props.toReceive}
                                key={exchange}
                                name={exchange}
                                url={ex.url}
                                fee={ex.fee}
                                newFee={newFee}
                                setNewFee={setNewFee}
                                withdrawFee={ex.withdrawFee}
                                amount={props.amount}
                                showWithdrawFee={props.showWithdrawFee}
                                total={total}
                            />
                        )
                        }
                    )}
                </tbody>
            </table>
            </div>
        </div>
    )
}



const ExchangeCompare = props => {
    const [showWithdrawFee, setShowWithdrawFee] = useState(false)
    const [amount, setAmount] = useState('')
    const [operation, setOperation] = useState('sell')
    const [toReceive, setToReceive] = useState('clp')
    const [toGive, setToGive] = useState('btc')
    const [exchanges, setExchanges] = useState({})


    const getData = () => {
        axios.get(`/api/bidbook/${toGive}-${toReceive}`)
        .then(r => {
            setExchanges(r.data)
        })
        .catch(e => {
            const error = {msg: "Tuvimos un error al obtener los precios", date: Date.now()}
            const newErrors = [error, ...props.errors]
            props.setErrors(newErrors)
        })
    }

    useEffect(getData, [toGive, toReceive])

    useEffect(() => {
        const interval = setInterval(() => {
            getData()
        }, 30000);

        return () => clearInterval(interval)
    })


    return (
        <div className="col-sm-12">
            <h2>Cotizar operación</h2>
            <Inputs 
                amount={amount}
                setAmount={setAmount}
                operation={operation}
                setOperation={setOperation}
                toReceive={toReceive}
                setToReceive={setToReceive}
                toGive={toGive}
                setToGive={setToGive}
                showWithdrawFee={showWithdrawFee}
                setShowWithdrawFee={setShowWithdrawFee}
            />
            {Object.keys(exchanges).length?
                <DataTable
                    amount={amount}
                    exchanges={exchanges}
                    showWithdrawFee={showWithdrawFee}
                    toReceive={toReceive}
                />
            :''}
        </div>
    )
}


export default ExchangeCompare