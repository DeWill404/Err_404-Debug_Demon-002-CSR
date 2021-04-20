function Info(props) {
    const style = {
        lineHeight: "1.3em",
        fontFamily: "monospace",
        color: "#A20",
    };

    return (
        <p
            className="text-center fw-bold"
            style={{...style, ...props.p_style}}>
                <span
                    className="fs-3"
                    style={props.t_style}>
                        WARNING
                </span>
                <br/>
                Refreshing / closing the page will close the session.
                <br/>
                Clear cache of page will also end session.
        </p>
    );
}

export default Info;