-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-05-2019 a las 11:09:28
-- Versión del servidor: 10.1.33-MariaDB
-- Versión de PHP: 7.2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tfg`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actor_universitario`
--

CREATE TABLE `actor_universitario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `apellidos` varchar(256) NOT NULL,
  `tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `actor_universitario`
--

INSERT INTO `actor_universitario` (`id`, `nombre`, `apellidos`, `tipo`) VALUES
(1, 'Agata', 'Sanchez Andreu', 0),
(2, 'Alberto', 'Fernandez-Baillo Rodriguez', 0),
(3, 'Ignacio', 'Domingo Martin', 0),
(4, 'Julia', 'Fernandez Reyes', 0),
(5, 'Miguel', 'Vega Ochoa', 0),
(6, 'Antonio', 'Navarro Perez', 1),
(7, 'Javier', 'Arroyo Gonzalez', 1),
(8, 'Rafael', 'Caballero Roldan', 1),
(9, 'Manuel', 'Montenegro Dominguez', 1),
(10, 'Javier', 'Correas Gomez', 1),
(11, 'Hector', 'Gauchia Miguel', 1),
(12, 'Simon', 'Pickin Tutor', 1),
(13, 'Ivan', 'Fernandez Sanchez', 0),
(14, 'Jorge', 'Fajardo Ziguete', 0),
(15, 'Daniel', 'Decano FDI', 2),
(16, 'Lucia', 'Ruiz', 1),
(17, 'admin', 'admin', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asiento`
--

CREATE TABLE `asiento` (
  `id` int(11) NOT NULL,
  `id_aula` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `asiento`
--

INSERT INTO `asiento` (`id`, `id_aula`, `id_alumno`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(6, 1, 4),
(7, 1, 5),
(4, 1, 13),
(5, 1, 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura`
--

CREATE TABLE `asignatura` (
  `id` int(11) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `id_titulacion` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `asignatura`
--

INSERT INTO `asignatura` (`id`, `nombre`, `id_titulacion`) VALUES
(1, 'Fundamentos de la Programacion', '1'),
(2, 'Fundamentos de la Programacion', '2'),
(3, 'Fundamentos de la Programacion', '3'),
(4, 'Fundamentos de los Computadores', '1'),
(5, 'Fundamentos de los Computadores', '2'),
(6, 'Fundamentos de los Computadores', '3'),
(7, 'Gestion Empresarial I', '1'),
(8, 'Gestion Empresarial I', '2'),
(9, 'Gestion Empresarial I', '3'),
(10, 'Estructura de Datos y Algoritmos', '1'),
(11, 'Estructura de Datos y Algoritmos', '2'),
(12, 'Gestión de Proyectos Software', '1'),
(13, 'Aplicaciones Web', '1'),
(14, 'Ingenieria del software', '1'),
(16, 'Ingenieria del software', '2'),
(17, 'Redes', '1'),
(18, 'Redes', '2'),
(19, 'Ingenieria del conocimiento', '1'),
(20, 'Tecnicas Algoritmicas de la Ingenieria del Software', '1'),
(21, 'Estructura de Datos y Algoritmos', '3'),
(22, 'Ingenieria del software', '3'),
(23, 'Redes', '3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id_alumno` int(11) NOT NULL,
  `id_examen` int(11) NOT NULL,
  `hora_entrega` date NOT NULL,
  `hora_salida` date NOT NULL,
  `id_entrega` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aula`
--

CREATE TABLE `aula` (
  `id` int(11) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `fila` int(11) NOT NULL,
  `columnas` int(11) NOT NULL,
  `pasillo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `aula`
--

INSERT INTO `aula` (`id`, `nombre`, `fila`, `columnas`, `pasillo`) VALUES
(1, 'Aula 1', 5, 14, 1),
(2, 'Aula 2', 8, 10, 1),
(3, 'Aula 3', 8, 10, 1),
(4, 'Aula 4', 8, 10, 1),
(5, 'Aula 5', 8, 10, 1),
(6, 'Aula 6', 10, 6, 1),
(12, 'Lab 1', 6, 3, 0),
(13, 'Lab 2', 6, 3, 0),
(14, 'Lab 3', 6, 3, 0),
(15, 'Lab 11', 5, 4, 1),
(16, 'Lab 12', 5, 4, 1),
(17, 'Lab 13', 5, 4, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aviso`
--

CREATE TABLE `aviso` (
  `id` int(11) NOT NULL,
  `id_alumno` int(11) NOT NULL,
  `id_profesor` int(11) NOT NULL,
  `texto` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conectar`
--

CREATE TABLE `conectar` (
  `id_profesor` int(11) NOT NULL,
  `user` varchar(256) NOT NULL,
  `pass` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `conectar`
--

INSERT INTO `conectar` (`id_profesor`, `user`, `pass`) VALUES
(6, 'antonionavarro', 'antonio'),
(7, 'javierarroyo', 'javier'),
(8, 'rafaelcaballero', 'rafael'),
(9, 'manuelmontenegro', 'manuel'),
(11, 'hectorgauchia', 'hector'),
(12, 'simonpickin', 'simon'),
(17, 'admin', 'admin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrega`
--

CREATE TABLE `entrega` (
  `id` int(11) NOT NULL,
  `id_asiento` int(11) NOT NULL,
  `hora` date NOT NULL,
  `entregado` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `entrega`
--

INSERT INTO `entrega` (`id`, `id_asiento`, `hora`, `entregado`) VALUES
(3, 2, '2019-05-28', 0),
(8, 6, '0000-00-00', 0),
(9, 6, '2019-05-28', 0),
(11, 6, '2019-05-28', 1),
(12, 6, '2019-05-28', 0),
(13, 6, '2019-05-28', 1),
(14, 6, '2019-05-28', 1),
(15, 6, '2019-05-28', 1),
(16, 4, '2019-05-28', 0),
(17, 2, '2019-05-28', 0),
(18, 7, '2019-05-28', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `text` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `events`
--

INSERT INTO `events` (`id`, `start_date`, `end_date`, `text`) VALUES
(1, '2019-05-20 10:55:00', '2019-05-20 12:55:00', 'Fundamentos de la Programacion-Junio2019'),
(2, '2019-05-31 12:00:00', '2019-05-31 15:00:00', 'Ingenieria del software-Junio2020'),
(3, '2019-06-12 00:00:00', '2019-06-12 00:05:00', 'Fundamentos de la Programacion-Septiembre2017'),
(5, '2019-05-26 16:54:00', '2019-05-26 20:54:00', 'Ingenieria del software-Mayo2019'),
(6, '2019-05-27 18:15:00', '2019-05-31 22:30:00', 'Fundamentos de la Programacion-Junio2019');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `examen`
--

CREATE TABLE `examen` (
  `id` int(11) NOT NULL,
  `id_asignatura` int(11) NOT NULL,
  `nombre` varchar(256) NOT NULL,
  `id_evento` bigint(20) UNSIGNED DEFAULT NULL,
  `id_grupo` int(11) DEFAULT NULL,
  `id_aula` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `examen`
--

INSERT INTO `examen` (`id`, `id_asignatura`, `nombre`, `id_evento`, `id_grupo`, `id_aula`) VALUES
(12, 14, 'Ingenieria del software-Mayo2019', 5, 4, 1),
(13, 2, 'Fundamentos de la Programacion-Junio2019', 6, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `id` int(11) NOT NULL,
  `curso` int(11) DEFAULT NULL,
  `letra` char(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`id`, `curso`, `letra`) VALUES
(1, 1, 'A'),
(2, 1, 'B'),
(3, 1, 'C'),
(4, 2, 'A'),
(5, 2, 'B'),
(6, 3, 'A'),
(7, 3, 'B'),
(8, 4, 'A'),
(9, 1, 'D'),
(10, 1, 'E'),
(11, 1, 'F');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imparte`
--

CREATE TABLE `imparte` (
  `id_profesor` int(11) DEFAULT NULL,
  `id_asignatura` int(11) DEFAULT NULL,
  `cuatrimestre` int(11) DEFAULT NULL,
  `ano` varchar(256) DEFAULT NULL,
  `id_grupo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `imparte`
--

INSERT INTO `imparte` (`id_profesor`, `id_asignatura`, `cuatrimestre`, `ano`, `id_grupo`) VALUES
(7, 3, 1, '2019', 1),
(9, 13, 1, '2018', 8),
(12, 2, 2, '2019', 1),
(6, 2, 1, '2019', 1),
(6, 14, 1, '2019', 4),
(6, 14, 2, '2019', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelos`
--

CREATE TABLE `modelos` (
  `id_examen` int(11) DEFAULT NULL,
  `modelo` varchar(256) NOT NULL,
  `ruta` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `modelos`
--

INSERT INTO `modelos` (`id_examen`, `modelo`, `ruta`) VALUES
(13, 'Fundamentos de la Programacion-Junio2019-Modelo1.pdf', 'c:\\Users\\ADMIN\\Documents\\UCM\\TFG\\TFG-master\\public\\uploads\\4e6c235e4fddec7ce94b5f68925de898'),
(13, 'Fundamentos de la Programacion-Junio2019-Modelo3.pdf', 'c:\\Users\\ADMIN\\Documents\\UCM\\TFG\\TFG-master\\public\\uploads\\6e8b0e9831ad1e0125759eb03c0193ad'),
(13, 'Fundamentos de la Programacion-Junio2019-Modelo2.pdf', 'c:\\Users\\ADMIN\\Documents\\UCM\\TFG\\TFG-master\\public\\uploads\\f19fa238b7dd43ede4f07deb76e3639c'),
(12, 'Ingenieria del software-Mayo2019-Modelo1.pdf', 'c:\\Users\\ADMIN\\Documents\\UCM\\TFG\\TFG-master\\public\\uploads\\8de3fdab66a86be200368e265e5a0af0'),
(12, 'Ingenieria del software-Mayo2019-Modelo2.pdf', 'c:\\Users\\ADMIN\\Documents\\UCM\\TFG\\TFG-master\\public\\uploads\\f255863bccccf091246572ff7e2f3a8b'),
(12, 'Ingenieria del software-Mayo2019-Modelo3.PDF', 'c:\\Users\\ADMIN\\Documents\\UCM\\TFG\\TFG-master\\public\\uploads\\dae9fe2b6ff940a7150cd36dd9224ef3');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_docente`
--

CREATE TABLE `registro_docente` (
  `id_alumno` int(11) DEFAULT NULL,
  `id_grupo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `registro_docente`
--

INSERT INTO `registro_docente` (`id_alumno`, `id_grupo`) VALUES
(1, 1),
(1, 4),
(2, 4),
(2, 5),
(2, 6),
(2, 2),
(3, 2),
(3, 4),
(4, 1),
(4, 2),
(4, 3),
(4, 7),
(1, 8),
(1, 7),
(2, 8),
(2, 7),
(3, 8),
(3, 5),
(4, 8);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `revisar_examen`
--

CREATE TABLE `revisar_examen` (
  `id_profesor` int(11) DEFAULT NULL,
  `id_evento` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `revisar_examen`
--

INSERT INTO `revisar_examen` (`id_profesor`, `id_evento`) VALUES
(6, 1),
(6, 5),
(6, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_examen`
--

CREATE TABLE `tipo_examen` (
  `id_examen` int(11) DEFAULT NULL,
  `tipo` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `titulacion`
--

CREATE TABLE `titulacion` (
  `id` varchar(256) NOT NULL,
  `nombre` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `titulacion`
--

INSERT INTO `titulacion` (`id`, `nombre`) VALUES
('1', 'Ingenieria del Software'),
('2', 'Ingenieria Informatica'),
('3', 'Ingenieria de Computadores');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actor_universitario`
--
ALTER TABLE `actor_universitario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `asiento`
--
ALTER TABLE `asiento`
  ADD PRIMARY KEY (`id`,`id_aula`),
  ADD KEY `id_aula` (`id_aula`),
  ADD KEY `id_alumno` (`id_alumno`);

--
-- Indices de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_titulacion` (`id_titulacion`);

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_examen`,`id_alumno`,`id_entrega`),
  ADD KEY `id_alumno` (`id_alumno`),
  ADD KEY `id_entrega` (`id_entrega`);

--
-- Indices de la tabla `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `aviso`
--
ALTER TABLE `aviso`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `conectar`
--
ALTER TABLE `conectar`
  ADD KEY `id_profesor` (`id_profesor`);

--
-- Indices de la tabla `entrega`
--
ALTER TABLE `entrega`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_asiento` (`id_asiento`);

--
-- Indices de la tabla `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `examen`
--
ALTER TABLE `examen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_asignatura` (`id_asignatura`),
  ADD KEY `id_grupo` (`id_grupo`),
  ADD KEY `id_aula` (`id_aula`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Indices de la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `imparte`
--
ALTER TABLE `imparte`
  ADD KEY `id_grupo` (`id_grupo`),
  ADD KEY `id_asignatura` (`id_asignatura`),
  ADD KEY `id_profesor` (`id_profesor`);

--
-- Indices de la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD KEY `id_examen` (`id_examen`);

--
-- Indices de la tabla `registro_docente`
--
ALTER TABLE `registro_docente`
  ADD KEY `id_grupo` (`id_grupo`),
  ADD KEY `id_alumno` (`id_alumno`);

--
-- Indices de la tabla `revisar_examen`
--
ALTER TABLE `revisar_examen`
  ADD KEY `id_profesor` (`id_profesor`),
  ADD KEY `id_evento` (`id_evento`);

--
-- Indices de la tabla `tipo_examen`
--
ALTER TABLE `tipo_examen`
  ADD KEY `id_examen` (`id_examen`);

--
-- Indices de la tabla `titulacion`
--
ALTER TABLE `titulacion`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actor_universitario`
--
ALTER TABLE `actor_universitario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `asiento`
--
ALTER TABLE `asiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `aula`
--
ALTER TABLE `aula`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `aviso`
--
ALTER TABLE `aviso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `entrega`
--
ALTER TABLE `entrega`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `examen`
--
ALTER TABLE `examen`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `grupo`
--
ALTER TABLE `grupo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asiento`
--
ALTER TABLE `asiento`
  ADD CONSTRAINT `asiento_ibfk_1` FOREIGN KEY (`id_aula`) REFERENCES `aula` (`id`),
  ADD CONSTRAINT `asiento_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `actor_universitario` (`id`);

--
-- Filtros para la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD CONSTRAINT `asignatura_ibfk_1` FOREIGN KEY (`id_titulacion`) REFERENCES `titulacion` (`id`);

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`id_examen`) REFERENCES `examen` (`id`),
  ADD CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `actor_universitario` (`id`),
  ADD CONSTRAINT `asistencia_ibfk_3` FOREIGN KEY (`id_entrega`) REFERENCES `entrega` (`id`);

--
-- Filtros para la tabla `conectar`
--
ALTER TABLE `conectar`
  ADD CONSTRAINT `conectar_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `actor_universitario` (`id`);

--
-- Filtros para la tabla `entrega`
--
ALTER TABLE `entrega`
  ADD CONSTRAINT `entrega_ibfk_1` FOREIGN KEY (`id_asiento`) REFERENCES `asiento` (`id`);

--
-- Filtros para la tabla `examen`
--
ALTER TABLE `examen`
  ADD CONSTRAINT `examen_ibfk_1` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id`),
  ADD CONSTRAINT `examen_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id`),
  ADD CONSTRAINT `examen_ibfk_3` FOREIGN KEY (`id_aula`) REFERENCES `aula` (`id`),
  ADD CONSTRAINT `examen_ibfk_4` FOREIGN KEY (`id_evento`) REFERENCES `events` (`id`);

--
-- Filtros para la tabla `imparte`
--
ALTER TABLE `imparte`
  ADD CONSTRAINT `imparte_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id`),
  ADD CONSTRAINT `imparte_ibfk_2` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id`),
  ADD CONSTRAINT `imparte_ibfk_3` FOREIGN KEY (`id_profesor`) REFERENCES `actor_universitario` (`id`);

--
-- Filtros para la tabla `modelos`
--
ALTER TABLE `modelos`
  ADD CONSTRAINT `modelos_ibfk_1` FOREIGN KEY (`id_examen`) REFERENCES `examen` (`id`);

--
-- Filtros para la tabla `registro_docente`
--
ALTER TABLE `registro_docente`
  ADD CONSTRAINT `registro_docente_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id`),
  ADD CONSTRAINT `registro_docente_ibfk_2` FOREIGN KEY (`id_alumno`) REFERENCES `actor_universitario` (`id`);

--
-- Filtros para la tabla `revisar_examen`
--
ALTER TABLE `revisar_examen`
  ADD CONSTRAINT `revisar_examen_ibfk_1` FOREIGN KEY (`id_profesor`) REFERENCES `actor_universitario` (`id`),
  ADD CONSTRAINT `revisar_examen_ibfk_2` FOREIGN KEY (`id_evento`) REFERENCES `events` (`id`);

--
-- Filtros para la tabla `tipo_examen`
--
ALTER TABLE `tipo_examen`
  ADD CONSTRAINT `tipo_examen_ibfk_1` FOREIGN KEY (`id_examen`) REFERENCES `examen` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
