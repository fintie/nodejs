-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 09, 2013 at 03:08 AM
-- Server version: 5.5.16
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `plan7984`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE IF NOT EXISTS `activity` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ActorID` int(11) NOT NULL,
  `EstimateID` int(10) NOT NULL,
  `MilestoneID` int(11) DEFAULT NULL,
  `Date` date NOT NULL,
  `Status` varchar(50) NOT NULL,
  `Classification` varchar(50) NOT NULL,
  `Hours` int(11) DEFAULT NULL,
  `Trigger` varchar(100) DEFAULT NULL,
  `Deadline` varchar(50) DEFAULT NULL,
  `Producer` varchar(50) DEFAULT NULL,
  `Proportion` varchar(50) DEFAULT NULL,
  `Resource` varchar(50) DEFAULT NULL,
  `Time` varchar(50) DEFAULT NULL,
  `Reference` varchar(50) NOT NULL,
  `IP address` varchar(50) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=36 ;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`ID`, `ActorID`, `EstimateID`, `MilestoneID`, `Date`, `Status`, `Classification`, `Hours`, `Trigger`, `Deadline`, `Producer`, `Proportion`, `Resource`, `Time`, `Reference`, `IP address`) VALUES
(1, 0, 0, NULL, '0000-00-00', '', '', 20, '', '200', NULL, NULL, NULL, NULL, '', ''),
(2, 0, 0, NULL, '0000-00-00', '', 'design', 30, '', '10', NULL, NULL, NULL, NULL, '', ''),
(3, 0, 0, NULL, '0000-00-00', '', 'development', 45, '', '10', NULL, NULL, NULL, NULL, '', ''),
(4, 0, 0, NULL, '0000-00-00', '', 'design', 11, '', '10', NULL, NULL, NULL, NULL, '', ''),
(5, 0, 0, NULL, '0000-00-00', '', 'development', 22, '', '10', NULL, NULL, NULL, NULL, '', ''),
(6, 0, 0, NULL, '0000-00-00', '', 'design', 21, '', '10', NULL, NULL, NULL, NULL, '', ''),
(7, 0, 0, NULL, '0000-00-00', '', 'development', 32, '', '10', NULL, NULL, NULL, NULL, '', ''),
(8, 0, 0, NULL, '0000-00-00', '', 'formative', 12, '', '111', NULL, NULL, NULL, NULL, '', ''),
(9, 0, 0, NULL, '0000-00-00', '', 'design', 20, '', '200', NULL, NULL, NULL, NULL, '', ''),
(10, 0, 0, NULL, '0000-00-00', '', 'consulting', 12, NULL, '111', NULL, NULL, NULL, NULL, '', ''),
(11, 0, 0, NULL, '0000-00-00', '', 'appointment', 24, NULL, '222', NULL, NULL, NULL, NULL, '', ''),
(12, 0, 103, 12, '0000-00-00', 'Published', 'formative', 50, NULL, '20', NULL, NULL, NULL, NULL, '', ''),
(34, 0, 0, 139, '0000-00-00', '', 'formative', 10, NULL, '100', NULL, NULL, NULL, NULL, '', ''),
(28, 0, 103, 12, '0000-00-00', 'Approved', 'formative', 50, NULL, '20', NULL, NULL, NULL, NULL, '', ''),
(35, 0, 0, 139, '0000-00-00', '', 'appointment', 20, NULL, '200', NULL, NULL, NULL, NULL, '', ''),
(32, 0, 0, 138, '0000-00-00', '', 'formative', 22, NULL, '100', NULL, NULL, NULL, NULL, '', ''),
(33, 0, 0, 138, '0000-00-00', '', 'appointment', 33, NULL, '200', NULL, NULL, NULL, NULL, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE IF NOT EXISTS `customers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `entityname` varchar(100) DEFAULT NULL,
  `ABN` int(11) DEFAULT NULL,
  `Code` varchar(12) NOT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `logo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`ID`, `entityname`, `ABN`, `Code`, `Status`, `logo`) VALUES
(1, 'asdf', 12345, '1234', NULL, NULL),
(2, 'bbb', 22222, '2234', NULL, NULL),
(3, 'ccc', 33333, '3234', '', NULL),
(4, 'gfgghg', 3145423, '4234', NULL, NULL),
(5, 'Test', 55555, '5234', NULL, NULL),
(7, 'Seven', 0, '7234', NULL, NULL),
(8, 'Tree Pty Ltd', 2147483647, 'TPL 101', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `estimates`
--

CREATE TABLE IF NOT EXISTS `estimates` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `CustomerID` int(9) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=140 ;

--
-- Dumping data for table `estimates`
--

INSERT INTO `estimates` (`ID`, `CustomerID`) VALUES
(123, 8),
(122, 8),
(121, 8),
(120, 8),
(132, 1),
(131, 1),
(130, 1),
(129, 1),
(128, 1),
(127, 1),
(126, 1),
(125, 8),
(124, 8),
(98, 3),
(97, 3),
(119, 8),
(118, 8),
(117, 8),
(116, 8),
(115, 8),
(114, 8),
(113, 8),
(112, 8),
(111, 8),
(110, 7),
(109, 7),
(108, 7),
(107, 7),
(106, 7),
(105, 7),
(104, 7),
(103, 7),
(102, 3),
(101, 3),
(100, 3),
(99, 3),
(133, 4),
(134, 4),
(135, 2),
(136, 2),
(137, 2),
(138, 1),
(139, 1);

-- --------------------------------------------------------

--
-- Table structure for table `milestones`
--

CREATE TABLE IF NOT EXISTS `milestones` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `EstimateID` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `milestones`
--

INSERT INTO `milestones` (`ID`, `EstimateID`) VALUES
(12, 103),
(11, 0),
(10, 0),
(9, 100),
(8, 99),
(6, 97),
(7, 98),
(13, 104),
(14, 109),
(15, 110),
(16, 125),
(17, 126),
(18, 131),
(19, 132),
(20, 133),
(21, 134),
(22, 135),
(23, 136),
(24, 137),
(25, 138),
(26, 139),
(27, 139);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `Customer ID` int(10) DEFAULT NULL,
  `Position description` varchar(50) DEFAULT NULL,
  `Classification` varchar(50) DEFAULT NULL,
  `Ranking` int(9) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
