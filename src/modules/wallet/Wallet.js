import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Loader from "../../common/components/Loader";
import { actionCall } from "../../common/actions";
import Toast from "../../common/components/Toast";

const Wallet = () => {
    const owner = useSelector(state => state.userId);
    const dispatch = useDispatch();
    const [toastMsg, setToastMsg] = useState('');
    const [classProp, setClassProp] = useState('');
    const [showToast, setShowToast] = useState(false);
    const { isLoading, accountDetails } = useSelector(state => state);
    useEffect(() => {
        dispatch(actionCall(owner));
    }, [])

    const addToken = async () => {
        const tokenForm = document.getElementById('tokenForm');
        const res = await axios.post('http://localhost:5000/api/token/add', { token: tokenForm.token.value, userId: owner })
        if (res.status === 200) {
            setShowToast(true);
            setClassProp('bg-success show');
            setToastMsg(res.data);
            setTimeout(() => setShowToast(false), 3000);
            dispatch(actionCall(owner));
        }else {
            setShowToast(true);
            setClassProp('bg-danger show');
            setToastMsg(res.error.response.data);
            setTimeout(() => setShowToast(false), 3000);
        }
    }
    return (isLoading ? <Loader /> : (
        <div>
            <h4 className="d-flex justify-content-center">Your Wallet</h4>
            <div className="text-center m-5 p-4 border shadow-lg ">
                <div className="row mx-0 mb-4">
                    <div className="col-6">
                        Name:
                    </div>
                    <div className="col-6">
                        {accountDetails.name}
                    </div>
                </div>
                <div className="row mx-0 mb-4">
                    <div className="col-6">
                        Account Address:
                    </div>
                    <div className="col-6">
                        {accountDetails.accountAddress}
                    </div>
                </div>
                <div className="row mx-0 mb-4">
                    <div className="col-6">
                        Ethers Balance:
                    </div>
                    <div className="col-6">
                        {accountDetails.etherBalance}
                    </div>
                </div>
                <div className="row mx-0 mb-4">
                    <div className="col-6">
                        Assets:
                    </div>
                    <div className="col-6">
                        {accountDetails.assetBalance}
                    </div>
                </div>
                <div className="row mx-0 mb-4">
                    <div className="col-6">
                        Token Balance:
                    </div>
                    <div className="col-6">
                        {accountDetails.tokenBalance} ECT
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-5">
                    <button className="btn btn-primary" data-bs-target="#addToken" data-bs-toggle="modal">Buy Tokens</button>
                </div>
            </div>
            <div className="modal fade" tabIndex="-1" id="addToken">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">ADD TOKENS</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="tokenForm">
                                <div className='form-group mb-3'>
                                    <label htmlFor='token' className='mb-2'>Number of Tokens</label>
                                    <input id='token' type='number' min={1} className='form-control' />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={addToken}>Add Tokens</button>
                        </div>
                    </div>
                </div>
            </div>
            {showToast && <Toast className={classProp} msg={toastMsg} showToast={showToast} />}

        </div>))
}

export default Wallet;