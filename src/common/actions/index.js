import axios from 'axios';


export const fetchAssets = (param) => async (dispatch) => {
    dispatch({ type: 'SHOW_LOADER' });
    const res = await axios.get(`http://localhost:5000/api/asset${param}`)
    if (res.status === 200) {
        dispatch({ type: 'HIDE_LOADER' });
        dispatch({ type: 'FETCH_ASSETS', payload: res.data})
    } else {
        dispatch({ type: 'HIDE_LOADER' });
    }
}

export const actionCall = (owner, location) => async(dispatch) => {
    if(location!== 'sidebar'){
        dispatch({ type: 'SHOW_LOADER' });;
    }
    const res = await axios.post('http://localhost:5000/api/token/account-details', { userId: owner })
        if (res.status === 200) {
            dispatch({ type: 'HIDE_LOADER' });
            dispatch({ type: 'FETCH_ACCOUNT_DETAILS', payload:{ ...res.data }});
        } else {
            dispatch({ type: 'HIDE_LOADER' });
        }
}