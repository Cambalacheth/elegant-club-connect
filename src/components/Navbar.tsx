
import Navbar from "./navbar/Navbar";

// Default to Spanish if no language provided
const NavbarWithDefaultLang = (props: { currentLanguage?: string }) => {
  return <Navbar currentLanguage={props.currentLanguage || "es"} />;
};

export default NavbarWithDefaultLang;
