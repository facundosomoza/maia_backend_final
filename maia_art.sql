-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2023 a las 13:24:38
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `maia_art`
--
CREATE DATABASE IF NOT EXISTS `maia_art` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `maia_art`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_obra_arte` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_obra_arte`, `id_usuario`) VALUES
(1, 31),
(1, 59),
(1, 60),
(1, 61),
(1, 62),
(1, 64),
(1, 66),
(2, 31),
(2, 61),
(2, 63),
(3, 31),
(5, 59);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `countries`
--

INSERT INTO `countries` (`id`, `name`) VALUES
(1, 'Argentina'),
(2, 'England'),
(3, 'Uruguay'),
(4, 'Paraguay'),
(5, 'Venezuela');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuadros_arte`
--

CREATE TABLE `cuadros_arte` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `order_picture` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cuadros_arte`
--

INSERT INTO `cuadros_arte` (`id`, `name`, `price`, `description`, `order_picture`) VALUES
(1, 'arg', 500, 'solid', 1),
(2, 'mamamamama2222', 12000, 'solid3333', 2),
(3, 'rrrrrrrrrrrrrrrrrrrrrrrr', 400, 'soft solid', 3),
(4, 'Presence', 600, 'Acrylic Paint', 4),
(5, 'Illumine', 600, 'Mixed Media', 5),
(6, 'Nightfall', 600, 'Acrylic on Canvas 120x90 cm', 6),
(7, 'Pierrot', 600, 'Mixed media on Canvas 120x90 cm', 7),
(8, 'Nirvana', 600, 'Mixed media on Canvas 120x90 cm', 8),
(9, 'Radiance', 600, 'Acrylic Paint on Canvas 90 x 60 cm', 9),
(10, 'Surrender', 600, 'Acrylic Paint on Canvas 90 x 60 cm', 10),
(11, 'Tranquil', 600, 'Acrylic Paint on Canvas 90 x 60 cm', 11),
(12, 'Farewall', 600, 'Mixed Media on Canvas 120 x 90 cm', 12),
(13, 'Felicity', 600, 'Acrylic Paint on Deep Edge Canvas 120 x 60 com', 13),
(14, 'Ethereal', 600, 'Acrylic Paint, Oil Pastels, Gloss Finish', 14);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_cuadros_arte`
--

CREATE TABLE `imagenes_cuadros_arte` (
  `id` int(11) NOT NULL,
  `id_cuadros_arte` int(11) NOT NULL,
  `file_image` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `imagenes_cuadros_arte`
--

INSERT INTO `imagenes_cuadros_arte` (`id`, `id_cuadros_arte`, `file_image`) VALUES
(1, 1, 'image1.JPG'),
(2, 2, 'image2.JPG'),
(3, 3, 'image3.JPG'),
(4, 4, 'image4.JPG'),
(5, 5, 'image5.JPG'),
(6, 1, 'image5.JPG'),
(7, 6, 'image6.JPG'),
(8, 7, 'image7.JPG'),
(9, 8, 'image8.JPG'),
(10, 9, 'image9.JPG'),
(11, 10, 'image10.JPG'),
(12, 11, 'image11.JPG'),
(13, 12, 'image12.JPG'),
(14, 13, 'image13.JPG'),
(15, 14, 'image14.jpg'),
(16, 1, 'image7.JPG'),
(17, 1, 'image12.JPG'),
(18, 3, 'image9.JPG'),
(39, 2, 'image2.JPG'),
(40, 2, 'image2.JPG'),
(41, 2, 'image2.JPG');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchases`
--

CREATE TABLE `purchases` (
  `id` int(11) NOT NULL,
  `address` varchar(70) NOT NULL,
  `city` varchar(50) NOT NULL,
  `id_country` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `id_user` int(11) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `postcode` varchar(50) NOT NULL,
  `id_obra_arte` int(11) NOT NULL,
  `price_picture` int(11) NOT NULL,
  `fecha_compra` datetime NOT NULL DEFAULT current_timestamp(),
  `estado_pago` enum('no_pagado','pagado','','') NOT NULL DEFAULT 'no_pagado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `password`) VALUES
(31, 'fsomoza@gmail.com', '123456'),
(32, 'pablo@gmail.com', '123456'),
(33, 'irma@gmail.com', '123456'),
(34, 'ale@gmail.com', '123456'),
(35, 'aa@gmail.com', '123456'),
(36, 'b@gmail.com', '123456'),
(37, 'q@gmail.com', '123456'),
(38, 'qqqq@gmail.com', '123456'),
(39, 'p@gmail.com', '123456'),
(40, 'ee@gmail.com', '123456'),
(41, 'oo@gmail.com', '123456'),
(42, 'tt@gmail.com', '123456'),
(43, 'rrr@gmail.com', '123456'),
(44, 'newnew@gmail.com', '123456'),
(45, 'ppp@gmail.com', '123456'),
(46, 'rfrf@gmail.com', '123456'),
(47, '7878@gmail.com', '123456'),
(48, 'eeeeeeeeee@gmail.com', '123456'),
(49, 'weweee@gmail.com', '123456'),
(50, 'aasss@gmail.com', '123456'),
(51, 'azaz@gmail.com', '123456'),
(52, 'xxx@gmail.com', '123456'),
(53, 'prpr@gmail.com', '123456'),
(54, 'oooo@gmail.com', '123456'),
(55, 'lll@gmail.com', '123456'),
(56, 'gggee@gmail.com', '123456'),
(57, 'ene@gmail.com', '123456'),
(58, 'pipiiii@gmail.com', '123456'),
(59, 'mit@gmail.com', '123456'),
(60, 'peter@gmail.com', '123456'),
(61, 'alas@gmail.com', '123456'),
(62, 'alas2@gmail.com', '123456'),
(63, 'alas3@gmail.com', '123456'),
(64, 'ret@gmail.com', '123456'),
(66, 'qwert@gmail.com', '123456'),
(69, 'fsomozaq@gmail.com', '123456'),
(70, 'fsomozaqqqqqq@gmail.com', '123456'),
(71, 'maia@gmail.com', 'ninuca1010');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_obra_arte`,`id_usuario`) USING BTREE,
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `cuadros_arte`
--
ALTER TABLE `cuadros_arte`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `imagenes_cuadros_arte`
--
ALTER TABLE `imagenes_cuadros_arte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_cuadros_arte` (`id_cuadros_arte`);

--
-- Indices de la tabla `purchases`
--
ALTER TABLE `purchases`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_country` (`id_country`),
  ADD KEY `id_obra_arte` (`id_obra_arte`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_obra_arte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `cuadros_arte`
--
ALTER TABLE `cuadros_arte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `imagenes_cuadros_arte`
--
ALTER TABLE `imagenes_cuadros_arte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `purchases`
--
ALTER TABLE `purchases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_obra_arte`) REFERENCES `cuadros_arte` (`id`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `imagenes_cuadros_arte`
--
ALTER TABLE `imagenes_cuadros_arte`
  ADD CONSTRAINT `imagenes_cuadros_arte_ibfk_1` FOREIGN KEY (`id_cuadros_arte`) REFERENCES `cuadros_arte` (`id`);

--
-- Filtros para la tabla `purchases`
--
ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`id_country`) REFERENCES `countries` (`id`),
  ADD CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`id_obra_arte`) REFERENCES `cuadros_arte` (`id`),
  ADD CONSTRAINT `purchases_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
