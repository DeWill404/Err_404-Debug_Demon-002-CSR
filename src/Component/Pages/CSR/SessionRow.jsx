import Qrcode from "../../Qrcode/Qrcode";
import "./CSR.css";

function SessionRow(props) {
  // DATA
  const isOnline = props.obj?.user === 'online';
  const username = props.obj.username;
  const admin_link = props.link.replace("user", "admin");
  const user_link = props.link;

  return (
    <div className="row align-items-center m-1 my-3 p-1">
      <div className="col">
        <div
          className={`session-online ${isOnline ? "online" : ""}`}
          data-toggle="tooltip"
          data-placement="bottom"
          title={isOnline ? "Online" : "Offline"} ></div>
      </div>

      <div className="col">
        <span className="session-name">{username}</span>
      </div>

      <div className="col">
        <a
          href={admin_link}
          target="_blank"
          rel="noreferrer"
          className="session-link"
          onClick={ () => props.save() } >
          Admin: {admin_link}
        </a>
        <span
          className="session-link"
          style={{ color: "black", textDecoration: "none" }} >
          User: {user_link}
        </span>
      </div>

      <div className="col">
        <Qrcode link={user_link} />
      </div>
    </div>
  );
}

export default SessionRow;
