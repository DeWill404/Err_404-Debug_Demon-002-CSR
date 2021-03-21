import React from 'react';
import "../App.css";

// Wrapper to show basic styles
function Wrapper({content}) {
	return(
		<div>
			<header id="header">
				<h1 id="logo">
					CSR
				</h1>
			</header>
			{content}
			<footer id="footer"></footer>
		</div>
	);
}

export default Wrapper;