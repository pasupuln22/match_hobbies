-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 27, 2023 at 04:48 AM
-- Server version: 8.2.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `interests`
--

CREATE TABLE `interests` (
  `s_no` int NOT NULL,
  `user` varchar(255) NOT NULL,
  `hobbies` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `datetime` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `interests`
--

INSERT INTO `interests` (`s_no`, `user`, `hobbies`, `location`, `datetime`) VALUES
(1, 'John Doe', 'Hiking', 'New York', '2023-11-13 08:30:00'),
(2, 'Jane Smith', 'Swimming', 'Los Angeles', '2023-11-13 09:15:00'),
(3, 'Bob Johnson', 'Gaming', 'Chicago', '2023-11-13 10:00:00'),
(4, 'Alice Brown', 'Traveling', 'San Francisco', '2023-11-13 10:45:00'),
(5, 'Charlie Wilson', 'Fishing', 'Houston', '2023-11-13 11:30:00'),
(6, 'Eva Miller', 'Dancing', 'Miami', '2023-11-13 12:15:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `interests`
--
ALTER TABLE `interests`
  ADD PRIMARY KEY (`s_no`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
