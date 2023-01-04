import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssets } from "../../common/actions";
import Loader from "../../common/components/Loader";
import NoAssets from "../../common/components/noAssets";
import PlaceHolder from "../../common/components/Placeholder";

const AssetHistory = () => {
    const { assets, isLoading } = useSelector(state => state);
    const [transHistory, setTransHistory] = useState([]);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchAssets(''));
    }, [])
    const fetchAssetHistory = (el) => {
        setLoader(true);
        axios.post("http://localhost:5000/api/asset/history", {...el}).then(res =>{
            setTransHistory([...res.data]);
            setLoader(false);
        });
    }
    return (isLoading? <PlaceHolder btnColor="success"/> : ( assets.length > 0 ?
    <div className="row mx-0 justify-content-center">
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
                <button className="btn btn-success" data-bs-target="#history" data-bs-toggle="modal" onClick={() => fetchAssetHistory(el)} >Check Asset History</button>
            </div>
        </div>)}
        <div className="modal fade" tabIndex="-1" id="history">
            <div className="modal-dialog" style={{ maxWidth: '700px'}}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">ASSET HISTORY</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="row mx-0 p-2 mb-3 text-primary">
                            <div className="col-md-6 fw-bold">
                                FROM
                            </div>
                            <div className="col-md-6 fw-bold">
                                TO
                            </div>
                        </div>
                        {loader? <Loader/> : transHistory.map(el => <div className="row mx-0 mb-3 p-2" style={{border: '2px solid #0d6efd'}}>
                            <div className="col-md-6">
                                <div className="fw-bold">
                                    <p className="text-primary">{el.from} -----&gt;</p>
                                    {el.from_address!== '0x0000000000000000000000000000000000000000' &&<p className="text-truncate">Address: {el.from_address}</p>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="fw-bold">
                                    <p className="text-primary">{el.to}</p>
                                    <p className="text-truncate">Address: {el.to_address}</p>
                                </div>
                            </div>
                        </div>)}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>: <NoAssets />))
}

export default AssetHistory;