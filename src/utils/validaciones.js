export const REGEX_SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
export const REGEX_CEDULA = /^\d{6,10}$/;
export const REGEX_TELEFONO = /^\d{7,10}$/;
export const REGEX_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;

// Sin anclas (^ $): el atributo HTML "pattern" ancla el valor completo por su cuenta.
export const PATTERN_SOLO_LETRAS = "[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\\s]+";
export const PATTERN_CEDULA = "\\d{6,10}";
export const PATTERN_TELEFONO = "\\d{7,10}";
export const PATTERN_PASSWORD = "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%?&])[A-Za-z\\d@$!%?&]{8,}";

export const MENSAJE_CEDULA = "La cédula debe contener solo números, entre 6 y 10 dígitos.";
export const MENSAJE_NOMBRE = "Solo puede contener letras y espacios.";
export const MENSAJE_TELEFONO = "El teléfono debe contener solo números, entre 7 y 10 dígitos.";
export const MENSAJE_PASSWORD =
  "Mínimo 8 caracteres, con al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%?&).";

export const soloLetras = (valor = "") => REGEX_SOLO_LETRAS.test(valor);
export const cedulaValida = (valor = "") => REGEX_CEDULA.test(valor);
export const telefonoValido = (valor = "") => REGEX_TELEFONO.test(valor);
export const validarPassword = (password = "") => REGEX_PASSWORD.test(password);

export const requisitosPassword = (password = "") => ({
  minLength: password.length >= 8,
  hasUpper: /[A-Z]/.test(password),
  hasLower: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSymbol: /[@$!%?&#]/.test(password),
});
