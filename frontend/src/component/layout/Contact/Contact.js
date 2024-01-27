import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:arpitjain25.11.2001@gmail.com">
        <Button>Contact: arpitjain25.11.2001@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;
