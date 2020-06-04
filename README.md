# Clinica

Proyecto generado con Angular cli: version 9.0.7.
En este nos enfocaremos en una clinica online, donde los pacientes pueden ser atendidos de forma virtual y los profesionales de la misma forma puede atender a estos.

# Uso

Paciente: Comenzamos registrandonos y cargando nuestra info de usuario, junto con dos fotos las cuales puedan identificarnos.
Podemos pedir turnos filtrando por especialidad, profesional o dia de la semana(cuidado al pedir turnos con dos profesionales a una misma hora y en un mismo dia). Tambien tenemos la posibilidad de cancelar nuestros turnos si es que lo deseamos, pero en caso de atendernos, podremos completar una encuesta de satisfaccion que sera vista por el profesional.

Profesional: Comenzamos registrandonos y cargando nuestra info de usuario, junto con dos fotos las cuales puedan identificarnos, pero nuestro perfil debe ser aceptado por el administrador para comenzar a atender. Podremos cargar nuestros horarios al dia de la semana correspondiente y horario deseado.
Tambien el profesional estara habilitado para gestionar los turnos: aceptando, cancelando o atendiendo estos segun corresponda(en caso de atenderlo, podemos cargar una encuesta de satisfaccion y dejar una reseña. En caso de cancelarlo se debe informar el motivo al usuario).


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

