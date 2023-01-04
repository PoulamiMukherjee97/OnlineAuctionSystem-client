import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { fetchAssets } from "../../common/actions";
import Toast from "../../common/components/Toast";
import NoAssets from "../../common/components/noAssets";
import PlaceHolder from "../../common/components/Placeholder";


const MarketPlace = () => {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const owner = useSelector(state => state.userId);
    const { isLoading, assets, accountDetails } = useSelector(state => state);
    const param = userId ? `/${userId}` : '';
    const btnColor = userId ? 'danger' : 'primary';
    const [token, setToken] = useState({});
    const [toastMsg, setToastMsg] = useState('');
    const [classProp, setClassProp] = useState('');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        dispatch(fetchAssets(param));
    }, []);

    const deleteAsset = (el) => {
        axios.delete('http://localhost:5000/api/asset/delete', { data: el }).then(res => {
            if (res.status === 200) {
                dispatch(fetchAssets(param));
                setShowToast(true);
                setClassProp('bg-success show');
                setToastMsg("Asset Deleted Successfully.");
                setTimeout(() => setShowToast(false), 3000);
            }
        });
    }
    const buyAsset = () => {
        if (token.price > accountDetails.tokenBalance) {
            setShowToast(true);
            setClassProp('bg-danger show');
            setToastMsg("You Dont have enough Tokens.");
            setTimeout(() => setShowToast(false), 3000);
            return;
        }
        axios.post('http://localhost:5000/api/asset/buyAsset', { ...token, buyer: owner }).then(res => {
            if (res.status === 200) {
                dispatch(fetchAssets(param));
                setShowToast(true);
                setClassProp('bg-success show');
                setToastMsg("Asset Purchased.");
                setTimeout(() => setShowToast(false), 3000);
            }
        }).catch(error => {
            setShowToast(true);
            setClassProp('bg-danger show');
            setToastMsg(error.response.data);
            setTimeout(() => setShowToast(false), 3000);
        });

    }
    return (isLoading ? <PlaceHolder btnColor={btnColor}/> : (assets.length > 0 ? (
        <div className="mt-4">
            <div className="row mx-0 justify-content-center">
                <h4 className="text-center mb-4">{userId ? 'Your Assets' : 'All Assets'}</h4>
                {assets.map(el => <div key={el._id} className="col-md-3 col-12 card mx-3 shadow-lg p-3 mb-5" >
                    <img src={el.image} className="card-img-top" alt={el.asset} onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                    }} style={{ height: "15rem" }} />
                    <div className="card-body">
                        <h5 className="card-title">{el.asset}</h5>
                        <p>{el.type}</p>
                        <p className="card-text">{el.description}</p>
                        <p className="card-text">Price : {el.price} ECT</p>
                        {!userId && el.owner !== owner && <button className="btn btn-primary" data-bs-target="#sendToken" data-bs-toggle="modal" onClick={() => setToken(el)}>Buy</button>}
                        {userId && el.owner === owner && <button className="btn btn-danger" onClick={() => deleteAsset(el)}>Delete</button>}
                    </div>
                </div>)}
                <div className="modal fade" tabIndex="-1" id="sendToken">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">TOKEN TRANSFER</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to transfer {token.price} tokens to buy the selected Asset: {token.asset}?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={buyAsset}>Yes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showToast && <Toast className={classProp} msg={toastMsg} showToast={showToast} />}
        </div>
    ) : (<div><NoAssets/>
            {showToast && <Toast className={classProp} msg={toastMsg} showToast={showToast} />}
    </div>)))
}

export default MarketPlace;