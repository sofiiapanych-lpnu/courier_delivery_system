import React from "react";
import styles from "./ActionButton.module.css";

const ActionButton = ({ onClick, children, variant = "default" }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default ActionButton;
