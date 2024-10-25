import { useEffect } from "react";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Protected = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  if (Cookies.get("accessToken")) {
    return children;
  }
  return null;
};

Protected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Protected;
