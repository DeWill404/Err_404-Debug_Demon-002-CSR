// Style object for Header tag
const head_style = {
    height: "110px",
    background: "linear-gradient(#187fe6, #fff)"
};

// Style object for H1 tag
const h1_style = {
    display: "inline-block",
    padding: "20px 12px",
    margin: "5px",
    border: "3px solid black",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "50%",
    backgroundColor: "#187fe6"
};

function Header() {
    return(
            <header style={head_style}>
			<h1 style={h1_style}> CSR </h1>
            </header>
    );
}

export default Header;