import { useEffect, useState } from "react";
import "./Modal.css";
const Modal = ({ setModalOpen, contract }) => {
  const [selectedAddress, setSelectedAddress] = useState("");

  const sharing = async () => {
    const address = document.querySelector(".address").value;
    await contract.Allow(address);
    console.log("shared");
    setModalOpen(false);
  };

  const disallowAccess = async () => {
    if (!selectedAddress) return;
    const addre = selectedAddress.split(",")[0];
    await contract.Disallow(addre);
    console.log("access revoked");
    setModalOpen(false);
  };

  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.ShareAccess();
      let select = document.querySelector("#selectNumber");
      const options = addressList;

      for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let e1 = document.createElement("option");
        e1.textContent = opt;
        e1.value = opt;
        console.log(e1);
        select.appendChild(e1);
      }
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            ></input>
          </div>
          <form id="myForm">
            <select
              id="selectNumber"
              onChange={(e) => setSelectedAddress(e.target.value)}
              value={selectedAddress}
            >
              <option className="address">People With Access</option>
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={() => sharing()}>Share</button>
            <button onClick={() => disallowAccess()}>Revoke Access</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;
