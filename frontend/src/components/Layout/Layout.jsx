import Navbar from "../Navbar/Navbar";

function Layout({ children }) {

    return (

        <>

            <Navbar />

            <div style={{padding:"35px"}}>

                {children}

            </div>

        </>

    );

}

export default Layout;