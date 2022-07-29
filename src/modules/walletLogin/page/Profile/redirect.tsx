import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function App() {
    const history = useNavigate();
    useEffect(() => {
        const url = localStorage.getItem('redirect')
        if (url) {
            history(url)
        } else {
            history('/')
        }
        // eslint-disable-next-line
    }, [])

    return <>redirect</>
}
export default App;