import { useState } from "react";
// import { useChatStore } from "../store/chatStore";

const LobbyDialog = () => {
  //   const [message, setMessage] = useState("");

  //   const { sendMessage } = useChatStore();

  return (
    <div className="flex flex-grow justify-center items-center">
      <button
        className="btn"
        onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        create new
      </button>
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-5">Create New Lobby!</h3>
          <form
            action="create"
            className="flex flex-col min-w-100 h-fit"
          >
            {/* <UserCheck className="mb-10" size={50} color="#bbb"/> */}

            <input
              type="text"
              className="input validator p-6 mb-5 w-full"
              required
              placeholder="Lobby Name"
              pattern="[A-Za-z][A-Za-z0-9\-]*"
              minLength="3"
              maxLength="30"
              title="Only letters, numbers or dash"
              onChange={(e) => {
                // setFormData({ ...formData, name: e.target.value });
              }}
            />

            <input
              type="number"
              className="input validator p-6 mb-5 w-full"
              required
              placeholder="Width"
              min="1"
              max="1000"
              onChange={(e) => {
                // setFormData({ ...formData, width: parseInt(e.target.value) });
              }}
            />

            <input
              type="number"
              className="input validator p-6 mb-5 w-full"
              required
              placeholder="Height"
              min="1"
              max="1000"
              onChange={(e) => {
                // setFormData({ ...formData, height: parseInt(e.target.value) });
              }}
            />

            <input
              type="password"
              className="input validator p-6 mb-5 w-full"
              required
              placeholder="Password"
              onChange={(e) => {
                // setFormData({ ...formData, password: e.target.value });
              }}
            />

            <input
              type="number"
              className="input validator p-6 mb-10 w-full"
              required
              placeholder="Max Players"
              min="1"
              max="100"
              onChange={(e) => {
                // setFormData({ ...formData, maxPlayers: parseInt(e.target.value) });
              }}
            />

            <button type="submit" className="btn shadow-md p-5">
              Create Lobby
            </button>
            {/* <div className="divider mt-5 mb-3"></div> */}
            {/* <Link to="/" className="link text-md">
      Back to Home
    </Link> */}
          </form>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default LobbyDialog;
