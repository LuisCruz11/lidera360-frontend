import { useState } from "react";
import "../styles/passwordField.css";
import { PATTERN_PASSWORD, requisitosPassword } from "../utils/validaciones";

function PasswordField({ id, name, value, onChange, required = true, autoComplete }) {
  const [enfocado, setEnfocado] = useState(false);
  const requisitos = requisitosPassword(value);

  return (
    <span className="password-field">
      <input
        id={id}
        name={name}
        type="password"
        value={value}
        onChange={onChange}
        onFocus={() => setEnfocado(true)}
        onBlur={() => setEnfocado(false)}
        pattern={PATTERN_PASSWORD}
        title="Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial (@$!%?&)."
        minLength={8}
        required={required}
        autoComplete={autoComplete}
      />
      {enfocado && (
        <ul className="password-field-requisitos">
          <li className={requisitos.minLength ? "cumple" : "pendiente"}>
            {requisitos.minLength ? "✓" : "○"} 8 caracteres o más
          </li>
          <li className={requisitos.hasUpper ? "cumple" : "pendiente"}>
            {requisitos.hasUpper ? "✓" : "○"} Una letra mayúscula
          </li>
          <li className={requisitos.hasLower ? "cumple" : "pendiente"}>
            {requisitos.hasLower ? "✓" : "○"} Una letra minúscula
          </li>
          <li className={requisitos.hasNumber ? "cumple" : "pendiente"}>
            {requisitos.hasNumber ? "✓" : "○"} Un número
          </li>
          <li className={requisitos.hasSymbol ? "cumple" : "pendiente"}>
            {requisitos.hasSymbol ? "✓" : "○"} Un carácter especial (@$!%?&)
          </li>
        </ul>
      )}
    </span>
  );
}

export default PasswordField;
