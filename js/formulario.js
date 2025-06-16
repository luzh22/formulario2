document.addEventListener('DOMContentLoaded', function() {
  // Referencias a elementos principales
  const form = document.getElementById('formEvento');
  const barra = document.getElementById('barraProgreso');
  const resultado = document.getElementById('resultado');
  const boton = document.getElementById('enviarRegistro'); // El botón debe tener este id y estar disabled en el HTML

  // IDs de los campos a validar (incluye Apellidos)
  const camposIds = [
    'nombre', 'Apellidos', 'gmail', 'confirm_gmail', 'password', 'confirm_password',
    'pais', 'tema', 'telefono', 'fecha_nacimiento', 'edad', 'acepto', 'comentarios'
  ];

  // Mensajes personalizados para cada campo (incluye Apellidos)
  const mensajes = {
    nombre: {
      error: 'El nombre es obligatorio.',
      exito: 'Nombre válido ✔️'
    },
    Apellidos: {
      error: 'El apellido es obligatorio.',
      exito: 'Apellido válido ✔️'
    },
    gmail: {
      error: 'El correo debe ser un Gmail válido (ejemplo@gmail.com).',
      exito: 'Correo válido ✔️'
    },
    confirm_gmail: {
      error: 'Los correos no coinciden.',
      exito: 'Los correos coinciden ✔️'
    },
    password: {
      error: 'La contraseña debe tener al menos 6 caracteres.',
      exito: 'Contraseña válida ✔️'
    },
    confirm_password: {
      error: 'Las contraseñas no coinciden.',
      exito: 'Las contraseñas coinciden ✔️'
    },
    pais: {
      error: 'Selecciona un país.',
      exito: 'País válido ✔️'
    },
    tema: {
      error: 'Selecciona un tema.',
      exito: 'Tema válido ✔️'
    },
    telefono: {
      error: 'El formato debe ser 300-123-4567',
      exito: 'Teléfono válido ✔️'
    },
    fecha_nacimiento: {
      error: 'Debes ser mayor de 18 años para registrarte.',
      exito: 'Edad válida ✔️'
    },
    edad: {
      error: 'La edad es obligatoria y mayor de 18.',
      exito: 'Edad válida ✔️'
    },
    acepto: {
      error: 'Debes aceptar los términos.',
      exito: 'Términos aceptados ✔️'
    },
    comentarios: {
      error: 'El comentario es obligatorio.',
      exito: 'Comentario válido ✔️'
    }
  };

  // Crea o selecciona el span de mensaje para cada campo
  function getOrCreateSpan(input) {
    let span = document.getElementById(input.id + '_msg');
    if (!span) {
      span = document.createElement('span');
      span.id = input.id + '_msg';
      span.style.display = 'block';
      span.style.fontSize = '0.9em';
      span.style.marginLeft = '8px';
      input.parentNode.insertBefore(span, input.nextSibling);
    }
    return span;
  }

  // Valida cada campo individualmente y muestra el mensaje correspondiente
  function validarCampo(input) {
    const id = input.id;
    const span = getOrCreateSpan(input);
    let valido = false;

    switch (id) {
      case 'nombre':
        valido = input.value.trim().length > 0;
        break;
      case 'Apellidos':
        valido = input.value.trim().length > 0;
        break;
      case 'gmail':
        valido = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(input.value);
        break;
      case 'confirm_gmail':
        const gmail = document.getElementById('gmail');
        valido = input.value === gmail.value && input.value !== '';
        break;
      case 'password':
        valido = input.value.length >= 6;
        break;
      case 'confirm_password':
        const password = document.getElementById('password');
        valido = input.value === password.value && input.value.length >= 6;
        break;
      case 'pais':
        valido = input.value.trim().length > 0;
        break;
      case 'tema':
        valido = input.value.trim().length > 0;
        break;
      case 'telefono':
        valido = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(input.value);
        break;
      case 'fecha_nacimiento':
        if (input.value) {
          const fecha = new Date(input.value);
          const hoy = new Date();
          let edad = hoy.getFullYear() - fecha.getFullYear();
          const m = hoy.getMonth() - fecha.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
            edad--;
          }
          valido = edad >= 18;
        }
        break;
      case 'edad':
        valido = input.value && Number(input.value) >= 18;
        break;
      case 'acepto':
        valido = input.checked;
        break;
      case 'comentarios':
        valido = input.value.trim().length > 0;
        break;
      default:
        valido = true;
    }

    // Mostrar mensaje de error o éxito
    if (valido) {
      span.textContent = mensajes[id]?.exito || '✔️';
      span.style.color = 'green';
      span.style.display = 'block';
    } else {
      span.textContent = mensajes[id]?.error || 'Campo inválido';
      span.style.color = 'red';
      span.style.display = 'block';
    }
    return valido;
  }

  // Actualiza la barra de progreso y el estado del botón de envío
  function actualizarProgresoYBoton() {
    let llenos = 0;
    let total = 0;
    let todoValido = true;
    camposIds.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        total++;
        if (validarCampo(input)) {
          llenos++;
        } else {
          todoValido = false;
        }
      }
    });
    const porcentaje = Math.round((llenos / total) * 100);
    if (barra) barra.value = porcentaje;
    if (boton) boton.disabled = !todoValido;
  }

  // Asigna eventos a cada campo para validar en tiempo real
  camposIds.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', actualizarProgresoYBoton);
      input.addEventListener('change', actualizarProgresoYBoton);
      // Evita copiar y pegar en confirmaciones
      if (id === 'confirm_password' || id === 'confirm_gmail') {
        input.addEventListener('paste', e => e.preventDefault());
        input.addEventListener('copy', e => e.preventDefault());
      }
    }
  });

  // Inicializa la validación y la barra de progreso al cargar
  actualizarProgresoYBoton();

  // Maneja el envío del formulario
  if (form && resultado) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      let valido = true;
      camposIds.forEach(id => {
        const input = document.getElementById(id);
        if (input && !validarCampo(input)) valido = false;
      });
      if (!valido) {
        resultado.innerHTML = '<span style="color:red;">Por favor corrige los errores antes de enviar.</span>';
        resultado.style.display = 'block';
        return;
      }
      // Muestra todos los datos enviados, incluyendo Apellidos
      const nombre = document.getElementById('nombre')?.value || '';
      const apellidos = document.getElementById('Apellidos')?.value || '';
      const gmail = document.getElementById('gmail')?.value || '';
      const pais = document.getElementById('pais')?.value || '';
      const tema = document.getElementById('tema')?.value || '';
      const telefono = document.getElementById('telefono')?.value || '';
      const fecha_nacimiento = document.getElementById('fecha_nacimiento')?.value || '';
      const edad = document.getElementById('edad')?.value || '';
      const comentarios = document.getElementById('comentarios')?.value || '';

      resultado.style.display = 'block';
      resultado.innerHTML = `
        <span style="color:green;">¡Formulario enviado correctamente! 🎉<br>Debajo del botón "Enviar registro" podrás observar los datos enviados.</span>
        <br><br>
        <strong>Datos enviados:</strong><br>
        Nombre: ${nombre}<br>
        Apellidos: ${apellidos}<br>
        Gmail: ${gmail}<br>
        País: ${pais}<br>
        Tema: ${tema}<br>
        Teléfono: ${telefono}<br>
        Fecha de nacimiento: ${fecha_nacimiento}<br>
        Edad: ${edad}<br>
        Comentarios: ${comentarios}
      `;
      alert('¡Formulario enviado correctamente! 🎉\nDebajo del botón "Enviar registro" podrás observar los datos enviados.');
    });
  }
});