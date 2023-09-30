import { Box } from "@mui/material";
import { socials } from "./data";
import "./styles.css";

function ContactSocials() {
  return (
    <div className="footer__socials">
      <Box display="flex" justifyContent="center">
        <ul className="c-social-list">
          {socials.map((social) => (
            <li>
              <a
                key={social.id}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {social.icon}
              </a>
            </li>
          ))}
        </ul>
      </Box>
    </div>
  );
}

export default ContactSocials;
