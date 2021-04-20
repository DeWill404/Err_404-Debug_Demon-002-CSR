import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { syncData, saveSession } from "../../Firebase";
import { disableReload, enableReload } from "../../Helper";
import Info from "../../Info";
import { showData } from "./DataRow";
import "./User.css";

function User(props) {
    // Disable reload
    // disableReload(() => {
    //     // Move current to safe storage
    //     logged && saveSession(logged.user, dataTree);
    //     // Log out user
    //     sessionStorage.removeItem(props.login);
    // });

    // React history hook
    const history = useHistory();

    // Check if csr is logged in or not
    const logged = JSON.parse(sessionStorage.getItem(props.login));

    // React hook, for get csr name
    const [csr, getCSR] = useState("---");
    // React hook, to store data
    const [dataTree, getDataTree] = useState("---");
    
    // React hook, to run after first render
    useEffect(() => {
        if (logged) {
            // Sync session details
            syncData(`session/${logged.user}`, getDataTree);
            // Sync csr name
            syncData(`session/${logged.user.substring(0, logged.user.indexOf('/'))}/csr`, getCSR);
        }

        // Check if key is not valid
        if (!dataTree || (dataTree!=='---' && !dataTree.username))
            history.push("/_");

        // return () => enableReload(() => logged && saveSession(logged.user, dataTree) );
    }, []);

    
    return(
        <main style={{minHeight:"calc(100vh - 220px)"}}>
            { logged && logged.user ? (
                dataTree && (dataTree==="---" || dataTree.username) ? (
                    <div className="container">
                        <title>CSR | {dataTree && dataTree!=='---' ? dataTree.username : '---'}</title>
                        <Info />

                        <div className="row justify-content-betweeen">
                            <span className="col nameStyle">{dataTree && dataTree!=='---' && `Hello, ${dataTree.username}`}</span>
                            <span className="col nameStyle text-end">{csr && csr!=='---' && `CSR: ${csr}`}</span>
                        </div>
                        
                        <div id="inputs"> {
                            dataTree==='---' ?
                            ( <span className="col nameStyle d-block text-center fs-1 mt-2">There is no data to show.</span> ) :
                            ( Object.keys(dataTree).map(key => key!=='username' && showData(logged.user, dataTree, '', key)) )
                        } </div>

                    </div>
                ) :
                history.replace('/_')
            ) :
            history.replace("/") }
        </main>
    );
}

export default User;