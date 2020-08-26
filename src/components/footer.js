import React from 'react'


const Footer = () => {
    return <footer className="container" style={styles.container}>
        <p style={styles.container__p}>Hecho con <i className="fas fa-heart" style={styles.heart} /></p>
        <p>Mentira hay que tener poco amor propio para hacer estas cosas</p>
    </footer>
}

const styles = {
    container: {
        padding: '.6rem 0',
        textAlign: 'center'
    },
    container__p: {
        marginBottom:0
    },
    heart: {
        color: '#e25555'
    }
}

export default Footer