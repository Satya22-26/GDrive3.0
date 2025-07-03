import { useEffect } from "react";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const addressInput = document.querySelector(".address");
    const address = addressInput.value.trim();
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
      console.error('Enter a valid Ethereum address');
      return;
    }
    await contract.allow(address);
    setModalOpen(false);
  };

  const revoking = async () => {
    const select = document.querySelector("#selectNumber");
    let address = select.value;
    // If placeholder still selected, auto-select first real option
    if (!address && select.options.length > 1) {
      address = select.options[1].value;
    }
    if (!/^0x[0-9a-fA-F]{40}$/.test(address)) {
      console.error('Select a valid address to revoke');
      return;
    }
    try {
      await contract.disallow(address);
      setModalOpen(false);
    } catch (err) {
      console.error('Revoke failed:', err);
    }
  };

  useEffect(() => {
    const accessList = async () => {
      const list = await contract.shareAccess();
      const select = document.querySelector("#selectNumber");
      select.innerHTML = '<option value="" disabled>People With Access</option>';
      list.forEach(({ user, access }) => {
        if (access && /^0x[0-9a-fA-F]{40}$/.test(user)) {
          const opt = document.createElement("option");
          opt.textContent = user;
          opt.value = user;
          select.appendChild(opt);
        }
      });
      // default to first real option if exists
      if (select.options.length > 1) {
        select.selectedIndex = 1;
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
            />
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option value="" disabled>
                People With Access
              </option>
            </select>
          </form>
          <div className="footer">
            <button onClick={() => setModalOpen(false)} id="cancelBtn">
              Cancel
            </button>
            <button onClick={sharing}>Share</button>
            <button onClick={revoking}>Revoke</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
