import React from 'react'

const styles = {
    container: {
        position: 'absolute',
        paddingTop: '1rem',
        top: 0,
    },
    alert: {
        zIndex: 3
    }
}

const message = props => {
    return  <div className="container-fluid" style={styles.container}>
                <div className="row">
                    <div className="col-sm-12 col-md-3 col-lg-2 offset-md-9 offset-lg-10" style={styles.alert}>
                        { 
                            props.errors.map((e, i)=> 
                                <div key={i} className="alert alert-danger" role="alert">
                                    {e? e.msg: "Perdón hemos tenido un problema. Intentalo más tarde"}
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

}

export default message